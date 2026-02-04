"""
Envis Insight Engine - Data Preprocessing Pipeline

Processes raw data from multiple sources into training-ready format.

Pipeline stages:
1. Load raw data from sources
2. Clean and normalise text
3. Apply household relevance filtering
4. Generate synthetic household structures
5. Split into train/val/test
6. Save processed dataset

Usage:
    python preprocess.py --config config/preprocess_config.yaml --output data/processed/
"""

import argparse
import json
import re
import random
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, List, Tuple, Optional
from datetime import datetime
import csv

# In production:
# import pandas as pd
# from household_filter import HouseholdFilter


@dataclass
class PreprocessConfig:
    """Configuration for preprocessing pipeline."""
    
    # Input sources
    transaction_source: str = "huggingface"
    text_source: str = "reddit_archive"
    
    # Cleaning
    min_text_length: int = 10
    max_text_length: int = 500
    remove_urls: bool = True
    lowercase: bool = True
    
    # Filtering
    household_threshold: float = 0.4
    
    # Household generation
    household_distribution: Dict = None
    
    # Splitting
    train_ratio: float = 0.8
    val_ratio: float = 0.1
    test_ratio: float = 0.1
    stratify_by: str = "distress_label"
    
    # Random seed
    seed: int = 42
    
    def __post_init__(self):
        if self.household_distribution is None:
            # Based on ONS statistics
            self.household_distribution = {
                "couples_no_children": 0.32,
                "couples_with_children": 0.28,
                "single_person": 0.25,
                "single_parent": 0.10,
                "multi_generational": 0.05,
            }


class TextCleaner:
    """Clean and normalise text data."""
    
    URL_PATTERN = re.compile(r'https?://\S+|www\.\S+')
    SPECIAL_CHARS = re.compile(r'[^\w\s£$€\-.,!?\'"()]')
    WHITESPACE = re.compile(r'\s+')
    
    def __init__(self, config: PreprocessConfig):
        self.config = config
    
    def clean(self, text: str) -> Optional[str]:
        """
        Clean a single text record.
        
        Returns None if text should be excluded.
        """
        if not text or not isinstance(text, str):
            return None
        
        # Remove URLs
        if self.config.remove_urls:
            text = self.URL_PATTERN.sub('', text)
        
        # Remove special characters (keep currency symbols)
        text = self.SPECIAL_CHARS.sub(' ', text)
        
        # Normalise whitespace
        text = self.WHITESPACE.sub(' ', text).strip()
        
        # Lowercase
        if self.config.lowercase:
            text = text.lower()
        
        # Length check
        word_count = len(text.split())
        if word_count < self.config.min_text_length:
            return None
        if word_count > self.config.max_text_length:
            # Truncate to max length
            words = text.split()[:self.config.max_text_length]
            text = ' '.join(words)
        
        return text
    
    def clean_batch(self, texts: List[str]) -> List[Tuple[int, str]]:
        """Clean a batch of texts, returning (index, cleaned_text) pairs."""
        results = []
        for i, text in enumerate(texts):
            cleaned = self.clean(text)
            if cleaned:
                results.append((i, cleaned))
        return results


class HouseholdGenerator:
    """Generate synthetic household structures based on demographics."""
    
    ROLE_CONFIGS = {
        "couples_no_children": {
            "members": [
                {"role": "partner_1"},
                {"role": "partner_2"},
            ],
            "relationships": [("partner_1", "partner_2", "partner_partner")],
        },
        "couples_with_children": {
            "members": [
                {"role": "partner_1"},
                {"role": "partner_2"},
                {"role": "child"},
            ],
            "relationships": [
                ("partner_1", "partner_2", "partner_partner"),
                ("partner_1", "child", "parent_child"),
                ("partner_2", "child", "parent_child"),
            ],
        },
        "single_person": {
            "members": [
                {"role": "partner_1"},
            ],
            "relationships": [],
        },
        "single_parent": {
            "members": [
                {"role": "partner_1"},
                {"role": "child"},
            ],
            "relationships": [
                ("partner_1", "child", "parent_child"),
            ],
        },
        "multi_generational": {
            "members": [
                {"role": "partner_1"},
                {"role": "partner_2"},
                {"role": "child"},
                {"role": "parent"},
            ],
            "relationships": [
                ("partner_1", "partner_2", "partner_partner"),
                ("partner_1", "child", "parent_child"),
                ("partner_2", "child", "parent_child"),
                ("parent", "partner_1", "parent_child"),
            ],
        },
    }
    
    AGE_BRACKETS = ["18-25", "25-35", "35-45", "45-55", "55-65", "65+"]
    INCOME_BRACKETS = ["low", "medium", "high", "unknown"]
    
    def __init__(self, config: PreprocessConfig):
        self.config = config
        random.seed(config.seed)
    
    def generate(self) -> Dict:
        """Generate a random household structure."""
        # Sample household type
        household_type = random.choices(
            list(self.config.household_distribution.keys()),
            weights=list(self.config.household_distribution.values()),
        )[0]
        
        base_config = self.ROLE_CONFIGS[household_type]
        
        # Add random attributes to members
        members = []
        for member in base_config["members"]:
            member_data = member.copy()
            
            # Age bracket (with some logic)
            if member["role"] == "child":
                member_data["age_bracket"] = random.choice(["18-25", "25-35"])
            elif member["role"] == "parent":
                member_data["age_bracket"] = random.choice(["55-65", "65+"])
            else:
                member_data["age_bracket"] = random.choice(self.AGE_BRACKETS)
            
            # Income bracket
            member_data["income_bracket"] = random.choice(self.INCOME_BRACKETS)
            
            members.append(member_data)
        
        return {
            "household_type": household_type,
            "members": members,
            "relationships": base_config["relationships"],
        }


class DataSplitter:
    """Split data into train/val/test sets with stratification."""
    
    def __init__(self, config: PreprocessConfig):
        self.config = config
        random.seed(config.seed)
    
    def split(
        self, 
        records: List[Dict],
        household_ids: Optional[List[str]] = None,
    ) -> Tuple[List[Dict], List[Dict], List[Dict]]:
        """
        Split records into train/val/test.
        
        Ensures no household appears in multiple splits.
        """
        # Group by household if provided
        if household_ids:
            # Group records by household
            household_records = {}
            for record, hid in zip(records, household_ids):
                if hid not in household_records:
                    household_records[hid] = []
                household_records[hid].append(record)
            
            # Split at household level
            households = list(household_records.keys())
            random.shuffle(households)
            
            n_total = len(households)
            n_train = int(n_total * self.config.train_ratio)
            n_val = int(n_total * self.config.val_ratio)
            
            train_hids = set(households[:n_train])
            val_hids = set(households[n_train:n_train + n_val])
            test_hids = set(households[n_train + n_val:])
            
            train = [r for r, h in zip(records, household_ids) if h in train_hids]
            val = [r for r, h in zip(records, household_ids) if h in val_hids]
            test = [r for r, h in zip(records, household_ids) if h in test_hids]
        
        else:
            # Simple random split
            records = records.copy()
            random.shuffle(records)
            
            n_total = len(records)
            n_train = int(n_total * self.config.train_ratio)
            n_val = int(n_total * self.config.val_ratio)
            
            train = records[:n_train]
            val = records[n_train:n_train + n_val]
            test = records[n_train + n_val:]
        
        return train, val, test


class PreprocessingPipeline:
    """
    Main preprocessing pipeline.
    
    Orchestrates all preprocessing steps.
    """
    
    def __init__(self, config: PreprocessConfig):
        self.config = config
        self.cleaner = TextCleaner(config)
        self.household_gen = HouseholdGenerator(config)
        self.splitter = DataSplitter(config)
        
        # In production:
        # self.household_filter = HouseholdFilter()
    
    def run(
        self,
        raw_texts: List[str],
        output_dir: str,
    ) -> Dict:
        """
        Run full preprocessing pipeline.
        
        Args:
            raw_texts: List of raw text records
            output_dir: Directory to save processed data
            
        Returns:
            Summary statistics
        """
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        
        stats = {
            "input_records": len(raw_texts),
            "timestamp": datetime.utcnow().isoformat() + "Z",
        }
        
        print(f"Starting preprocessing pipeline...")
        print(f"Input records: {len(raw_texts)}")
        
        # Step 1: Clean texts
        print("Step 1: Cleaning texts...")
        cleaned = self.cleaner.clean_batch(raw_texts)
        stats["after_cleaning"] = len(cleaned)
        print(f"  After cleaning: {len(cleaned)}")
        
        # Step 2: Household filtering
        print("Step 2: Applying household filter...")
        filtered = []
        for idx, text in cleaned:
            # In production:
            # result = self.household_filter.score(text)
            # if result.is_household_relevant:
            #     filtered.append((idx, text, result.relevance_score))
            
            # Simulated filtering for demo
            score = self._simulate_household_score(text)
            if score >= self.config.household_threshold:
                filtered.append((idx, text, score))
        
        stats["after_filtering"] = len(filtered)
        stats["retention_rate"] = len(filtered) / len(cleaned) if cleaned else 0
        print(f"  After filtering: {len(filtered)} ({stats['retention_rate']:.1%} retention)")
        
        # Step 3: Generate household structures
        print("Step 3: Generating household structures...")
        records = []
        for idx, text, score in filtered:
            household = self.household_gen.generate()
            records.append({
                "record_id": f"ENS_{idx:05d}",
                "text": text,
                "household_relevance_score": round(score, 3),
                "household": household,
            })
        
        # Step 4: Split data
        print("Step 4: Splitting into train/val/test...")
        train, val, test = self.splitter.split(records)
        
        stats["train_records"] = len(train)
        stats["val_records"] = len(val)
        stats["test_records"] = len(test)
        
        print(f"  Train: {len(train)}, Val: {len(val)}, Test: {len(test)}")
        
        # Step 5: Save outputs
        print("Step 5: Saving processed data...")
        
        with open(output_path / "train.json", 'w') as f:
            json.dump({"records": train}, f, indent=2)
        
        with open(output_path / "val.json", 'w') as f:
            json.dump({"records": val}, f, indent=2)
        
        with open(output_path / "test.json", 'w') as f:
            json.dump({"records": test}, f, indent=2)
        
        with open(output_path / "stats.json", 'w') as f:
            json.dump(stats, f, indent=2)
        
        print(f"Saved to {output_path}")
        print("Done!")
        
        return stats
    
    def _simulate_household_score(self, text: str) -> float:
        """Simulate household relevance score for demo."""
        text_lower = text.lower()
        
        # Simple keyword scoring
        household_keywords = [
            "we", "our", "us", "partner", "spouse", "husband", "wife",
            "family", "household", "kids", "children", "together"
        ]
        
        word_count = len(text_lower.split())
        keyword_count = sum(1 for kw in household_keywords if kw in text_lower)
        
        score = min(keyword_count / 5, 1.0) * 0.6 + random.random() * 0.4
        return score


def main():
    parser = argparse.ArgumentParser(description="Preprocess data for Envis Insight Engine")
    parser.add_argument("--input", type=str, required=True,
                        help="Input data file (JSON or CSV)")
    parser.add_argument("--output", type=str, required=True,
                        help="Output directory for processed data")
    parser.add_argument("--threshold", type=float, default=0.4,
                        help="Household relevance threshold")
    parser.add_argument("--seed", type=int, default=42,
                        help="Random seed")
    
    args = parser.parse_args()
    
    # Load config
    config = PreprocessConfig(
        household_threshold=args.threshold,
        seed=args.seed,
    )
    
    # Load input data
    input_path = Path(args.input)
    if input_path.suffix == '.json':
        with open(input_path) as f:
            data = json.load(f)
        texts = [r.get("text", "") for r in data.get("records", [])]
    elif input_path.suffix == '.csv':
        texts = []
        with open(input_path) as f:
            reader = csv.DictReader(f)
            for row in reader:
                texts.append(row.get("text", ""))
    else:
        raise ValueError(f"Unsupported input format: {input_path.suffix}")
    
    # Run pipeline
    pipeline = PreprocessingPipeline(config)
    stats = pipeline.run(texts, args.output)
    
    print("\nSummary:")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
