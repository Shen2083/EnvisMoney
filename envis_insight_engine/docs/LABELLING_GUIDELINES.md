# Envis Insight Engine - Labelling Guidelines

**Version:** 1.0  
**Last Updated:** July 2025  
**Document Reference:** Appendix S, Part 2.2

---

## Overview

This document defines the labelling taxonomy for the Envis Insight Engine training dataset. The taxonomy was developed through iterative refinement over three pilot rounds and is designed to identify observable linguistic and behavioural patterns associated with financial distress and household dynamics.

### Important Framing

**We label observable indicators, not psychological states.**

A label of "high distress" means "this text contains linguistic patterns associated with financial distress" — NOT "this person is experiencing clinical distress."

This distinction is crucial for honest representation of the system's capabilities.

---

## Label Categories

### 1. Distress Indicators (Binary: 0/1)

#### 1.1 Self-Blame Language

**Definition:** Language indicating the person attributes their financial situation to personal failure or inadequacy.

**Linguistic Markers:**
- "I'm so bad at..."
- "I should know better"
- "What's wrong with me"
- "I've failed"
- "I can't believe I..."
- "I'm such an idiot for..."

**Positive Example (Label = 1):**
> "I feel like such a failure for not having more saved by now. Everyone my age seems to have it together but me."

*Rationale: Contains explicit self-directed negative evaluation ("failure"), comparative inadequacy ("everyone my age"), and global self-assessment.*

**Negative Example (Label = 0):**
> "We overspent this month on groceries. Prices have really gone up."

*Rationale: Acknowledges a situation without self-blame. Attribution is external (prices) and tone is factual.*

**Borderline Guidance:**
- "I wish I'd started saving earlier" alone is regret, not self-blame → **Label 0**
- "I'm so stupid for not starting earlier" is self-blame → **Label 1**
- The distinction is presence of negative self-evaluation, not just counterfactual thinking

---

#### 1.2 Avoidance Language

**Definition:** Language indicating reluctance to engage with financial information or discussions.

**Linguistic Markers:**
- "I'm afraid to look"
- "I've been avoiding"
- "I can't bring myself to"
- "I haven't checked in [time period]"
- "I don't want to know"

**Positive Example (Label = 1):**
> "I haven't looked at my bank balance in two weeks because I'm scared of what I'll see."

*Rationale: Explicit avoidance ("haven't looked") with fear motivation ("scared").*

**Negative Example (Label = 0):**
> "I check my accounts every day—probably too often honestly."

*Rationale: Shows engagement, not avoidance.*

---

#### 1.3 Secrecy Language

**Definition:** Language indicating hiding financial information from partner or family.

**Linguistic Markers:**
- "I haven't told them"
- "they don't know"
- "I've been hiding"
- "secret account"
- "I can't tell my partner"

**Positive Example (Label = 1):**
> "I've racked up £3000 on a credit card my husband doesn't know about. I'm too ashamed to tell him."

*Rationale: Explicit hiding ("doesn't know") with shame attribution.*

**Negative Example (Label = 0):**
> "We keep separate fun money accounts—it works well for us."

*Rationale: Separate accounts by mutual agreement is not secrecy.*

---

#### Overall Distress Label

The overall distress label should be **1** if ANY of the following are true:
- Self-blame = 1
- Avoidance = 1
- Secrecy = 1

The overall distress label should be **0** only if ALL sub-indicators are 0.

---

### 2. Framing Labels (5 Classes)

The framing label guides message style selection for interventions.

| Label | When Appropriate | Tone | Example Message |
|-------|-----------------|------|-----------------|
| **Supportive** | Distress indicators present | Warm, non-judgmental, emphasises progress and capability | "Managing money as a family isn't easy, and you're doing better than you might think. Small steps add up." |
| **Direct** | Distress low, user can handle factual information | Clear, specific, actionable | "Your dining spending was £47 over budget this week. Here are the transactions." |
| **Celebratory** | Achievements and positive milestones | Enthusiastic, reinforcing | "You did it! Your emergency fund just hit £1,000. That's a major milestone." |
| **Gentle** | Moderate distress or sensitive topics | Soft, tentative, supportive | "Whenever you're ready, here are some ideas that might help with the grocery budget." |
| **Urgent** | Immediate action needed AND distress is low | Clear, time-sensitive | "Action needed: Your account balance is £12. A £50 direct debit is due tomorrow." |

**Decision Tree:**
1. Is this a positive milestone/achievement? → **Celebratory**
2. Is immediate action required AND distress low? → **Urgent**
3. Is distress high? → **Supportive** or **Gentle** (use Gentle if topic is particularly sensitive)
4. Is distress moderate? → **Gentle**
5. Is distress low and factual info appropriate? → **Direct**

---

### 3. Tension Indicators (Binary: 0/1)

#### 3.1 Blame Language

**Definition:** Language attributing financial problems to partner rather than shared responsibility.

**Positive Example (Label = 1):**
> "My wife keeps spending money we don't have. I've tried talking to her but she won't listen."

*Rationale: Partner-directed blame, implied conflict.*

**Negative Example (Label = 0):**
> "We both struggle with impulse purchases."

*Rationale: Shared attribution, no blame.*

---

#### 3.2 Conflict Indicators

**Definition:** Language indicating disagreement or argument about finances.

**Linguistic Markers:**
- "We argued about"
- "they got angry when"
- "we can't agree on"
- "every time I bring up money"

**Positive Example (Label = 1):**
> "I do ALL the budgeting in our house while my husband spends whatever he wants. When I bring up money, he says I'm being controlling. I'm exhausted."

*Rationale: Clear tension pattern with partner blame and reported conflict.*

---

#### Distinguishing Tension from Distress

- **Tension** = interpersonal/situational, directed at partner or household dynamics
- **Distress** = self-directed, internalised shame/guilt/avoidance

A record can have:
- High tension, low distress (frustrated with partner but not self-blaming)
- High distress, low tension (self-blame without partner conflict)
- Both high (self-blame AND partner conflict)
- Both low (neutral/factual discussion)

---

## Labelling Process

### Workflow

1. Read the full text carefully
2. Identify linguistic markers for each category
3. Apply labels in order: Distress sub-indicators → Overall Distress → Tension → Framing
4. Document reasoning for borderline cases

### Quality Control

- 20% of records double-labelled for agreement measurement
- Weekly calibration meetings to address edge cases
- Senior annotator resolves disagreements
- Target inter-annotator agreement: κ ≥ 0.60

### Achieved Agreement

| Category | Cohen's κ | % Agreement |
|----------|-----------|-------------|
| Distress (overall) | 0.68 | 81% |
| Self-blame | 0.71 | 84% |
| Avoidance | 0.65 | 79% |
| Secrecy | 0.73 | 86% |
| Framing selection | 0.64 | 74% |
| Tension indicators | 0.71 | 83% |

All κ values fall in the "substantial agreement" range (0.61-0.80) per Landis and Koch (1977).

---

## Exclusion Criteria

The following records should be **excluded** from the dataset:

1. **Crisis indicators**: Posts containing suicide, self-harm mentions
2. **Non-household context**: Purely individual financial discussion with no household relevance
3. **Non-English text**: Posts in languages other than English
4. **Spam/promotional content**: Obvious marketing or promotional posts
5. **Insufficient content**: Posts too short to make meaningful assessment (<10 words)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | May 2025 | Initial pilot taxonomy |
| 0.2 | June 2025 | Refined after first pilot round |
| 0.3 | June 2025 | Added borderline guidance after second pilot |
| 1.0 | July 2025 | Final version after third pilot round |
