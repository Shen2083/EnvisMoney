# Inter-Annotator Agreement Analysis

**Document Reference:** Appendix S, Part 2.2  
**Analysis Date:** July 2025

---

## Overview

This document details the inter-annotator agreement analysis for the Envis Household Financial Behaviour Dataset. Agreement was measured on 1,647 double-labelled records (20% of total labelled dataset).

---

## Labelling Team

| Role | ID | Experience | Records Labelled |
|------|-----|------------|------------------|
| Lead Annotator | A1 (Founder) | Domain expert, designed taxonomy | ~3,500 |
| Annotator 2 | A2 | Contractor, psychology background | ~2,400 |
| Annotator 3 | A3 | Contractor, finance background | ~2,300 |

---

## Agreement Metrics

### Overall Results

| Category | Cohen's κ | % Agreement | Interpretation |
|----------|-----------|-------------|----------------|
| Distress (overall) | 0.68 | 81% | Substantial |
| Self-blame | 0.71 | 84% | Substantial |
| Avoidance | 0.65 | 79% | Substantial |
| Secrecy | 0.73 | 86% | Substantial |
| Framing selection | 0.64 | 74% | Substantial |
| Tension indicators | 0.71 | 83% | Substantial |

All κ values fall in the "substantial agreement" range (0.61-0.80) according to Landis & Koch (1977).

---

## Pairwise Agreement

### Distress (Overall)

| Pair | κ | % Agreement |
|------|---|-------------|
| A1-A2 | 0.71 | 83% |
| A1-A3 | 0.69 | 82% |
| A2-A3 | 0.64 | 78% |

### Framing Selection

| Pair | κ | % Agreement |
|------|---|-------------|
| A1-A2 | 0.67 | 76% |
| A1-A3 | 0.65 | 75% |
| A2-A3 | 0.59 | 71% |

---

## Confusion Analysis

### Framing Selection Confusion Matrix (Aggregated)

|  | Supportive | Direct | Celebratory | Gentle | Urgent |
|--|------------|--------|-------------|--------|--------|
| **Supportive** | 412 | 23 | 5 | 67 | 8 |
| **Direct** | 18 | 387 | 12 | 15 | 31 |
| **Celebratory** | 3 | 8 | 198 | 2 | 1 |
| **Gentle** | 54 | 11 | 4 | 329 | 6 |
| **Urgent** | 5 | 28 | 2 | 4 | 178 |

**Key Confusions:**
1. Supportive ↔ Gentle (28% of framing errors)
2. Direct ↔ Urgent (15% of framing errors)

These confusions are expected as these pairs represent adjacent styles on the distress-awareness spectrum.

---

## Disagreement Categories

Analysis of 314 disagreement cases revealed the following patterns:

### By Category

| Disagreement Type | Count | % | Resolution |
|-------------------|-------|---|------------|
| Borderline intensity | 89 | 28% | Threshold refinement |
| Ambiguous language | 76 | 24% | Additional examples added |
| Context interpretation | 62 | 20% | Guidelines clarified |
| Subjective framing choice | 54 | 17% | Accepted as noise |
| Labelling error | 33 | 11% | Corrected |

### Example Disagreements

#### Case 1: Borderline Intensity
**Text:** "I wish we'd been more careful with our spending last year."

| Annotator | Self-blame | Rationale |
|-----------|------------|-----------|
| A1 | 0 | Regret without negative self-evaluation |
| A2 | 1 | "Wish" + "more careful" implies self-criticism |

**Resolution:** Label 0. Guideline clarified: regret alone is not self-blame; requires explicit negative self-evaluation.

---

#### Case 2: Ambiguous Language
**Text:** "I haven't really been keeping track of our spending lately."

| Annotator | Avoidance | Rationale |
|-----------|-----------|-----------|
| A1 | 0 | Could be busy, not necessarily avoidance |
| A3 | 1 | "Haven't been keeping track" suggests avoidance |

**Resolution:** Label 0. Guideline clarified: avoidance requires emotional motivation (fear, anxiety) not just disengagement.

---

#### Case 3: Framing Choice
**Text:** "We're making progress but still have a long way to go on our savings goal."

| Annotator | Framing | Rationale |
|-----------|---------|-----------|
| A1 | Supportive | Acknowledges progress, encouragement appropriate |
| A2 | Direct | Factual statement, no distress indicators |

**Resolution:** Both acceptable. Noted as acceptable variation in guidelines.

---

## Calibration Process

### Weekly Calibration Meetings

| Meeting | Date | Cases Reviewed | Guideline Updates |
|---------|------|----------------|-------------------|
| 1 | 2025-06-05 | 25 | Added self-blame borderline guidance |
| 2 | 2025-06-12 | 30 | Clarified avoidance vs. disengagement |
| 3 | 2025-06-19 | 28 | Added secrecy vs. privacy distinction |
| 4 | 2025-06-26 | 22 | Refined framing decision tree |
| 5 | 2025-07-03 | 18 | Addressed tension vs. frustration |
| 6 | 2025-07-10 | 19 | Final calibration check |

### Agreement Improvement Over Time

| Period | Distress κ | Framing κ |
|--------|------------|-----------|
| Week 1-2 (pilot) | 0.58 | 0.51 |
| Week 3-4 | 0.64 | 0.59 |
| Week 5-6 | 0.68 | 0.63 |
| Week 7-8 (final) | 0.71 | 0.67 |

---

## Edge Cases Documented

142 edge cases were formally documented during labelling. Examples:

### Edge Case #23: Sarcasm
**Text:** "Great, another month of being terrible with money. Really outdoing myself here."

**Issue:** Sarcastic language masks actual distress.

**Guideline Added:** Sarcasm with self-deprecating content should be labelled as self-blame (1) if the underlying meaning is self-critical.

---

### Edge Case #47: Historical Reference
**Text:** "We used to fight about money all the time, but we've worked through it. Those were dark days."

**Issue:** Past tension, now resolved.

**Guideline Added:** Label based on current state. Historical references to resolved issues = tension 0.

---

### Edge Case #89: Cultural Expression
**Text:** "Money problems are just part of life, innit? You deal with it and move on."

**Issue:** Stoic cultural framing may mask distress.

**Guideline Added:** Label observable indicators only. Cultural minimisation without explicit distress markers = distress 0.

---

## Limitations

1. **Small labelling team** — Only 3 annotators limits diversity of perspectives

2. **Lead annotator bias** — Founder as lead may have influenced other annotators

3. **Cultural homogeneity** — All annotators UK-based, may miss cultural variations

4. **Retrospective disagreement analysis** — Some early disagreements not fully documented

---

## Recommendations for Future Iterations

1. **Expand labelling team** to 5-7 annotators with diverse backgrounds

2. **Blind calibration** — Include blind test cases to detect lead annotator influence

3. **Cultural consultation** — Review guidelines with advisors from different cultural backgrounds

4. **Continuous monitoring** — Track agreement metrics throughout labelling, not just at checkpoints

---

## References

Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159-174.
