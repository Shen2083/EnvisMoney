# Envis Insight Engine - Development Timeline

**Document Reference:** Appendix S, Part 5.1  
**Project Duration:** November 2024 – July 2025 (~9 months)

---

## Overview

Development occurred over approximately 9 months from initial research through final documentation. This timeline is longer than initially estimated in preliminary planning, reflecting the iterative nature of research and several pivots based on experimental results.

---

## Phase 1: Research & Problem Definition
**November 2024 – January 2025 (3 months)**

### November 2024
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1-2 | Literature review: PFM tools, behavioural finance | Annotated bibliography (47 papers) |
| 3-4 | Competitive analysis of existing tools | Feature comparison matrix |

### December 2024
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1-2 | Literature review: financial psychology, nudging | Extended bibliography |
| 3-4 | Initial problem formulation | Problem statement draft v1 |

### January 2025
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1-2 | Survey design and piloting | Survey instrument v1 |
| 3-4 | Architecture research: multi-modal ML, GNNs | Technical feasibility assessment |

**Key Decisions:**
- Decided to treat household as atomic unit (not individual)
- Identified Graph Attention Networks as appropriate for household structure
- Selected FinBERT as base text encoder

---

## Phase 2: Primary Research
**February 2025 – March 2025 (2 months)**

### February 2025
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1-2 | Survey refinement and ethics review | Final survey instrument |
| 3-4 | Survey distribution (social media, community partnerships) | Initial responses (n=43) |

### March 2025
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1-2 | Continued survey collection | Responses reach n=87 |
| 3-4 | Survey closure, initial analysis | Final sample n=100, preliminary findings |

**Survey Results Summary:**
- 75% manage 6-15 accounts across household
- 65% rate financial overview difficulty as high (4-5)
- 72% have experienced shame/guilt discussing finances
- Target segment validated: "Ambitious Planners" (28-45, £50k-£150k)

---

## Phase 3: Data Collection & Preparation
**April 2025 – May 2025 (2 months)**

### April 2025
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1 | Data source identification | Source inventory document |
| 2 | HuggingFace dataset download and cleaning | 450k transaction records |
| 3 | Reddit archive acquisition and processing | 1.8M posts/comments (raw) |
| 4 | Initial data cleaning pipeline | Cleaned dataset v1 |

### May 2025
| Week | Activity | Deliverables |
|------|----------|--------------|
| 1 | Household filtering algorithm development | household_filter.py v1 |
| 2 | Filter threshold optimization | Threshold selected: 0.4 |
| 3 | Apply filtering, generate synthetic households | 487,291 filtered records |
| 4 | Labelling taxonomy development (pilot 1) | Taxonomy v0.1 |

**Filtering Results:**
- Raw records: 2,147,832
- After cleaning: 1,923,456
- After household filtering: 487,291 (25.3% retention)

---

## Phase 4: Labelling
**May 2025 – July 2025 (8 weeks)**

### Labelling Team
| Role | Person | Records Labelled | Period |
|------|--------|------------------|--------|
| Lead Annotator | Founder | ~3,500 | May-July |
| Annotator 2 | Contractor A | ~2,400 | May-July |
| Annotator 3 | Contractor B | ~2,300 | June-July |

### May 2025 (Labelling)
| Week | Activity | Records | Cumulative |
|------|----------|---------|------------|
| 4 | Pilot labelling round 1 | 200 | 200 |

### June 2025 (Labelling)
| Week | Activity | Records | Cumulative |
|------|----------|---------|------------|
| 1 | Taxonomy refinement, pilot 2 | 300 | 500 |
| 2 | Pilot 3, finalize guidelines | 250 | 750 |
| 3 | Production labelling begins | 1,200 | 1,950 |
| 4 | Production labelling | 1,500 | 3,450 |

### July 2025 (Labelling)
| Week | Activity | Records | Cumulative |
|------|----------|---------|------------|
| 1 | Production labelling | 1,800 | 5,250 |
| 2 | Production labelling + QC review | 1,600 | 6,850 |
| 3 | Final labelling + agreement calculation | 1,384 | 8,234 |

**Quality Metrics:**
- Double-labelled records: 1,647 (20%)
- Inter-annotator agreement: κ = 0.64-0.73
- Disagreement resolution meetings: 6

---

## Phase 5: Model Development
**June 2025 – July 2025 (6 weeks)**

### June 2025 (Development)
| Week | Activity | Outcome |
|------|----------|---------|
| 2 | Architecture implementation: encoders | Transaction, Text, Household encoders |
| 3 | Fusion layer implementation | Cross-modal attention + gating |
| 4 | Prediction heads + loss function | Multi-task heads, uncertainty weighting |

### July 2025 (Development)
| Week | Activity | Outcome |
|------|----------|---------|
| 1 | Training pipeline, data loaders | train.py v1 |
| 2 | Baseline experiments | 4 baselines implemented |

**Experiments That Did Not Work:**
| Experiment | Issue | Resolution |
|------------|-------|------------|
| Full FinBERT fine-tuning | Overfitting after epoch 3 | Switched to adapters |
| 6-layer transaction encoder | No improvement, slower | Kept 4 layers |
| LSTM baseline | -0.05 AUC vs transformer | Confirmed transformer choice |
| Simple concatenation fusion | -0.04 AUC vs attention | Confirmed cross-attention |

---

## Phase 6: Training & Evaluation
**July 2025 (2 weeks)**

### Training Runs

| Run ID | Date | Epochs | Best Val Loss | Distress AUC | Notes |
|--------|------|--------|---------------|--------------|-------|
| exp_v1_2025_07_08 | Jul 8 | 12 | 0.412 | 0.791 | Initial full run |
| exp_v2_2025_07_10 | Jul 10 | 15 | 0.378 | 0.809 | Adjusted LR schedule |
| exp_v3_2025_07_12 | Jul 12 | 11 | 0.361 | 0.818 | Added gradient clipping |
| **final_v2_2025_07_15** | **Jul 15** | **14** | **0.352** | **0.824** | **Final model** |

### Final Training Run Details
- **Start:** 2025-07-15 14:23:41 UTC
- **End:** 2025-07-15 21:32:24 UTC
- **Duration:** ~7 hours
- **Best Checkpoint:** Epoch 11
- **Early Stopping:** Triggered at epoch 14 (patience 3)

### Evaluation Timeline
| Date | Activity | Deliverable |
|------|----------|-------------|
| Jul 15 (PM) | Test set evaluation | evaluation_results.json |
| Jul 16 | Ablation studies | Ablation comparison table |
| Jul 17 | Baseline comparisons | Baseline results |
| Jul 18 | Subgroup analysis | Performance by household type |
| Jul 19-20 | Error analysis | False positive/negative review |

---

## Phase 7: Documentation
**July 2025 (1 week)**

| Date | Activity | Deliverable |
|------|----------|-------------|
| Jul 21 | Model card drafting | MODEL_CARD.md v1 |
| Jul 22 | Technical documentation | Architecture section |
| Jul 23 | Data documentation | Data provenance, labelling sections |
| Jul 24 | Evaluation documentation | Results, baselines, ablations |
| Jul 25 | Review and refinement | Final Appendix S draft |
| Jul 26-27 | Integration with business plan | Complete document |

---

## Resource Summary

### Time Investment
| Phase | Duration | Founder Hours | Contractor Hours |
|-------|----------|---------------|------------------|
| Research | 3 months | ~200 | 0 |
| Primary Research | 2 months | ~80 | 0 |
| Data Preparation | 2 months | ~160 | 0 |
| Labelling | 8 weeks | ~120 | ~320 |
| Development | 6 weeks | ~240 | 0 |
| Training/Eval | 2 weeks | ~80 | 0 |
| Documentation | 1 week | ~40 | 0 |
| **Total** | **~9 months** | **~920** | **~320** |

### Compute Resources
| Resource | Usage | Cost (Est.) |
|----------|-------|-------------|
| A100 GPU (training) | ~50 hours | ~£150 |
| CPU instances (data processing) | ~200 hours | ~£50 |
| Storage | 500GB | ~£20 |
| **Total Compute** | | **~£220** |

### External Costs
| Item | Cost |
|------|------|
| Contractor labelling (2 × 8 weeks) | ~£4,800 |
| Survey incentives | ~£200 |
| Software/tools | ~£100 |
| **Total External** | **~£5,100** |

---

## Key Milestones

| Date | Milestone |
|------|-----------|
| Jan 2025 | Problem formulation complete |
| Mar 2025 | Survey research complete (n=100) |
| May 2025 | Dataset filtered (487k records) |
| Jun 2025 | Labelling taxonomy finalized |
| Jul 15, 2025 | Final model trained |
| Jul 20, 2025 | Evaluation complete |
| Jul 27, 2025 | Documentation complete |

---

## Lessons Learned

1. **Labelling takes longer than expected** — Initial estimate was 4 weeks; actual was 8 weeks due to taxonomy refinement and quality control needs

2. **Adapter fine-tuning crucial for small datasets** — Full fine-tuning caused severe overfitting; adapters resolved this

3. **Multi-task learning improves most tasks** — 4 of 5 tasks improved vs. separate models

4. **Household filtering essential** — Without filtering, model learned individual patterns that didn't transfer to household context

5. **Cross-modal attention adds meaningful value** — +0.029 AUC from fusion layer alone justifies architectural complexity
