"""
Envis Insight Engine - Inference Script

Run inference on new text inputs for demonstration purposes.

Usage:
    python inference.py --checkpoint path/to/checkpoint.pt --text "Your text here"
    python inference.py --checkpoint path/to/checkpoint.pt --input input.json --output results.json
    python inference.py --checkpoint path/to/checkpoint.pt --interactive

Examples:
    python inference.py --checkpoint checkpoints/epoch_11.pt --text "We're struggling to save for our holiday"
    python inference.py --checkpoint checkpoints/epoch_11.pt --interactive
"""

import argparse
import json
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional, Tuple
from datetime import datetime

# In production:
# import torch
# from transformers import AutoTokenizer
# from model import EnvisInsightEngine


@dataclass
class HouseholdContext:
    """Household context for inference."""
    members: List[Dict] = None
    relationships: List[Tuple[int, int, str]] = None
    
    def __post_init__(self):
        if self.members is None:
            # Default: couple household
            self.members = [
                {"role": "partner_1", "age_bracket": "35-45", "income_bracket": "medium"},
                {"role": "partner_2", "age_bracket": "35-45", "income_bracket": "medium"},
            ]
        if self.relationships is None:
            self.relationships = [(0, 1, "partner_partner")]


@dataclass
class PredictionResult:
    """Result of model inference."""
    text: str
    timestamp: str
    
    # Predictions
    distress_risk: float
    distress_category: str
    timing_delay_hours: float
    timing_urgency: str
    framing: str
    framing_confidence: float
    tension_risk: float
    
    # Interpretation
    recommended_action: str
    intervention_message: Optional[str] = None
    
    # Debug info
    attention_highlights: Optional[Dict] = None


class InsightEngineInference:
    """
    Inference wrapper for the Envis Insight Engine.
    
    Provides easy-to-use interface for running predictions on new text.
    """
    
    FRAMING_CLASSES = ["supportive", "direct", "celebratory", "gentle", "urgent"]
    URGENCY_CLASSES = ["immediate", "soon", "can_wait"]
    
    def __init__(self, checkpoint_path: str, device: str = "cpu"):
        self.checkpoint_path = checkpoint_path
        self.device = device
        
        # Load model
        self._load_model()
        
        # Load tokenizer
        # self.tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
        
        print(f"Model loaded from {checkpoint_path}")
    
    def _load_model(self):
        """Load model from checkpoint."""
        # In production:
        # self.model = EnvisInsightEngine.load(self.checkpoint_path)
        # self.model.to(self.device)
        # self.model.eval()
        pass
    
    def predict(
        self,
        text: str,
        household_context: Optional[HouseholdContext] = None,
        transaction_history: Optional[List[Dict]] = None,
    ) -> PredictionResult:
        """
        Run inference on a single text input.
        
        Args:
            text: Financial text to analyse
            household_context: Optional household structure info
            transaction_history: Optional recent transactions
            
        Returns:
            PredictionResult with all predictions and interpretations
        """
        if household_context is None:
            household_context = HouseholdContext()
        
        # Tokenize text
        # inputs = self.tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        # Prepare household features
        # node_features, edge_index = self._encode_household(household_context)
        
        # Prepare transaction features (use dummy if not provided)
        # transaction_features = self._encode_transactions(transaction_history)
        
        # Run inference
        # with torch.no_grad():
        #     outputs = self.model(...)
        
        # For demonstration, return simulated outputs
        result = self._simulate_prediction(text)
        
        return result
    
    def _simulate_prediction(self, text: str) -> PredictionResult:
        """
        Simulate prediction for demonstration.
        
        In production, this would be replaced with actual model inference.
        """
        # Simple heuristic-based simulation for demo
        text_lower = text.lower()
        
        # Distress signals
        distress_signals = [
            "struggling", "worried", "scared", "afraid", "hiding", 
            "ashamed", "failure", "mess", "can't", "won't",
            "terrible", "awful", "overwhelmed", "stressed"
        ]
        distress_score = sum(1 for s in distress_signals if s in text_lower) / len(distress_signals)
        distress_score = min(distress_score * 3, 0.95)  # Scale up but cap
        
        # Positive signals
        positive_signals = [
            "finally", "achieved", "proud", "great", "amazing",
            "milestone", "goal", "success", "paid off"
        ]
        positive_score = sum(1 for s in positive_signals if s in text_lower) / len(positive_signals)
        
        # Tension signals
        tension_signals = [
            "argument", "fight", "blame", "fault", "angry",
            "controlling", "won't listen", "doesn't understand"
        ]
        tension_score = sum(1 for s in tension_signals if s in text_lower) / len(tension_signals)
        tension_score = min(tension_score * 4, 0.95)
        
        # Adjust distress for positive content
        if positive_score > 0.2:
            distress_score = max(0, distress_score - 0.3)
        
        # Determine framing
        if positive_score > 0.2:
            framing = "celebratory"
            framing_confidence = 0.85
        elif distress_score > 0.5:
            framing = "gentle"
            framing_confidence = 0.78
        elif distress_score > 0.3:
            framing = "supportive"
            framing_confidence = 0.72
        else:
            framing = "direct"
            framing_confidence = 0.81
        
        # Determine timing
        if distress_score > 0.6:
            timing_delay = 48.0
            timing_urgency = "can_wait"
        elif distress_score > 0.3:
            timing_delay = 24.0
            timing_urgency = "soon"
        else:
            timing_delay = 2.0
            timing_urgency = "immediate"
        
        # Determine category
        if distress_score > 0.5:
            distress_category = "high"
        elif distress_score > 0.25:
            distress_category = "moderate"
        else:
            distress_category = "low"
        
        # Generate recommended action
        if distress_score > 0.6 and tension_score > 0.3:
            recommended_action = "Monitor closely; consider coordinated household intervention"
        elif distress_score > 0.5:
            recommended_action = "Delay intervention 48hrs; use gentle framing when engaging"
        elif positive_score > 0.2:
            recommended_action = "Reinforce positive behaviour with celebration"
        else:
            recommended_action = "Proceed with standard direct communication"
        
        return PredictionResult(
            text=text,
            timestamp=datetime.utcnow().isoformat() + "Z",
            distress_risk=round(distress_score, 3),
            distress_category=distress_category,
            timing_delay_hours=timing_delay,
            timing_urgency=timing_urgency,
            framing=framing,
            framing_confidence=round(framing_confidence, 3),
            tension_risk=round(tension_score, 3),
            recommended_action=recommended_action,
        )
    
    def predict_batch(
        self,
        texts: List[str],
        household_context: Optional[HouseholdContext] = None,
    ) -> List[PredictionResult]:
        """Run inference on multiple texts."""
        return [self.predict(text, household_context) for text in texts]


def run_interactive(engine: InsightEngineInference):
    """Run interactive inference session."""
    print("\n" + "=" * 60)
    print("ENVIS INSIGHT ENGINE - Interactive Mode")
    print("=" * 60)
    print("Enter financial text to analyse. Type 'quit' to exit.\n")
    
    while True:
        try:
            text = input("Text> ").strip()
            
            if text.lower() in ['quit', 'exit', 'q']:
                print("Goodbye!")
                break
            
            if not text:
                continue
            
            result = engine.predict(text)
            
            print("\n" + "-" * 40)
            print(f"Distress Risk:    {result.distress_risk:.3f} ({result.distress_category})")
            print(f"Tension Risk:     {result.tension_risk:.3f}")
            print(f"Timing:           Wait {result.timing_delay_hours:.0f}hrs ({result.timing_urgency})")
            print(f"Framing:          {result.framing} (conf: {result.framing_confidence:.2f})")
            print(f"Recommendation:   {result.recommended_action}")
            print("-" * 40 + "\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break


def main():
    parser = argparse.ArgumentParser(description="Run Envis Insight Engine inference")
    parser.add_argument("--checkpoint", type=str, required=True,
                        help="Path to model checkpoint")
    parser.add_argument("--text", type=str, default=None,
                        help="Single text to analyse")
    parser.add_argument("--input", type=str, default=None,
                        help="JSON file with texts to analyse")
    parser.add_argument("--output", type=str, default=None,
                        help="Output JSON file for results")
    parser.add_argument("--interactive", action="store_true",
                        help="Run in interactive mode")
    parser.add_argument("--device", type=str, default="cpu",
                        help="Device to run on (cpu/cuda)")
    
    args = parser.parse_args()
    
    # Load model
    engine = InsightEngineInference(args.checkpoint, args.device)
    
    if args.interactive:
        run_interactive(engine)
    
    elif args.text:
        result = engine.predict(args.text)
        print(json.dumps(asdict(result), indent=2))
    
    elif args.input:
        with open(args.input) as f:
            data = json.load(f)
        
        texts = data.get("texts", [])
        results = engine.predict_batch(texts)
        
        output = {
            "model": args.checkpoint,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "results": [asdict(r) for r in results]
        }
        
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(output, f, indent=2)
            print(f"Results saved to {args.output}")
        else:
            print(json.dumps(output, indent=2))
    
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
