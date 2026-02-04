"""
Envis Insight Engine - Household Relevance Filter

This module implements the household filtering methodology described in 
Appendix S, Part 2.1 of the Envis Business Plan.

The filter identifies records relevant to household (vs. individual-only)
financial contexts using a weighted combination of four signals.

Threshold Selection:
- Threshold 0.3: Precision 0.71, Recall 0.89, F1 0.79
- Threshold 0.4: Precision 0.83, Recall 0.81, F1 0.82 (SELECTED)
- Threshold 0.5: Precision 0.89, Recall 0.68, F1 0.77

At threshold 0.4:
- 83% of retained records are truly household-relevant (precision)
- 81% of all household-relevant records are captured (recall)
"""

import re
from dataclasses import dataclass
from typing import List, Tuple, Optional


@dataclass
class HouseholdFilterConfig:
    """Configuration for household relevance filtering."""
    
    # Signal weights (must sum to 1.0)
    keyword_weight: float = 0.40
    pronoun_weight: float = 0.20
    shared_goal_weight: float = 0.25
    multi_person_weight: float = 0.15
    
    # Threshold for classification
    relevance_threshold: float = 0.40
    
    def __post_init__(self):
        total = (self.keyword_weight + self.pronoun_weight + 
                 self.shared_goal_weight + self.multi_person_weight)
        assert abs(total - 1.0) < 0.001, f"Weights must sum to 1.0, got {total}"


# Household-indicating keywords with specificity scores
HOUSEHOLD_KEYWORDS = {
    # High specificity (0.9-1.0)
    'joint account': 1.0,
    'our mortgage': 1.0,
    'our rent': 1.0,
    'family budget': 1.0,
    'household income': 1.0,
    'family finances': 0.95,
    'household expenses': 0.95,
    
    # Medium-high specificity (0.7-0.9)
    'partner': 0.85,
    'spouse': 0.9,
    'husband': 0.9,
    'wife': 0.9,
    'kids': 0.8,
    'children': 0.75,
    'family': 0.7,
    'household': 0.85,
    
    # Medium specificity (0.5-0.7)
    'together': 0.5,
    'both of us': 0.7,
    'as a couple': 0.8,
    'our savings': 0.7,
    'our bills': 0.75,
    'our debt': 0.7,
}

# Shared goal patterns (regex)
SHARED_GOAL_PATTERNS = [
    r"we(?:'re| are) saving for",
    r"our goal is",
    r"together we",
    r"as a family",
    r"as a couple",
    r"we(?:'re| are) trying to",
    r"we(?:'re| are) working on",
    r"we want to",
    r"we need to",
    r"our plan is",
    r"we(?:'ve| have) been",
]

# Pronouns for ratio calculation
PLURAL_FIRST_PERSON = {'we', 'us', 'our', 'ours', 'ourselves'}
ALL_FIRST_PERSON = {'i', 'me', 'my', 'mine', 'myself', 'we', 'us', 'our', 'ours', 'ourselves'}


@dataclass
class FilterResult:
    """Result of household relevance filtering."""
    text: str
    relevance_score: float
    is_household_relevant: bool
    
    # Component scores
    keyword_score: float
    pronoun_ratio: float
    shared_goal_score: float
    multi_person_score: float
    
    # Detected patterns
    detected_keywords: List[Tuple[str, float]]
    detected_goal_patterns: List[str]
    person_references: List[str]


class HouseholdFilter:
    """
    Filter for identifying household-relevant financial records.
    
    Usage:
        filter = HouseholdFilter()
        result = filter.score(text)
        if result.is_household_relevant:
            # Include in dataset
    """
    
    def __init__(self, config: Optional[HouseholdFilterConfig] = None):
        self.config = config or HouseholdFilterConfig()
        
        # Compile regex patterns
        self._goal_patterns = [
            re.compile(pattern, re.IGNORECASE) 
            for pattern in SHARED_GOAL_PATTERNS
        ]
        
        # Person reference patterns
        self._person_patterns = [
            re.compile(r'\b(my|our) (partner|spouse|husband|wife|son|daughter|kid|child|mom|dad|mother|father)\b', re.IGNORECASE),
            re.compile(r'\b(he|she|they) (said|thinks|wants|needs|spent|bought)\b', re.IGNORECASE),
        ]
    
    def score(self, text: str) -> FilterResult:
        """
        Calculate household relevance score for a text.
        
        Args:
            text: The financial text to analyse
            
        Returns:
            FilterResult with score and component breakdown
        """
        text_lower = text.lower()
        
        # Signal 1: Explicit keywords
        keyword_score, detected_keywords = self._score_keywords(text_lower)
        
        # Signal 2: Plural pronoun ratio
        pronoun_ratio = self._calculate_pronoun_ratio(text_lower)
        
        # Signal 3: Shared goal patterns
        shared_goal_score, detected_patterns = self._score_shared_goals(text_lower)
        
        # Signal 4: Multiple person references
        multi_person_score, person_refs = self._score_multi_person(text)
        
        # Weighted combination
        relevance_score = (
            self.config.keyword_weight * keyword_score +
            self.config.pronoun_weight * pronoun_ratio +
            self.config.shared_goal_weight * shared_goal_score +
            self.config.multi_person_weight * multi_person_score
        )
        
        return FilterResult(
            text=text,
            relevance_score=relevance_score,
            is_household_relevant=relevance_score >= self.config.relevance_threshold,
            keyword_score=keyword_score,
            pronoun_ratio=pronoun_ratio,
            shared_goal_score=shared_goal_score,
            multi_person_score=multi_person_score,
            detected_keywords=detected_keywords,
            detected_goal_patterns=detected_patterns,
            person_references=person_refs,
        )
    
    def _score_keywords(self, text: str) -> Tuple[float, List[Tuple[str, float]]]:
        """Score based on household-indicating keywords."""
        detected = []
        max_score = 0.0
        
        for keyword, specificity in HOUSEHOLD_KEYWORDS.items():
            if keyword in text:
                detected.append((keyword, specificity))
                max_score = max(max_score, specificity)
        
        # Use max specificity (not sum) to avoid over-counting
        return max_score, detected
    
    def _calculate_pronoun_ratio(self, text: str) -> float:
        """Calculate ratio of plural first-person to all first-person pronouns."""
        words = re.findall(r'\b\w+\b', text)
        
        plural_count = sum(1 for w in words if w in PLURAL_FIRST_PERSON)
        total_first_person = sum(1 for w in words if w in ALL_FIRST_PERSON)
        
        if total_first_person == 0:
            return 0.0
        
        return plural_count / total_first_person
    
    def _score_shared_goals(self, text: str) -> Tuple[float, List[str]]:
        """Score based on shared goal language patterns."""
        detected = []
        
        for pattern in self._goal_patterns:
            matches = pattern.findall(text)
            if matches:
                detected.append(pattern.pattern)
        
        # Score based on number of distinct patterns (capped at 1.0)
        score = min(len(detected) / 3.0, 1.0)
        return score, detected
    
    def _score_multi_person(self, text: str) -> Tuple[float, List[str]]:
        """Score based on references to multiple distinct people."""
        detected = []
        
        for pattern in self._person_patterns:
            matches = pattern.findall(text)
            for match in matches:
                detected.append(' '.join(match) if isinstance(match, tuple) else match)
        
        # Score based on number of person references (capped at 1.0)
        score = min(len(set(detected)) / 2.0, 1.0)
        return score, list(set(detected))
    
    def filter_dataset(self, texts: List[str]) -> Tuple[List[str], List[FilterResult]]:
        """
        Filter a list of texts to household-relevant records.
        
        Args:
            texts: List of text records to filter
            
        Returns:
            Tuple of (filtered_texts, all_results)
        """
        results = [self.score(text) for text in texts]
        filtered = [r.text for r in results if r.is_household_relevant]
        return filtered, results


def main():
    """Example usage and validation."""
    filter = HouseholdFilter()
    
    # Test cases from documentation
    test_cases = [
        # Should be household-relevant
        "We're saving for a house deposit. My partner and I have been putting away £500 a month.",
        "Our mortgage payment went up again. We need to look at our family budget.",
        "I've been hiding purchases from my partner for months now.",
        
        # Should NOT be household-relevant
        "I'm trying to save for a new laptop. My budget is tight this month.",
        "Just opened a new savings account. The interest rate is pretty good.",
    ]
    
    print("Household Filter Test Results")
    print("=" * 60)
    
    for text in test_cases:
        result = filter.score(text)
        print(f"\nText: {text[:60]}...")
        print(f"  Score: {result.relevance_score:.3f}")
        print(f"  Household Relevant: {result.is_household_relevant}")
        print(f"  Components: kw={result.keyword_score:.2f}, "
              f"pn={result.pronoun_ratio:.2f}, "
              f"sg={result.shared_goal_score:.2f}, "
              f"mp={result.multi_person_score:.2f}")
        if result.detected_keywords:
            print(f"  Keywords: {[k for k, _ in result.detected_keywords]}")


if __name__ == "__main__":
    main()
