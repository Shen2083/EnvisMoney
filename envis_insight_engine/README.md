# Envis Insight Engine

**Multi-modal neural network for household financial coaching**

Technical implementation for the Envis Insight Engine as documented in Appendix S of the Envis Business Plan.

---

## Overview

The Envis Insight Engine is a machine learning system designed for household-level financial coaching. Unlike traditional personal finance tools that treat users as isolated individuals, this system treats the household as the atomic unit of analysis.

### Key Innovations

1. **Household-Level Financial Modelling**: Graph Attention Network architecture encoding household structure, member roles, and relational dynamics

2. **Financial Distress Detection**: Methodology for detecting linguistic and behavioural correlates of financial distress in text and transaction patterns

3. **Cross-Modal Behaviour Analysis**: Attention mechanisms comparing stated intentions (text) with actual behaviour (transactions) — the "say vs do" analysis

4. **Intervention Optimisation**: Multi-task learning framework jointly predicting timing, framing, and delivery parameters

---

## Architecture

```
INPUT LAYER              ENCODER LAYER                 FUSION LAYER         OUTPUT LAYER
┌─────────────────┐     ┌─────────────────────┐       ┌──────────────┐     ┌──────────────────┐
│ Transaction Data│────▶│ Transaction Encoder │       │              │     │ • Distress Risk  │
│ Amount, Category│     │ 4-layer Transformer │──────▶│              │     │ • Nudge Timing   │
│ Merchant, Time  │     │ 256-dim embeddings  │       │  Cross-Modal │────▶│ • Framing Select │
├─────────────────┤     ├─────────────────────┤       │  Attention   │     │ • Goal Risk      │
│ Behavioural Text│────▶│ Text Encoder        │──────▶│  Gated Fusion│     │ • Tension        │
│ Goals, Discuss  │     │ FinBERT + Adapters  │       │  512-dim     │     └──────────────────┘
├─────────────────┤     ├─────────────────────┤       │              │
│ Household       │────▶│ Household Encoder   │──────▶│              │
│ Members, Roles  │     │ 3-layer GAT         │       └──────────────┘
└─────────────────┘     └─────────────────────┘
```

### Model Specifications

| Component | Specification |
|-----------|---------------|
| Transaction Encoder | 4-layer Transformer, 8 heads, 256-dim |
| Text Encoder | FinBERT (ProsusAI) + 12 adapter layers (64-dim bottleneck) |
| Household Encoder | 3-layer GAT, 64-dim, 4 heads |
| Fusion Layer | Bidirectional cross-attention, 512-dim output |
| **Total Parameters** | **~131 million** |

---

## Project Structure

```
envis_insight_engine/
├── config/
│   └── model_config.yaml       # Model hyperparameters and architecture config
├── data/
│   └── samples/
│       └── labelled_samples.json   # Example labelled records
├── docs/
│   ├── MODEL_CARD.md           # Model documentation
│   └── LABELLING_GUIDELINES.md # Labelling taxonomy
├── logs/
│   └── training_log.csv        # Epoch-by-epoch training metrics
├── scripts/
│   ├── train.py                # Training script
│   └── evaluate.py             # Evaluation and benchmarking
├── src/
│   ├── model.py                # Model architecture
│   └── household_filter.py     # Household relevance filtering
└── requirements.txt            # Python dependencies
```

---

## Performance

### Test Set Results (n=824)

| Task | Metric | Value | 95% CI |
|------|--------|-------|--------|
| Distress Risk | AUC-ROC | 0.824 | [0.798, 0.850] |
| Distress Risk | F1 | 0.76 | [0.73, 0.79] |
| Timing | MAE | 2.3 hrs | [2.0, 2.6] |
| Timing Urgency | Accuracy | 79% | [76%, 82%] |
| Framing | Accuracy | 71% | [68%, 74%] |
| Goal Risk | AUC-ROC | 0.79 | [0.76, 0.82] |
| Tension | AUC-ROC | 0.77 | [0.73, 0.81] |

### Baseline Comparison (Distress AUC)

| Model | AUC | Δ vs Ours |
|-------|-----|-----------|
| Random | 0.500 | -0.324 |
| Keyword-based | 0.612 | -0.212 |
| FinBERT sentiment | 0.658 | -0.166 |
| Text-only transformer | 0.789 | -0.035 |
| **Ours (full model)** | **0.824** | — |

### Ablation Study

| Configuration | Distress AUC | Δ |
|---------------|--------------|---|
| Full model | 0.824 | — |
| Without transaction encoder | 0.801 | -0.023 |
| Without household encoder | 0.812 | -0.012 |
| Without cross-modal fusion | 0.795 | -0.029 |
| Text encoder only | 0.789 | -0.035 |

---

## Training

### Configuration

- **Optimiser**: AdamW with weight decay 0.01
- **Learning Rates**: 2e-5 (FinBERT), 1e-4 (new components)
- **Batch Size**: 32
- **Early Stopping**: Patience 3 epochs
- **Hardware**: NVIDIA A100-SXM4-40GB, 64GB RAM
- **Training Time**: ~6 hours

### Dataset

| Split | Records |
|-------|---------|
| Training | 6,587 (80%) |
| Validation | 823 (10%) |
| Test | 824 (10%) |

Total labelled: 8,234 records  
Total filtered (unlabelled): 487,291 records

### Run Training

```bash
python scripts/train.py \
    --config config/model_config.yaml \
    --data data/train.json \
    --checkpoint-dir checkpoints \
    --log-dir logs
```

### Run Evaluation

```bash
python scripts/evaluate.py \
    --checkpoint checkpoints/epoch_11.pt \
    --test-data data/test.json \
    --output results/
```

---

## Data

### Sources

1. **Transactions**: HuggingFace financial datasets (synthetic/anonymised)
2. **Text**: Reddit personal finance archives (r/UKPersonalFinance, etc.)
3. **Household Structure**: Synthetic generation based on ONS demographics

### Household Filtering

Records are filtered for household relevance using a weighted scoring algorithm:

| Signal | Weight |
|--------|--------|
| Explicit keywords | 0.40 |
| Plural pronoun ratio | 0.20 |
| Shared goal patterns | 0.25 |
| Multiple person references | 0.15 |

Threshold: 0.4 (Precision: 83%, Recall: 81%)

### Labelling

- **Distress Indicators**: Self-blame, avoidance, secrecy
- **Framing Labels**: Supportive, direct, celebratory, gentle, urgent
- **Tension Indicators**: Blame language, conflict signals

Inter-annotator agreement: Cohen's κ = 0.64–0.73

---

## References

### Machine Learning
- Vaswani et al. (2017) - Attention Is All You Need
- Araci (2019) - FinBERT
- Veličković et al. (2018) - Graph Attention Networks
- Houlsby et al. (2019) - Parameter-Efficient Transfer Learning
- Kendall et al. (2018) - Multi-Task Learning Using Uncertainty

### Psychology
- Shapiro & Burchell (2012) - Financial Anxiety Scale
- Netemeyer et al. (2018) - Perceived Financial Well-Being
- Tangney et al. (2007) - Moral Emotions and Behaviour

---

## Documentation Reference

This implementation corresponds to:

**Appendix S: ENVIS INSIGHT ENGINE**  
Envis Business Plan (Pages 102-126)

- Part 1: Technical Documentation
- Part 2: Data Evidence
- Part 3: Implementation Evidence
- Part 4: Evaluation Evidence

---

## Licence

Proprietary - Envis Technologies Ltd

---

## Contact

For technical questions, contact the Envis engineering team.
