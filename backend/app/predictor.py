import os
import json
import logging
import numpy as np
import tensorflow as tf
from PIL import Image
import io

logger = logging.getLogger(__name__)


def _find_file(base: str, ext: str) -> str:
    """Cari file berdasarkan ekstensi secara otomatis di folder models/"""
    for name in os.listdir(base):
        if name.endswith(ext):
            return os.path.join(base, name)
    raise FileNotFoundError(f"Tidak ada file {ext} di folder: {base}")


class CarPredictor:
    def __init__(self):
        base               = os.path.join(os.path.dirname(__file__), '..', 'models')
        self.model_path    = _find_file(base, '.h5')
        self.classes_path  = _find_file(base, '.json')
        self.model         = None
        self.class_names   = None
        self.img_size      = (224, 224)
        logger.info('Model path  : %s', self.model_path)
        logger.info('Classes path: %s', self.classes_path)

    def _load_model(self):
        if self.model is not None:
            return
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            logger.info('✅ Model loaded: %s', self.model_path)
        except Exception as e:
            logger.error('Gagal load model: %s', str(e))
            self.model = None
            raise

    def _load_classes(self):
        if self.class_names is not None:
            return
        try:
            with open(self.classes_path, 'r') as f:
                self.class_names = json.load(f)
            logger.info('✅ Class names loaded | jumlah kelas: %d', len(self.class_names))
        except Exception as e:
            logger.error('Gagal load class names: %s', str(e))
            self.class_names = None
            raise

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img = img.resize(self.img_size)
        arr = np.array(img, dtype=np.float32) / 255.0
        return np.expand_dims(arr, axis=0)

    def predict(self, image_bytes: bytes):
        from .schemas import HasilPrediksi, PrediksiMobil

        self._load_model()
        self._load_classes()

        img_array   = self.preprocess_image(image_bytes)
        predictions = self.model.predict(img_array, verbose=0)[0]

        # Top 5 prediksi
        top5_idx = np.argsort(predictions)[::-1][:5]
        top5     = [
            PrediksiMobil(
                merek_model=self.class_names[i],
                confidence=round(float(predictions[i]), 4),
                confidence_persen=f"{float(predictions[i])*100:.1f}%"
            )
            for i in top5_idx
        ]

        best_conf  = float(predictions[top5_idx[0]])
        best_label = self.class_names[top5_idx[0]]

        if best_conf >= 0.85:
            level, color = 'Sangat Yakin', 'green'
        elif best_conf >= 0.60:
            level, color = 'Cukup Yakin', 'orange'
        elif best_conf >= 0.40:
            level, color = 'Kurang Yakin', 'yellow'
        else:
            level, color = 'Tidak Yakin', 'red'

        logger.info('PREDICT | %s | confidence=%.4f | level=%s', best_label, best_conf, level)

        return HasilPrediksi(
            prediksi_utama=best_label,
            confidence=round(best_conf, 4),
            confidence_persen=f"{best_conf*100:.1f}%",
            confidence_level=level,
            confidence_color=color,
            top5=top5
        )


_predictor_instance = None

def get_predictor() -> CarPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = CarPredictor()
    return _predictor_instance
