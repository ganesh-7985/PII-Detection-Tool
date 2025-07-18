from pydantic import BaseModel
from typing import List, Dict

class UploadResponse(BaseModel):
    job_id: str

class StatusResponse(BaseModel):
    status: str

class Detection(BaseModel):
    type: str
    text: str
    bbox: List[List[float]]
    confidence: float

class ResultResponse(BaseModel):
    detections: List[Detection]
    flagged: List[Detection]
    image_base64: str
    languages: List[str]  # Added for frontend

class ReviewRequest(BaseModel):
    decisions: Dict[int, bool]
