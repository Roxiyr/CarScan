from fastapi import FastAPI, HTTPException, UploadFile, File
import logging
import os
import time
from .predictor import get_predictor
from .schemas import HasilPrediksi

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Car Classifier API",
    description="API klasifikasi merek dan model mobil dari foto",
    version="1.0.0"
)

# Load model saat startup
predictor = get_predictor()
predictor._load_model()
predictor._load_classes()
logger.info("✅ Model dan class names berhasil dimuat!")


@app.post("/predict", response_model=HasilPrediksi)
async def predict(file: UploadFile = File(...)):
    """
    Upload foto mobil → dapatkan prediksi merek & model.

    - **file**: foto mobil (jpg/png/jpeg)
    """
    # Debug logging: tunjukkan info file yang diterima
    logger.info("Received upload: filename=%s content_type=%s", file.filename, file.content_type)

    # Validasi tipe file — terima semua tipe image/* untuk kompatibilitas
    if not (file.content_type and file.content_type.startswith("image/")):
        raise HTTPException(
            status_code=400,
            detail="Format file tidak didukung. Kirimkan file gambar (JPG/PNG)."
        )

    start = time.time()
    try:
        image_bytes = await file.read()
        result      = predictor.predict(image_bytes)
        logger.info("Prediction: %s | confidence=%.4f", result.prediksi_utama, result.confidence)
        return result
    except Exception as e:
        logger.error("Error in prediction: %s", str(e))
        raise HTTPException(status_code=500, detail=f"Prediksi gagal: {str(e)}")
    finally:
        logger.info("Prediction took %.2fs", time.time() - start)


@app.get("/health")
async def health():
    return {
        "status":        "healthy",
        "model_loaded":  predictor.model is not None,
        "classes_loaded": predictor.class_names is not None,
        "jumlah_kelas":  len(predictor.class_names) if predictor.class_names else 0
    }


@app.get("/classes")
async def get_classes():
    """Lihat semua kelas mobil yang bisa dideteksi"""
    if predictor.class_names is None:
        raise HTTPException(status_code=500, detail="Class names belum dimuat")
    return {
        "jumlah_kelas": len(predictor.class_names),
        "kelas": predictor.class_names,
        "classes": predictor.class_names,
        "img_size": list(predictor.img_size) if predictor.img_size else None,
    }


@app.get("/model-info")
async def model_info():
    """Info model untuk frontend"""
    return {
        "model": os.path.basename(predictor.model_path) if predictor.model_path else None,
        "model_loaded": predictor.model is not None,
        "jumlah_kelas": len(predictor.class_names) if predictor.class_names else 0,
        "img_size": list(predictor.img_size) if predictor.img_size else None,
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
