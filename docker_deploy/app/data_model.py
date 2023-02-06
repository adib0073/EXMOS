from pydantic import BaseModel
from typing import Optional, List, Union
from constants import *

class OutputDataModel(BaseModel):
    StatusCode: bool
    StatusMessage: str

class OutputwithPayloadDataModel(BaseModel):
    StatusCode: bool
    StatusMessage: str    
    OutputJson: dict = None

class ValidateUserModel(BaseModel):
    UserId: str
    Cohort: str

class FeaturesToInclude(BaseModel):
    features_to_include: list[str] = ALL_FEATURES


class FeatureRanges(BaseModel):
    features_to_include: list[str] = ALL_FEATURES
    features_ranges: list[tuple] = DEFAULT_VALUES