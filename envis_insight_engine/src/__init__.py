"""
Envis Insight Engine

Multi-modal neural network for household financial coaching.
"""

from .model import EnvisInsightEngine, ModelConfig
from .household_filter import HouseholdFilter, HouseholdFilterConfig

__version__ = "1.0.0"
__all__ = [
    "EnvisInsightEngine",
    "ModelConfig", 
    "HouseholdFilter",
    "HouseholdFilterConfig",
]
