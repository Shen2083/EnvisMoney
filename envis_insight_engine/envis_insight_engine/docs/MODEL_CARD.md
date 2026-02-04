# Envis Insight Engine - Model Card

**Model Type:** Multi-modal transformer for household financial coaching  
**Language:** English  
**Licence:** Proprietary  
**Version:** 1.0.0  
**Last Updated:** July 2025  
**Run ID:** final_v2_2025_07_15

---

## Model Description

The Envis Insight Engine is a multi-task, multi-modal neural network designed for household-level financial coaching. It processes three input types (financial transactions, behavioural text, and household context) and produces coordinated predictions for intervention timing, framing, and risk assessment.

The system treats the household as the atomic unit of analysis rather than the individual, addressing a documented gap in personal finance technology where existing tools are architecturally designed for single users.

---

## Intended Use

### Primary Use Cases
- Detecting linguistic correlates of financial distress in household contexts
- Optimising timing and framing of financial coaching interventions
- Assessing goal achievement risk
- Identifying household financial tension signals

### Users
- Envis platform for automated coaching decisions
- Financial wellbeing teams reviewing household risk indicators
- Product teams analysing intervention effectiveness

---

## Out of Scope Uses

**The model should NOT be used for:**

- **Clinical assessment of psychological states** — The model detects linguistic patterns, not psychological conditions. It cannot diagnose depression, anxiety, or other mental health conditions.

- **Mental health crisis detection** — The model is not designed or validated for identifying individuals at risk of self-harm or suicide. Users experiencing crisis should be referred to appropriate professional resources.

- **Credit or lending decisions** — The model's outputs should not be used to determine creditworthiness or loan eligibility.

- **Individual profiling or targeting** — The model is designed for supportive household coaching, not for targeting individuals for marketing or other purposes.

---

## Architecture

| Component | Specification |
|-----------|---------------|
| Transaction Encoder | 4-layer Transformer, 8 heads, 256-dim |
| Text Encoder | FinBERT (ProsusAI) + 12 adapter layers |
| Household Encoder | 3-layer GAT, 64-dim, 4 heads |
| Fusion Layer | Bidirectional cross-attention, 512-dim |
| Total Parameters | 131,284,096 (~130M) |

---

## Training Data

**Dataset:** Envis Household Financial Behaviour Dataset v1.0

| Metric | Value |
|--------|-------|
| Total filtered records | 487,291 |
| Manually labelled records | 8,234 |
| Training set | 6,587 (80%) |
| Validation set | 823 (10%) |
| Test set | 824 (10%) |

**Sources:**
- HuggingFace financial transaction datasets (synthetic/anonymised)
- Reddit personal finance archives (r/UKPersonalFinance, r/personalfinance, r/FinancialPlanning, r/povertyfinance)
- Synthetic household structures based on ONS demographic statistics

**Labelling:**
- Primary labelling by founder with two contractor assistants
- 8-week labelling period
- 20% double-labelled for agreement measurement
- Inter-annotator agreement: Cohen's κ = 0.61–0.74

---

## Evaluation Results

### Test Set Performance (n=824)

| Task | Metric | Value | 95% CI |
|------|--------|-------|--------|
| Distress Risk | AUC-ROC | 0.824 | [0.798, 0.850] |
| Distress Risk | Precision | 0.78 | [0.74, 0.82] |
| Distress Risk | Recall | 0.75 | [0.71, 0.79] |
| Distress Risk | F1 | 0.76 | [0.73, 0.79] |
| Timing | MAE | 2.3 hrs | [2.0, 2.6] |
| Timing Urgency | Accuracy | 0.79 | [0.76, 0.82] |
| Framing | Accuracy | 0.71 | [0.68, 0.74] |
| Framing | Macro F1 | 0.68 | [0.64, 0.72] |
| Goal Risk | AUC-ROC | 0.79 | [0.76, 0.82] |
| Tension | AUC-ROC | 0.77 | [0.73, 0.81] |

### Confusion Matrix (Distress Risk at threshold 0.5)

|  | Predicted Low | Predicted High |
|--|---------------|----------------|
| **Actual Low** | 512 (TN) | 56 (FP) |
| **Actual High** | 64 (FN) | 192 (TP) |

False positive rate: 9.9%

### Calibration
Expected Calibration Error (ECE): 0.052

---

## Performance by Subgroup

| Household Type | N | Distress AUC | Framing Acc |
|----------------|---|--------------|-------------|
| Couples (no kids) | 312 | 0.841 | 0.73 |
| Couples (with kids) | 247 | 0.818 | 0.70 |
| Single parents | 89 | 0.789 | 0.68 |
| Multi-generational | 52 | 0.761 | 0.65 |
| Single person | 124 | 0.812 | 0.71 |

Performance is highest for couples without children (most represented in training data) and lowest for multi-generational households (least represented).

---

## Limitations

### Data Limitations
- Training data skews toward younger, higher-income, tech-savvy demographics
- Reddit users are not representative of the UK population
- Sample sizes for some household types (multi-generational, single parents) are limited
- Reddit data usage has legal uncertainty requiring resolution for production deployment

### Methodological Limitations
- Model detects linguistic patterns, not actual psychological states
- Inter-annotator agreement (κ = 0.68) indicates meaningful label noise
- Performance may be lower for underrepresented household types
- Not validated for non-English or non-UK contexts

### Known Error Patterns
**False Negatives:**
- Sarcasm/irony (25%): Sarcastic positive language masks distress signals
- Implicit indicators (35%): Indirect distress expression without explicit markers
- Ambiguous context (25%): Cases with reasonable annotator disagreement

**False Positives:**
- Regret without self-blame (30%): "I wish we'd started earlier" lacks self-blame component
- Strong negative language without distress (25%): External frustration misclassified
- Historical reference (25%): Discussing resolved past distress

---

## Ethical Considerations

### Appropriate Use
- Model outputs should inform **supportive** interventions, not punitive ones
- Human oversight should be maintained for significant decisions
- Users experiencing crisis should be referred to appropriate professional resources
- Model should not be used to manipulate or exploit users

### Privacy
- All training data has been stripped of usernames, user IDs, and direct links
- Distinctive posts might theoretically be traceable through search engines
- Future iterations should collect consented data through in-app mechanisms

### Bias Considerations
- Model performance may be lower for populations underrepresented in training data
- Cultural adaptation will be needed for international deployment
- The model should be monitored for disparate impact across demographic groups

---

## Technical Details

### Training Configuration
- Optimiser: AdamW with weight decay 0.01
- Learning rates: 2e-5 (FinBERT), 1e-4 (new components)
- Batch size: 32
- Early stopping: patience 3, triggered at epoch 14
- Best checkpoint: epoch 11
- Hardware: NVIDIA A100-SXM4-40GB, 64GB RAM
- Training time: ~6 hours

### Loss Function
Uncertainty-weighted multi-task loss (Kendall et al., 2018)

Final learned log-variance values:
- Distress: -0.38 (tightest)
- Timing: -0.12
- Framing: -0.27
- Goal-risk: -0.24
- Tension: -0.31

---

## Citation

If referencing this model, please cite:

```
Envis Insight Engine v1.0
Envis Technologies Ltd, 2025
Technical Documentation: Appendix S, Envis Business Plan
```

---

## Contact

For questions about this model, contact the Envis technical team.
