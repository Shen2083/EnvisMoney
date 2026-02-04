"""
Envis Insight Engine - Model Architecture

Multi-modal neural network for household financial coaching.

Architecture Reference: Appendix S, Part 1.2 Architecture Design

Components:
- Transaction Encoder: 4-layer Transformer
- Text Encoder: FinBERT with adapters
- Household Encoder: 3-layer Graph Attention Network
- Cross-Modal Fusion: Bidirectional attention with gating
- Multi-Task Heads: Distress, Timing, Framing, Goal-Risk, Tension
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass

# Note: These would be actual imports in production
# from transformers import AutoModel, AutoTokenizer
# from torch_geometric.nn import GATConv


@dataclass
class ModelConfig:
    """Configuration for the Envis Insight Engine model."""
    
    # Transaction Encoder
    transaction_vocab_size: int = 8001  # merchants
    transaction_embedding_dim: int = 256
    transaction_num_layers: int = 4
    transaction_num_heads: int = 8
    transaction_ff_dim: int = 1024
    
    # Amount encoding
    num_amount_buckets: int = 12
    amount_embedding_dim: int = 32
    
    # Category encoding
    num_categories: int = 120
    category_embedding_dim: int = 64
    
    # Text Encoder
    text_model_name: str = "ProsusAI/finbert"
    text_embedding_dim: int = 768
    adapter_bottleneck_dim: int = 64
    
    # Household Encoder
    household_hidden_dim: int = 64
    household_num_layers: int = 3
    household_num_heads: int = 4
    
    # Fusion
    fusion_dim: int = 512
    
    # Training
    dropout: float = 0.1
    
    # Output
    num_framing_classes: int = 5
    num_urgency_classes: int = 3


class AmountEncoder(nn.Module):
    """
    Encodes transaction amounts using log-scale bucket embeddings.
    
    Buckets: [£0-1], [£1-2], [£2-5], [£5-10], [£10-20], [£20-50],
             [£50-100], [£100-200], [£200-500], [£500-1000], 
             [£1000-2000], [£2000+]
    """
    
    BUCKET_BOUNDARIES = [0, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, float('inf')]
    
    def __init__(self, config: ModelConfig):
        super().__init__()
        self.embedding = nn.Embedding(config.num_amount_buckets, config.amount_embedding_dim)
    
    def amount_to_bucket(self, amount: torch.Tensor) -> torch.Tensor:
        """Convert amount to bucket index."""
        buckets = torch.zeros_like(amount, dtype=torch.long)
        for i, boundary in enumerate(self.BUCKET_BOUNDARIES[1:]):
            buckets += (amount >= boundary).long()
        return buckets.clamp(0, len(self.BUCKET_BOUNDARIES) - 2)
    
    def forward(self, amounts: torch.Tensor) -> torch.Tensor:
        bucket_indices = self.amount_to_bucket(amounts)
        return self.embedding(bucket_indices)


class TemporalEncoder(nn.Module):
    """Encodes temporal information (day of week, day of month, month)."""
    
    def __init__(self, positional_dim: int = 64):
        super().__init__()
        self.day_of_week = nn.Embedding(7, 7)
        self.day_of_month = nn.Embedding(31, 31)
        self.month = nn.Embedding(12, 12)
        self.positional = nn.Embedding(512, positional_dim)  # Max sequence length
    
    def forward(
        self, 
        day_of_week: torch.Tensor,
        day_of_month: torch.Tensor,
        month: torch.Tensor,
        positions: torch.Tensor
    ) -> torch.Tensor:
        return torch.cat([
            self.day_of_week(day_of_week),
            self.day_of_month(day_of_month),
            self.month(month),
            self.positional(positions),
        ], dim=-1)


class TransactionEncoder(nn.Module):
    """
    4-layer Transformer encoder for transaction sequences.
    
    Input: Transaction tuples (amount, category, merchant, timestamp)
    Output: Sequence of transaction embeddings (batch, seq_len, 256)
    """
    
    def __init__(self, config: ModelConfig):
        super().__init__()
        self.config = config
        
        # Embedding layers
        self.amount_encoder = AmountEncoder(config)
        self.category_embedding = nn.Embedding(
            config.num_categories, config.category_embedding_dim
        )
        self.merchant_embedding = nn.Embedding(
            config.transaction_vocab_size, config.category_embedding_dim
        )
        self.temporal_encoder = TemporalEncoder()
        
        # Calculate combined embedding dimension
        # amount(32) + category(64) + merchant(64) + temporal(7+31+12+64=114) ≈ 274
        combined_dim = (
            config.amount_embedding_dim + 
            config.category_embedding_dim + 
            config.category_embedding_dim +
            114  # temporal
        )
        
        # Project to transformer dimension
        self.input_projection = nn.Linear(combined_dim, config.transaction_embedding_dim)
        
        # Transformer encoder
        encoder_layer = nn.TransformerEncoderLayer(
            d_model=config.transaction_embedding_dim,
            nhead=config.transaction_num_heads,
            dim_feedforward=config.transaction_ff_dim,
            dropout=config.dropout,
            batch_first=True,
        )
        self.transformer = nn.TransformerEncoder(
            encoder_layer, 
            num_layers=config.transaction_num_layers
        )
    
    def forward(
        self,
        amounts: torch.Tensor,
        categories: torch.Tensor,
        merchants: torch.Tensor,
        day_of_week: torch.Tensor,
        day_of_month: torch.Tensor,
        month: torch.Tensor,
        attention_mask: Optional[torch.Tensor] = None,
    ) -> torch.Tensor:
        batch_size, seq_len = amounts.shape
        positions = torch.arange(seq_len, device=amounts.device).expand(batch_size, -1)
        
        # Embed all features
        amount_emb = self.amount_encoder(amounts)
        category_emb = self.category_embedding(categories)
        merchant_emb = self.merchant_embedding(merchants)
        temporal_emb = self.temporal_encoder(day_of_week, day_of_month, month, positions)
        
        # Combine embeddings
        combined = torch.cat([amount_emb, category_emb, merchant_emb, temporal_emb], dim=-1)
        
        # Project and encode
        projected = self.input_projection(combined)
        
        # Create attention mask for transformer
        if attention_mask is not None:
            # Convert to transformer format (True = ignore)
            src_key_padding_mask = ~attention_mask.bool()
        else:
            src_key_padding_mask = None
        
        encoded = self.transformer(projected, src_key_padding_mask=src_key_padding_mask)
        
        return encoded


class Adapter(nn.Module):
    """
    Adapter module for parameter-efficient fine-tuning.
    
    Reference: Houlsby et al., 2019
    """
    
    def __init__(self, input_dim: int, bottleneck_dim: int):
        super().__init__()
        self.down_project = nn.Linear(input_dim, bottleneck_dim)
        self.up_project = nn.Linear(bottleneck_dim, input_dim)
        self.activation = nn.GELU()
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        residual = x
        x = self.down_project(x)
        x = self.activation(x)
        x = self.up_project(x)
        return x + residual


class TextEncoder(nn.Module):
    """
    FinBERT-based text encoder with adapter fine-tuning.
    
    Base Model: ProsusAI/finbert (768-dim)
    Fine-tuning: Adapter-based (5% trainable parameters)
    """
    
    def __init__(self, config: ModelConfig):
        super().__init__()
        self.config = config
        
        # In production, load actual FinBERT:
        # self.bert = AutoModel.from_pretrained(config.text_model_name)
        # For demonstration, we create a placeholder
        self.bert_dim = config.text_embedding_dim
        
        # Adapters (12 layers for BERT-base)
        self.adapters = nn.ModuleList([
            Adapter(config.text_embedding_dim, config.adapter_bottleneck_dim)
            for _ in range(12)
        ])
        
        # Freeze BERT parameters (in production)
        # for param in self.bert.parameters():
        #     param.requires_grad = False
    
    def forward(
        self,
        input_ids: torch.Tensor,
        attention_mask: torch.Tensor,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Returns:
            cls_embedding: Sentence-level representation (batch, 768)
            token_embeddings: Token-level representations (batch, seq_len, 768)
        """
        # In production:
        # outputs = self.bert(input_ids, attention_mask=attention_mask)
        # Apply adapters to each layer output
        
        # Placeholder for demonstration
        batch_size, seq_len = input_ids.shape
        
        # Simulated outputs (replace with actual BERT outputs)
        token_embeddings = torch.randn(batch_size, seq_len, self.bert_dim)
        cls_embedding = token_embeddings[:, 0, :]  # CLS token
        
        return cls_embedding, token_embeddings


class GraphAttentionLayer(nn.Module):
    """
    Single Graph Attention Network layer.
    
    Reference: Veličković et al., 2018
    """
    
    def __init__(self, in_features: int, out_features: int, num_heads: int, dropout: float):
        super().__init__()
        self.num_heads = num_heads
        self.out_features = out_features
        
        self.W = nn.Linear(in_features, out_features * num_heads, bias=False)
        self.a = nn.Parameter(torch.zeros(num_heads, 2 * out_features))
        nn.init.xavier_uniform_(self.a)
        
        self.leaky_relu = nn.LeakyReLU(0.2)
        self.dropout = nn.Dropout(dropout)
    
    def forward(
        self,
        x: torch.Tensor,
        edge_index: torch.Tensor,
    ) -> torch.Tensor:
        # Linear transformation
        h = self.W(x).view(-1, self.num_heads, self.out_features)
        
        # Compute attention coefficients
        source, target = edge_index
        
        # Concatenate source and target features
        alpha = torch.cat([h[source], h[target]], dim=-1)
        alpha = (alpha * self.a).sum(dim=-1)
        alpha = self.leaky_relu(alpha)
        
        # Softmax over neighbors
        alpha = F.softmax(alpha, dim=0)
        alpha = self.dropout(alpha)
        
        # Aggregate
        out = torch.zeros_like(h)
        out.index_add_(0, target, alpha.unsqueeze(-1) * h[source])
        
        return out.mean(dim=1)  # Average over heads


class HouseholdEncoder(nn.Module):
    """
    3-layer Graph Attention Network for household structure.
    
    Encodes family relationships and member roles.
    """
    
    def __init__(self, config: ModelConfig):
        super().__init__()
        
        # Node feature dimensions
        # role(5) + age_bracket(6) + income_bracket(4) + goal_participation(variable)
        node_feature_dim = 5 + 6 + 4 + 10  # Assume max 10 goals
        
        self.input_projection = nn.Linear(node_feature_dim, config.household_hidden_dim)
        
        self.layers = nn.ModuleList([
            GraphAttentionLayer(
                in_features=config.household_hidden_dim,
                out_features=config.household_hidden_dim,
                num_heads=config.household_num_heads,
                dropout=config.dropout,
            )
            for _ in range(config.household_num_layers)
        ])
        
        # Attention-weighted pooling
        self.pool_attention = nn.Linear(config.household_hidden_dim, 1)
    
    def forward(
        self,
        node_features: torch.Tensor,
        edge_index: torch.Tensor,
        batch: Optional[torch.Tensor] = None,
    ) -> Tuple[torch.Tensor, torch.Tensor]:
        """
        Returns:
            household_embedding: Pooled household representation
            member_embeddings: Per-member representations
            attention_weights: Interpretable weights showing member importance
        """
        x = self.input_projection(node_features)
        
        for layer in self.layers:
            x = F.elu(layer(x, edge_index))
        
        # Attention-weighted pooling
        attention_scores = self.pool_attention(x)
        attention_weights = F.softmax(attention_scores, dim=0)
        household_embedding = (attention_weights * x).sum(dim=0)
        
        return household_embedding, x


class CrossModalFusion(nn.Module):
    """
    Bidirectional cross-attention fusion layer.
    
    Implements three attention mechanisms:
    1. Transaction-to-Text: Transactions attend to text tokens
    2. Text-to-Household: Text attends to member representations
    3. Transaction-to-Household: Transactions attend to members
    
    Outputs are combined via learned gating.
    """
    
    def __init__(self, config: ModelConfig):
        super().__init__()
        
        # Attention layers
        self.trans_to_text = nn.MultiheadAttention(
            embed_dim=config.transaction_embedding_dim,
            num_heads=8,
            dropout=config.dropout,
            batch_first=True,
        )
        
        self.text_to_household = nn.MultiheadAttention(
            embed_dim=config.text_embedding_dim,
            num_heads=8,
            dropout=config.dropout,
            batch_first=True,
        )
        
        self.trans_to_household = nn.MultiheadAttention(
            embed_dim=config.transaction_embedding_dim,
            num_heads=8,
            dropout=config.dropout,
            batch_first=True,
        )
        
        # Projection layers for dimension matching
        self.household_proj = nn.Linear(config.household_hidden_dim, config.text_embedding_dim)
        self.household_proj_trans = nn.Linear(config.household_hidden_dim, config.transaction_embedding_dim)
        
        # Gated fusion
        total_dim = (config.transaction_embedding_dim + 
                     config.text_embedding_dim + 
                     config.transaction_embedding_dim)
        self.gate = nn.Linear(total_dim, 3)
        self.output_proj = nn.Linear(total_dim, config.fusion_dim)
    
    def forward(
        self,
        transaction_emb: torch.Tensor,
        text_emb: torch.Tensor,
        text_tokens: torch.Tensor,
        household_emb: torch.Tensor,
        member_embs: torch.Tensor,
    ) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        """
        Returns:
            fused: Fused representation (batch, fusion_dim)
            attention_weights: Dict of attention weights for interpretability
        """
        batch_size = transaction_emb.shape[0]
        
        # Pool transaction embeddings
        trans_pooled = transaction_emb.mean(dim=1)  # (batch, 256)
        
        # 1. Transaction-to-Text attention
        trans_text, trans_text_weights = self.trans_to_text(
            trans_pooled.unsqueeze(1),
            text_tokens,
            text_tokens,
        )
        trans_text = trans_text.squeeze(1)
        
        # 2. Text-to-Household attention
        member_proj = self.household_proj(member_embs).unsqueeze(0).expand(batch_size, -1, -1)
        text_house, text_house_weights = self.text_to_household(
            text_emb.unsqueeze(1),
            member_proj,
            member_proj,
        )
        text_house = text_house.squeeze(1)
        
        # 3. Transaction-to-Household attention
        member_proj_trans = self.household_proj_trans(member_embs).unsqueeze(0).expand(batch_size, -1, -1)
        trans_house, trans_house_weights = self.trans_to_household(
            trans_pooled.unsqueeze(1),
            member_proj_trans,
            member_proj_trans,
        )
        trans_house = trans_house.squeeze(1)
        
        # Gated combination
        combined = torch.cat([trans_text, text_house, trans_house], dim=-1)
        gate_weights = F.softmax(self.gate(combined), dim=-1)
        
        # Apply gates (element-wise)
        gated = combined * gate_weights.repeat(1, combined.shape[-1] // 3)
        
        # Final projection
        fused = self.output_proj(gated)
        
        attention_weights = {
            'transaction_to_text': trans_text_weights,
            'text_to_household': text_house_weights,
            'transaction_to_household': trans_house_weights,
            'gate_weights': gate_weights,
        }
        
        return fused, attention_weights


class DistressHead(nn.Module):
    """Prediction head for distress risk (binary)."""
    
    def __init__(self, input_dim: int):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 1),
            nn.Sigmoid(),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.layers(x).squeeze(-1)


class TimingHead(nn.Module):
    """Prediction head for intervention timing."""
    
    def __init__(self, input_dim: int, num_urgency_classes: int = 3):
        super().__init__()
        self.delay_predictor = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 1),
        )
        self.urgency_classifier = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, num_urgency_classes),
        )
    
    def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        delay = self.delay_predictor(x).squeeze(-1)
        urgency_logits = self.urgency_classifier(x)
        return delay, urgency_logits


class FramingHead(nn.Module):
    """Prediction head for message framing selection."""
    
    def __init__(self, input_dim: int, num_classes: int = 5):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, num_classes),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(x)


class GoalRiskHead(nn.Module):
    """Prediction head for goal achievement risk (multi-label)."""
    
    def __init__(self, input_dim: int, max_goals: int = 10):
        super().__init__()
        self.classifier = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, max_goals),
            nn.Sigmoid(),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.classifier(x)


class TensionHead(nn.Module):
    """Prediction head for household tension (binary)."""
    
    def __init__(self, input_dim: int):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_dim, 256),
            nn.ReLU(),
            nn.Linear(256, 1),
            nn.Sigmoid(),
        )
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.layers(x).squeeze(-1)


class EnvisInsightEngine(nn.Module):
    """
    Envis Insight Engine - Main Model
    
    Multi-modal, multi-task neural network for household financial coaching.
    
    Total Parameters: ~131M (110M FinBERT + 21M new components)
    """
    
    def __init__(self, config: Optional[ModelConfig] = None):
        super().__init__()
        self.config = config or ModelConfig()
        
        # Encoders
        self.transaction_encoder = TransactionEncoder(self.config)
        self.text_encoder = TextEncoder(self.config)
        self.household_encoder = HouseholdEncoder(self.config)
        
        # Fusion
        self.fusion = CrossModalFusion(self.config)
        
        # Prediction heads
        self.distress_head = DistressHead(self.config.fusion_dim)
        self.timing_head = TimingHead(self.config.fusion_dim, self.config.num_urgency_classes)
        self.framing_head = FramingHead(self.config.fusion_dim, self.config.num_framing_classes)
        self.goal_risk_head = GoalRiskHead(self.config.fusion_dim)
        self.tension_head = TensionHead(self.config.fusion_dim)
        
        # Uncertainty weights for multi-task learning (Kendall et al., 2018)
        self.log_vars = nn.Parameter(torch.zeros(5))
    
    def forward(
        self,
        # Transaction inputs
        amounts: torch.Tensor,
        categories: torch.Tensor,
        merchants: torch.Tensor,
        day_of_week: torch.Tensor,
        day_of_month: torch.Tensor,
        month: torch.Tensor,
        transaction_mask: Optional[torch.Tensor] = None,
        # Text inputs
        text_input_ids: torch.Tensor = None,
        text_attention_mask: torch.Tensor = None,
        # Household inputs
        node_features: torch.Tensor = None,
        edge_index: torch.Tensor = None,
    ) -> Dict[str, torch.Tensor]:
        """
        Forward pass through all encoders and prediction heads.
        
        Returns dict with all predictions and attention weights for interpretability.
        """
        # Encode transactions
        transaction_emb = self.transaction_encoder(
            amounts, categories, merchants,
            day_of_week, day_of_month, month,
            transaction_mask,
        )
        
        # Encode text
        text_cls, text_tokens = self.text_encoder(text_input_ids, text_attention_mask)
        
        # Encode household
        household_emb, member_embs = self.household_encoder(node_features, edge_index)
        
        # Cross-modal fusion
        fused, attention_weights = self.fusion(
            transaction_emb, text_cls, text_tokens,
            household_emb, member_embs,
        )
        
        # Predictions
        distress_risk = self.distress_head(fused)
        timing_delay, timing_urgency = self.timing_head(fused)
        framing_logits = self.framing_head(fused)
        goal_risk = self.goal_risk_head(fused)
        tension = self.tension_head(fused)
        
        return {
            'distress_risk': distress_risk,
            'timing_delay': timing_delay,
            'timing_urgency': timing_urgency,
            'framing_logits': framing_logits,
            'goal_risk': goal_risk,
            'tension': tension,
            'attention_weights': attention_weights,
            'log_vars': self.log_vars,
        }
    
    def compute_loss(
        self,
        predictions: Dict[str, torch.Tensor],
        targets: Dict[str, torch.Tensor],
    ) -> Tuple[torch.Tensor, Dict[str, torch.Tensor]]:
        """
        Compute uncertainty-weighted multi-task loss.
        
        Reference: Kendall et al., 2018
        """
        losses = {}
        
        # Distress loss (BCE)
        losses['distress'] = F.binary_cross_entropy(
            predictions['distress_risk'],
            targets['distress'].float(),
        )
        
        # Timing losses
        losses['timing_delay'] = F.mse_loss(
            predictions['timing_delay'],
            targets['timing_delay'].float(),
        )
        losses['timing_urgency'] = F.cross_entropy(
            predictions['timing_urgency'],
            targets['timing_urgency'],
        )
        
        # Framing loss
        losses['framing'] = F.cross_entropy(
            predictions['framing_logits'],
            targets['framing'],
        )
        
        # Tension loss
        losses['tension'] = F.binary_cross_entropy(
            predictions['tension'],
            targets['tension'].float(),
        )
        
        # Uncertainty-weighted combination
        log_vars = predictions['log_vars']
        weighted_losses = []
        
        for i, (name, loss) in enumerate(losses.items()):
            precision = torch.exp(-log_vars[i % 5])
            weighted_loss = precision * loss + log_vars[i % 5]
            weighted_losses.append(weighted_loss)
        
        total_loss = sum(weighted_losses)
        
        return total_loss, losses
    
    @classmethod
    def load(cls, checkpoint_path: str) -> 'EnvisInsightEngine':
        """Load model from checkpoint."""
        checkpoint = torch.load(checkpoint_path)
        config = checkpoint.get('config', ModelConfig())
        model = cls(config)
        model.load_state_dict(checkpoint['model_state_dict'])
        return model
    
    def save(self, checkpoint_path: str, optimizer=None, epoch=None):
        """Save model checkpoint."""
        checkpoint = {
            'config': self.config,
            'model_state_dict': self.state_dict(),
        }
        if optimizer:
            checkpoint['optimizer_state_dict'] = optimizer.state_dict()
        if epoch:
            checkpoint['epoch'] = epoch
        torch.save(checkpoint, checkpoint_path)


def count_parameters(model: nn.Module) -> int:
    """Count trainable parameters."""
    return sum(p.numel() for p in model.parameters() if p.requires_grad)


if __name__ == "__main__":
    # Demonstrate model creation
    config = ModelConfig()
    model = EnvisInsightEngine(config)
    
    print("Envis Insight Engine")
    print("=" * 50)
    print(f"Total parameters: {count_parameters(model):,}")
    print(f"Configuration: {config}")
