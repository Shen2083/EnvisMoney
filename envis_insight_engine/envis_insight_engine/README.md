---
language:
- en
license: other
tags:
- finance
- finbert
- multi-task
- household-finance
- financial-distress
- coaching
library_name: pytorch
pipeline_tag: text-classification
---

# Envis Insight Engine v2

**A multi-modal, multi-task neural network for household financial distress detection and coaching intervention planning.**

The Envis Insight Engine is the intelligence layer of the Envis Technologies platform. It processes financial transactions, behavioural text, and household context to produce coordinated predictions for distress risk, intervention timing, message framing, goal risk, and household tension — enabling personalised, empathetic financial coaching at scale.

## Model Details

| Attribute | Value |
|---|---|
| **Architecture** | Multi-modal Transformer with cross-attention fusion |
| **Text encoder** | FinBERT (ProsusAI) with last 3 layers unfrozen + adapter fine-tuning |
| **Transaction encoder** | 4-layer Transformer, 8 heads, 256-dim embeddings |
| **Household encoder** | 3-layer Graph Attention Network, 4 heads, 64 hidden dim |
| **Fusion** | Bidirectional cross-attention with gated combination, 512-dim |
| **Total parameters** | ~130M (110M FinBERT + 20M new components) |
| **Training** | 12 epochs, best at epoch 7, early stopping |
| **Compute** | Google Colab, mixed precision fp16 |
| **Framework** | PyTorch |

## v2 Improvements over v1

- Unfrozen last 3 FinBERT layers with differential learning rates
- Unified distress/sub-indicator 5-class classification head
- Log1p timing delay with Huber loss
- Class-weighted cross-entropy for framing/urgency/distress
- BCEWithLogitsLoss with pos_weight for tension/goal_risk
- Cross-attention fusion (replacing concatenation)
- Residual prediction heads
- Mixed precision fp16 with gradient accumulation
- Optimised sequence lengths (MAX_TEXT=128, MAX_TRANS=20)

## Five Prediction Outputs

| Output | Type | Description |
|---|---|---|
| **Distress risk** | 5-class classification | None / Low / Moderate / High / Severe |
| **Nudge timing** | Regression + 3-class | Optimal delay (hours) + urgency (immediate / soon / can_wait) |
| **Framing selection** | 5-class classification | Supportive / Direct / Celebratory / Gentle / Urgent |
| **Goal risk** | Binary probability | Likelihood of missing savings targets |
| **Household tension** | Binary probability | Financial tension between household members |

## Test Set Performance

| Metric | v1 | v2 | Improvement |
|---|---|---|---|
| **Distress AUC** | 0.831 | **0.995** | +19.7% |
| **Distress 5-class F1** | 0.447* | **0.903** | +102% |
| **Framing accuracy** | 0.730 | **0.782** | +7.1% |
| **Framing F1** | 0.720 | **0.731** | +1.5% |
| **Tension AUC** | 0.790 | **0.991** | +25.4% |
| **Goal risk AUC** | 0.760 | **0.779** | +2.5% |
| **Timing MAE (hours)** | — | **67.4** | New metric |
| **Urgency accuracy** | — | **0.584** | New metric |

*v1 distress was binary; v2 is 5-class, making direct F1 comparison approximate.*

### Distress Classification (5-class Confusion Matrix)

| | Pred: None | Pred: Low | Pred: Mod | Pred: High | Pred: Severe |
|---|---|---|---|---|---|
| **Actual: None** | 569 | 10 | 2 | 1 | 0 |
| **Actual: Low** | 10 | 230 | 0 | 0 | 0 |
| **Actual: Moderate** | 0 | 3 | 24 | 0 | 0 |
| **Actual: High** | 2 | 2 | 1 | 17 | 2 |
| **Actual: Severe** | 0 | 2 | 0 | 1 | 26 |

### Binary Distress Detection

| | Pred: No Distress | Pred: Distress |
|---|---|---|
| **Actual: No Distress** | 573 | 9 |
| **Actual: Distress** | 12 | 308 |

Binary distress threshold: 0.79. Precision: 97.2%, Recall: 96.3%.

## Training Data

| Detail | Value |
|---|---|
| **Source** | 487,291 household-filtered financial records |
| **Labelled subset** | 8,234 records (manually annotated) |
| **Train split** | 80% (6,587 records) |
| **Validation split** | 10% (823 records) |
| **Test split** | 10% (824 records) |
| **Inter-annotator agreement** | Cohen's κ = 0.61–0.74 |
| **Labelling date** | July 2025 |

### Input Features

- **Transaction data**: Merchant descriptions, amounts (13 buckets), categories (120 types), temporal patterns
- **Behavioural text**: User messages, notes, and financial context text
- **Household context**: Member roles, ages, income brackets, relationship structure (graph)

## Training Configuration

```
Epochs: 12 (best at epoch 7)
Optimiser: AdamW with differential learning rates
  - FinBERT unfrozen layers: 1e-5
  - New components: 5e-5
Weight decay: 0.01
Scheduler: Linear warmup + cosine decay
Mixed precision: fp16
Gradient accumulation: Enabled
Loss functions:
  - Distress: Class-weighted cross-entropy
  - Framing: Class-weighted cross-entropy
  - Urgency: Class-weighted cross-entropy
  - Tension: BCE with pos_weight
  - Goal risk: BCE with pos_weight
  - Timing: Huber loss on log1p-transformed delay
```

### Training Progression

| Epoch | Train Loss | Val Loss | Distress F1 | Framing F1 | Tension AUC |
|---|---|---|---|---|---|
| 1 | 5.76 | 3.65 | 0.595 | 0.325 | 0.988 |
| 3 | 2.89 | 2.68 | 0.843 | 0.535 | 0.991 |
| 5 | 2.22 | 2.44 | 0.825 | 0.646 | 0.989 |
| **7** | **1.69** | **2.08** | **0.933** | **0.742** | **0.992** |
| 9 | 1.33 | 2.08 | 0.891 | 0.748 | 0.991 |
| 12 | 0.74 | 2.52 | 0.931 | 0.797 | 0.988 |

Best model saved at epoch 7 (lowest validation loss: 2.077).

## Intended Use

### Primary Use Cases

- Detecting financial distress signals in household financial data
- Optimising timing and framing of coaching interventions
- Assessing savings goal achievement risk
- Identifying household financial tension between partners

### Users

- Envis platform automated coaching pipeline
- Financial wellbeing teams reviewing household risk indicators
- Product teams analysing intervention effectiveness

## Limitations

- **Not a clinical tool** — detects linguistic patterns, not psychological conditions
- **Not for crisis detection** — not validated for identifying self-harm or suicide risk
- **Not for credit decisions** — outputs must not be used for creditworthiness or lending
- **UK-focused** — trained primarily on UK financial patterns and terminology
- **Household-level** — designed for couples/families, not individual financial profiling
- **Urgency accuracy** — at 58.4%, the timing urgency classifier needs further refinement
- **Synthetic augmentation** — training data includes augmented samples to balance classes

## Ethical Considerations

- The model is designed to support empathetic financial coaching, not to judge or penalise
- Distress detection is used to trigger supportive interventions, not to restrict services
- Household tension signals are used to adapt communication tone, not to assess relationships
- All predictions should be reviewed in context; the model supplements human judgment
- Users experiencing mental health crises should be referred to professional resources

## How to Use

```python
import torch

# Load model
checkpoint = torch.load("best_model_v2.pt", map_location="cpu")
model.load_state_dict(checkpoint["model_state_dict"])
model.eval()

# Inference produces 5 coordinated outputs:
# - distress_risk: 5-class (none/low/moderate/high/severe)
# - timing: delay_hours + urgency (immediate/soon/can_wait)
# - framing: 5-class (supportive/direct/celebratory/gentle/urgent)
# - goal_risk: probability (0-1)
# - tension: probability (0-1)
```

## How It Connects to EnvisLM

The Insight Engine and EnvisLM work together in the Envis platform:

1. **Insight Engine** analyses transaction data and context → produces distress score, framing recommendation, tension signal
2. **EnvisLM** receives these signals as part of its system prompt → generates an empathetic coaching response tailored to the household's emotional and financial state

This two-model architecture separates analytical intelligence (Insight Engine) from conversational intelligence (EnvisLM), allowing each to be optimised independently.

## Project Timeline

| Date | Milestone |
|---|---|
| Jul 2025 | v1 model trained (binary distress, concatenation fusion) |
| Jul 2025 | 8,234 records manually labelled |
| Feb 2026 | v2 model trained (5-class distress, cross-attention, differential LR) |
| Feb 2026 | Distress F1 improved from 0.447 to 0.903 |

## Citation

```
@misc{envisinsight2026,
  title={Envis Insight Engine v2: Multi-Modal Financial Distress Detection},
  author={Shenbagaraja Venkataraman},
  year={2026},
  publisher={Envis Technologies},
  note={Multi-task transformer with FinBERT, trained on 8,234 labelled household financial records}
}
```

## About Envis Technologies

Envis Technologies is a UK-based fintech startup building an AI-powered household financial coaching platform for couples and families. The Insight Engine is the analytical core that understands household financial health, while EnvisLM is the conversational engine that delivers coaching.

---

*Two models, one mission: making money less stressful for families.*
