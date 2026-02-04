# Experiment Tracking Log

**Project:** Envis Insight Engine  
**Period:** June - July 2025

---

## Experiment Summary

| Run ID | Date | Description | Distress AUC | Notes |
|--------|------|-------------|--------------|-------|
| baseline_keyword_v1 | 2025-06-28 | Keyword baseline | 0.612 | Rule-based |
| baseline_finbert_v1 | 2025-06-28 | FinBERT sentiment | 0.658 | No fine-tuning |
| exp_text_only_v1 | 2025-07-01 | Text encoder only | 0.753 | Full fine-tune |
| exp_text_only_v2 | 2025-07-02 | Text with adapters | 0.789 | Much better |
| exp_full_v1 | 2025-07-05 | Full model, 6 layers | 0.798 | Slow training |
| exp_full_v2 | 2025-07-08 | Full model, 4 layers | 0.791 | Faster, similar |
| exp_full_v3 | 2025-07-10 | + LR schedule fix | 0.809 | Improved |
| exp_full_v4 | 2025-07-12 | + Gradient clipping | 0.818 | More stable |
| **final_v2** | **2025-07-15** | **Final config** | **0.824** | **Production** |

---

## Detailed Experiment Logs

### Baseline Experiments

#### baseline_keyword_v1
**Date:** 2025-06-28  
**Description:** Rule-based keyword matching for distress detection

```
Method: Count distress-related keywords (failed, terrible, ashamed, etc.)
        Normalise by text length
        Threshold at 0.5 for binary classification

Results:
  Distress AUC: 0.612
  Precision: 0.55
  Recall: 0.58
  F1: 0.55

Conclusion: Establishes lower bound. ML should beat this significantly.
```

---

#### baseline_finbert_v1
**Date:** 2025-06-28  
**Description:** FinBERT sentiment classification (no fine-tuning)

```
Method: Use pretrained ProsusAI/finbert
        Map negative sentiment to high distress
        
Results:
  Distress AUC: 0.658
  Precision: 0.59
  Recall: 0.61
  F1: 0.59

Conclusion: Better than keywords, but sentiment ≠ distress.
            Financial news sentiment doesn't transfer well.
```

---

### Text-Only Experiments

#### exp_text_only_v1
**Date:** 2025-07-01  
**Description:** Fine-tuned FinBERT, text only (no transactions/household)

```
Config:
  Base model: ProsusAI/finbert
  Fine-tuning: Full (all parameters)
  LR: 2e-5
  Epochs: 20

Results:
  Epoch 3: Val loss 0.523, Distress AUC 0.753
  Epoch 4: Val loss 0.548, Distress AUC 0.741 (overfitting!)
  Early stopped at epoch 6
  
  Final: Distress AUC 0.753

Problem: Severe overfitting with full fine-tuning on small dataset.
Action: Try adapter-based fine-tuning.
```

---

#### exp_text_only_v2
**Date:** 2025-07-02  
**Description:** FinBERT with adapter fine-tuning

```
Config:
  Base model: ProsusAI/finbert (frozen)
  Adapters: 12 layers, 64-dim bottleneck
  Trainable params: ~5.5M (5% of total)
  LR: 1e-4 (adapters only)
  Epochs: 20

Results:
  Epoch 11: Val loss 0.389, Distress AUC 0.789
  Epoch 14: Early stopped
  
  Final: Distress AUC 0.789

Conclusion: Adapters solve overfitting! +0.036 AUC improvement.
            This becomes our text encoder approach.
```

---

### Full Model Experiments

#### exp_full_v1
**Date:** 2025-07-05  
**Description:** Full multi-modal model with 6-layer transaction encoder

```
Config:
  Transaction encoder: 6 layers, 256-dim
  Text encoder: FinBERT + adapters
  Household encoder: 3-layer GAT
  Fusion: Cross-attention

Results:
  Training time: ~10 hours
  Epoch 9: Distress AUC 0.798
  Epoch 12: Signs of overfitting
  
  Final: Distress AUC 0.798

Observation: 6 layers slow, no benefit over expected 4-layer.
Action: Reduce to 4 layers.
```

---

#### exp_full_v2
**Date:** 2025-07-08  
**Description:** Full model with 4-layer transaction encoder

```
Config:
  Transaction encoder: 4 layers, 256-dim (reduced)
  Everything else same as exp_full_v1

Results:
  Training time: ~7 hours (30% faster)
  Epoch 10: Distress AUC 0.791
  
  Final: Distress AUC 0.791

Observation: Slightly lower but within noise. Faster is better.
             But noticed LR schedule issues.
Action: Fix learning rate schedule.
```

---

#### exp_full_v3
**Date:** 2025-07-10  
**Description:** Fixed learning rate schedule

```
Config:
  Same as exp_full_v2
  Fixed: Warmup steps 500 (was 100)
  Fixed: Cosine decay from correct max

Results:
  Epoch 11: Distress AUC 0.809
  
  Final: Distress AUC 0.809

Observation: +0.018 from LR fix alone!
             But training still shows some instability.
Action: Add gradient clipping.
```

---

#### exp_full_v4
**Date:** 2025-07-12  
**Description:** Added gradient clipping

```
Config:
  Same as exp_full_v3
  Added: Gradient clip norm 1.0

Results:
  Training much more stable
  Epoch 11: Distress AUC 0.818
  
  Final: Distress AUC 0.818

Observation: Training curves much smoother.
             Ready for final run with clean setup.
```

---

#### final_v2_2025_07_15 (PRODUCTION)
**Date:** 2025-07-15  
**Description:** Final production model

```
Config:
  Transaction encoder: 4 layers, 8 heads, 256-dim
  Text encoder: FinBERT + 12 adapters (64-dim)
  Household encoder: 3-layer GAT, 64-dim
  Fusion: Bidirectional cross-attention, 512-dim
  
  Optimiser: AdamW, weight_decay=0.01
  LR: 2e-5 (FinBERT), 1e-4 (new)
  Warmup: 500 steps
  Gradient clip: 1.0
  Early stopping: patience 3

Results:
  Start: 2025-07-15 14:23:41 UTC
  End: 2025-07-15 21:32:24 UTC
  Duration: ~7 hours
  
  Best epoch: 11
  Early stopped: epoch 14
  
  Test set results:
    Distress AUC: 0.824
    Timing MAE: 2.3 hrs
    Framing Acc: 71%
    
Status: PRODUCTION MODEL
```

---

## Ablation Studies

Conducted on final model to validate each component's contribution.

| Configuration | Distress AUC | Δ vs Full |
|---------------|--------------|-----------|
| Full model | 0.824 | — |
| - transaction encoder | 0.801 | -0.023 |
| - household encoder | 0.812 | -0.012 |
| - cross-modal fusion | 0.795 | -0.029 |
| Text encoder only | 0.789 | -0.035 |

**Conclusion:** All components contribute positively. Cross-modal fusion provides largest individual contribution.

---

## Failed Approaches

### Approach 1: LSTM Transaction Encoder
**Date:** 2025-07-03  
**Result:** 0.763 AUC (-0.061 vs transformer)  
**Conclusion:** Transformer significantly better for sequence modelling

### Approach 2: Simple Concatenation Fusion
**Date:** 2025-07-04  
**Result:** 0.785 AUC (-0.039 vs cross-attention)  
**Conclusion:** Cross-attention captures interaction effects

### Approach 3: Separate Models Per Task
**Date:** 2025-07-06  
**Result:** 4/5 tasks worse than multi-task  
**Conclusion:** Multi-task learning helps through shared representations

### Approach 4: Deeper Transaction Encoder (8 layers)
**Date:** 2025-07-05  
**Result:** 0.796 AUC, 12hr training  
**Conclusion:** Diminishing returns, slower training

---

## Hardware Log

All experiments run on:
- **GPU:** NVIDIA A100-SXM4-40GB
- **RAM:** 64GB
- **Framework:** PyTorch 2.1.0, Transformers 4.30.0

| Experiment | GPU Memory | Training Time |
|------------|------------|---------------|
| Text-only | ~12GB | ~3 hours |
| Full (6-layer) | ~28GB | ~10 hours |
| Full (4-layer) | ~24GB | ~7 hours |
