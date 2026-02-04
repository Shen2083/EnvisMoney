# Error Analysis Report

**Document Reference:** Appendix S, Part 4.1  
**Analysis Date:** July 2025  
**Test Set Size:** 824 records

---

## Overview

This document presents a detailed analysis of model errors on the held-out test set. We reviewed 40 false negatives and 40 false positives for the distress-risk prediction task to identify systematic patterns and inform future improvements.

---

## Summary Statistics

### Distress-Risk Confusion Matrix (threshold = 0.5)

|  | Predicted Low | Predicted High |
|--|---------------|----------------|
| **Actual Low** | 512 (TN) | 56 (FP) |
| **Actual High** | 64 (FN) | 192 (TP) |

- **False Positive Rate:** 9.9%
- **False Negative Rate:** 25.0%
- **Precision:** 0.78
- **Recall:** 0.75

---

## False Negative Analysis

**Definition:** Cases where the model predicted low distress but the true label was high distress.

### Error Distribution

| Error Category | Count | Percentage |
|----------------|-------|------------|
| Sarcasm/irony | 10 | 25% |
| Implicit indicators | 14 | 35% |
| Ambiguous context | 10 | 25% |
| Label noise | 6 | 15% |

---

### Category 1: Sarcasm/Irony (25%)

The model fails to detect distress when it's expressed through sarcastic or ironic language.

**Example FN-1:**
> "Great job me, another month of spending money I don't have. Really killing it at this adulting thing."

- **Predicted:** 0.31 (low)
- **Actual:** 1 (high)
- **Issue:** Sarcastic positive language ("Great job", "killing it") masks the underlying self-blame
- **Linguistic pattern:** Positive words + negative financial situation

**Example FN-2:**
> "Oh wonderful, my partner just found out about the credit card. This is going to be fun."

- **Predicted:** 0.28 (low)
- **Actual:** 1 (high)
- **Issue:** "Wonderful" and "fun" are processed as positive despite sarcastic intent

**Root Cause:** FinBERT's pre-training on financial news may not capture sarcasm patterns common in social media.

**Potential Fix:** 
- Add sarcasm detection as preprocessing step
- Include sarcasm-labelled examples in fine-tuning
- Consider sentiment contrast features (positive words + negative context)

---

### Category 2: Implicit Indicators (35%)

Distress is expressed indirectly without explicit linguistic markers.

**Example FN-3:**
> "I keep telling myself tomorrow I'll look at the bank account. It's been three weeks of tomorrows."

- **Predicted:** 0.42 (low)
- **Actual:** 1 (high)
- **Issue:** Avoidance is implied through the "tomorrow" metaphor rather than stated explicitly
- **Missing markers:** No explicit "afraid", "avoiding", "can't look"

**Example FN-4:**
> "My partner asked about our savings today. I changed the subject to dinner plans."

- **Predicted:** 0.38 (low)
- **Actual:** 1 (high)
- **Issue:** Secrecy behaviour described without secrecy language ("hiding", "don't know")

**Root Cause:** Model relies on explicit linguistic markers; implicit behavioural descriptions are harder to detect.

**Potential Fix:**
- Expand labelling to include behavioural descriptions
- Add features for topic-switching patterns
- Consider discourse-level features beyond sentence-level

---

### Category 3: Ambiguous Context (25%)

Cases where distress interpretation depends on context not available in the text.

**Example FN-5:**
> "We're behind on our savings goal again this month."

- **Predicted:** 0.35 (low)
- **Actual:** 1 (high)
- **Issue:** Annotator may have interpreted tone as distressed; model sees factual statement
- **Note:** This may also be label noise

**Example FN-6:**
> "I don't know how we're going to make it to the end of the month."

- **Predicted:** 0.44 (low)
- **Actual:** 1 (high)
- **Issue:** Uncertainty expression could be distress or pragmatic problem-solving

**Root Cause:** Limited context in isolated text snippets; some cases genuinely ambiguous.

**Potential Fix:**
- Accept as inherent limitation
- Consider higher threshold for borderline cases
- Add confidence calibration for ambiguous predictions

---

### Category 4: Label Noise (15%)

Cases where the original label may have been incorrect.

**Example FN-7:**
> "We went over budget on the holiday but it was worth it. No regrets!"

- **Predicted:** 0.18 (low)
- **Actual:** 1 (high)
- **Issue:** "No regrets" contradicts distress label; likely mislabelled
- **Recommendation:** Relabel as 0

**Root Cause:** Inherent noise in human labelling process (κ = 0.68).

**Implication:** Performance ceiling around 85-90% even with perfect model.

---

## False Positive Analysis

**Definition:** Cases where the model predicted high distress but the true label was low distress.

### Error Distribution

| Error Category | Count | Percentage |
|----------------|-------|------------|
| Regret without self-blame | 12 | 30% |
| Strong negative language (external) | 10 | 25% |
| Historical reference | 10 | 25% |
| Label noise | 8 | 20% |

---

### Category 1: Regret Without Self-Blame (30%)

Model triggers on regret language even without self-directed negativity.

**Example FP-1:**
> "I really wish we'd started investing earlier. Could have had so much more by now."

- **Predicted:** 0.67 (high)
- **Actual:** 0 (low)
- **Issue:** "Wish" triggers distress signals, but no negative self-evaluation present
- **Key distinction:** Counterfactual thinking ≠ self-blame

**Example FP-2:**
> "Looking back, we probably should have bought the house when prices were lower."

- **Predicted:** 0.58 (high)
- **Actual:** 0 (low)
- **Issue:** Hindsight regret without emotional distress

**Root Cause:** Model conflates regret language with self-blame language.

**Potential Fix:**
- Add regret vs. self-blame distinction to features
- Fine-tune with more regret-only examples labelled as non-distress

---

### Category 2: Strong Negative Language — External (25%)

Intense frustration directed externally triggers false positives.

**Example FP-3:**
> "The cost of living crisis is absolutely destroying families. It's outrageous what people are going through."

- **Predicted:** 0.72 (high)
- **Actual:** 0 (low)
- **Issue:** Strong negative sentiment about external situation, not personal distress
- **Key distinction:** Societal commentary ≠ personal distress

**Example FP-4:**
> "I'm furious with the energy companies. Our bills have tripled and they're making record profits."

- **Predicted:** 0.61 (high)
- **Actual:** 0 (low)
- **Issue:** Anger directed outward, not inward

**Root Cause:** Model doesn't distinguish self-directed vs. externally-directed negative emotion.

**Potential Fix:**
- Add target-of-emotion features (self vs. external)
- Include more externally-directed examples in training

---

### Category 3: Historical Reference (25%)

Discussing past distress (now resolved) triggers false positives.

**Example FP-5:**
> "We used to be terrible with money. I remember lying awake worrying. But that was years ago — we've completely turned things around."

- **Predicted:** 0.64 (high)
- **Actual:** 0 (low)
- **Issue:** Past tense distress language triggers current prediction
- **Key distinction:** Past distress ≠ current distress

**Example FP-6:**
> "I was hiding purchases from my husband for years. Coming clean was the best thing I ever did."

- **Predicted:** 0.71 (high)
- **Actual:** 0 (low)
- **Issue:** Secrecy language present but in resolved context

**Root Cause:** Model processes distress markers without temporal context.

**Potential Fix:**
- Add temporal features (past vs. present tense)
- Include resolved-situation examples in training
- Consider discourse markers ("used to", "but now", "turned around")

---

### Category 4: Label Noise (20%)

Cases where the original label may have been incorrect.

**Example FP-7:**
> "I feel like such a failure — we're £500 behind on our savings target."

- **Predicted:** 0.78 (high)
- **Actual:** 0 (low)
- **Issue:** Clear self-blame language ("such a failure"); model prediction seems correct
- **Recommendation:** Relabel as 1

---

## Subgroup Error Analysis

### Error Rates by Household Type

| Household Type | FP Rate | FN Rate | Notes |
|----------------|---------|---------|-------|
| Couples (no kids) | 8.2% | 22.1% | Best performance |
| Couples (with kids) | 9.8% | 25.4% | Near average |
| Single parents | 12.4% | 29.8% | Higher FN — implicit stress |
| Multi-generational | 14.2% | 33.6% | Worst — limited training data |
| Single person | 9.1% | 24.2% | Near average |

**Key Finding:** Multi-generational households have highest error rates, likely due to underrepresentation in training data (5% of dataset).

---

## Recommendations

### Short-term Improvements

1. **Sarcasm preprocessing** — Add sarcasm detection layer before distress classification

2. **Temporal feature engineering** — Include tense analysis to distinguish past vs. present

3. **Target-of-emotion classification** — Add intermediate task: self vs. external directed

### Long-term Improvements

1. **Data collection for underrepresented groups** — Target multi-generational and single-parent households

2. **Implicit distress examples** — Expand labelling guidelines to cover behavioural descriptions

3. **Multi-turn context** — If available, use conversation history for disambiguation

### Accepted Limitations

1. **Ambiguous cases** — Some texts are genuinely ambiguous; accept ~10% irreducible error

2. **Label noise ceiling** — With κ = 0.68, perfect model would still show ~15% disagreement with labels

3. **Cultural variation** — May need culture-specific models for international deployment

---

## Impact Assessment

| Error Type | User Impact | Severity |
|------------|-------------|----------|
| FN (missed distress) | User in distress receives direct/neutral messaging | **High** — may feel dismissed |
| FP (false distress) | Non-distressed user receives gentle messaging | **Low** — slightly over-cautious |

Given asymmetric impact, **lower threshold** (e.g., 0.4) may be appropriate for production to reduce false negatives at cost of more false positives.

---

## Appendix: Sample Error Cases

### Full False Negative Examples

| ID | Text | Pred | Actual | Category |
|----|------|------|--------|----------|
| FN-1 | "Great job me, another month of spending..." | 0.31 | 1 | Sarcasm |
| FN-3 | "I keep telling myself tomorrow..." | 0.42 | 1 | Implicit |
| FN-5 | "We're behind on our savings goal again..." | 0.35 | 1 | Ambiguous |

### Full False Positive Examples

| ID | Text | Pred | Actual | Category |
|----|------|------|--------|----------|
| FP-1 | "I really wish we'd started investing earlier..." | 0.67 | 0 | Regret |
| FP-3 | "The cost of living crisis is absolutely..." | 0.72 | 0 | External |
| FP-5 | "We used to be terrible with money..." | 0.64 | 0 | Historical |
