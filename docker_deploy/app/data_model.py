from pydantic import BaseModel
from typing import Optional, List, Union
from constants import *

class OutputDataModel(BaseModel):
    StatusCode: bool
    StatusMessage: str

class FeaturesToInclude(BaseModel):
    features_to_include: list[str] = ALL_FEATURES


class FeatureRanges(BaseModel):
    features_ranges: list[str] = []