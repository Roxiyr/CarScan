from pydantic import BaseModel
from typing import List

class PrediksiMobil(BaseModel):
    merek_model: str
    confidence: float
    confidence_persen: str

class HasilPrediksi(BaseModel):
    prediksi_utama: str
    confidence: float
    confidence_persen: str
    confidence_level: str
    confidence_color: str
    top5: List[PrediksiMobil]
