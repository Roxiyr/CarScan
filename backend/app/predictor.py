import os
import json
import logging
import numpy as np
import tensorflow as tf
from PIL import Image
import io

logger = logging.getLogger(__name__)


def _find_file(base: str, exts: list[str], preferred_names: list[str] | None = None) -> str:
    """Cari file model berdasarkan ekstensi secara otomatis di folder models/"""
    if preferred_names:
        for preferred in preferred_names:
            preferred_path = os.path.join(base, preferred)
            if os.path.exists(preferred_path):
                return preferred_path

    for name in sorted(os.listdir(base)):
        if any(name.endswith(ext) for ext in exts):
            return os.path.join(base, name)

    expected = ", ".join(exts)
    raise FileNotFoundError(f"Tidak ada file dengan ekstensi {expected} di folder: {base}")


class CarPredictor:
    def __init__(self):
        base = os.path.join(os.path.dirname(__file__), '..', 'models')
        self.model_path = _find_file(base, ['.keras', '.h5'], ['car_model.h5', 'car_model.keras', 'vehicle_model.keras'])
        self.class_names_path = None

        for name in sorted(os.listdir(base)):
            if name.endswith('.json') and name != 'model_config.json':
                self.class_names_path = os.path.join(base, name)
                break

        self.model = None
        self.class_names = None
        self.img_size = None
        logger.info('Model path       : %s', self.model_path)
        logger.info('Class names path : %s', self.class_names_path)

    def _load_model(self):
        if self.model is not None:
            return
        try:
            self.model = tf.keras.models.load_model(self.model_path)
            
            # Auto-detect ukuran input dari model
            input_shape = self.model.input_shape
            # input_shape format: (batch, height, width, channels)
            if len(input_shape) == 4:
                _, height, width, _ = input_shape
                self.img_size = (int(height), int(width))
            else:
                # Fallback jika shape tidak sesuai ekspektasi
                self.img_size = (260, 260)
            
            logger.info('✅ Model loaded: %s', self.model_path)
            logger.info('📏 Input size: %s', self.img_size)
        except Exception as e:
            logger.error('Gagal load model: %s', str(e))
            self.model = None
            raise

    def _load_classes(self):
        if self.class_names is not None:
            return
        try:
            if self.class_names_path and os.path.exists(self.class_names_path):
                with open(self.class_names_path, encoding='utf-8') as f:
                    loaded_data = json.load(f)

                if isinstance(loaded_data, dict):
                    self.class_names = loaded_data.get('classes') or loaded_data.get('class_names')
                    if self.class_names is None:
                        self.class_names = list(loaded_data.values())
                else:
                    self.class_names = loaded_data

                logger.info('✅ Class names loaded dari JSON | jumlah kelas: %d', len(self.class_names))
            else:
                raise FileNotFoundError('Tidak ada class_names.json di backend/models/')

            if self.model is not None:
                num_output = int(self.model.output_shape[-1])
                if len(self.class_names) != num_output:
                    logger.warning(
                        '⚠️  Jumlah kelas (%d) tidak cocok dengan output model (%d). '
                        'Pastikan class_names.json sesuai dengan model yang dipakai.',
                        len(self.class_names), num_output
                    )
        except Exception as e:
            logger.error('Gagal load class names: %s', str(e))
            self.class_names = None
            raise

    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        """
        Preprocess gambar ke ukuran yang diharapkan model.
        Maintain aspect ratio dengan padding jika diperlukan.
        """
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        
        # Jika img_size belum diset, gunakan default
        if self.img_size is None:
            self.img_size = (260, 260)
        
        target_h, target_w = self.img_size
        
        # Hitung scale untuk maintain aspect ratio
        img_w, img_h = img.size
        scale = min(target_w / img_w, target_h / img_h)
        
        new_w = int(img_w * scale)
        new_h = int(img_h * scale)
        
        # Resize gambar
        img = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Buat canvas putih dengan ukuran target
        canvas = Image.new('RGB', (target_w, target_h), (255, 255, 255))
        
        # Paste gambar di tengah canvas (center)
        offset_x = (target_w - new_w) // 2
        offset_y = (target_h - new_h) // 2
        canvas.paste(img, (offset_x, offset_y))
        
        arr = np.array(canvas, dtype=np.float32) / 255.0
        return np.expand_dims(arr, axis=0)

    def predict(self, image_bytes: bytes):
        from .schemas import HasilPrediksi, PrediksiMobil

        self._load_model()
        self._load_classes()

        img_array   = self.preprocess_image(image_bytes)
        predictions = self.model.predict(img_array, verbose=0)[0]

        # Debug: log jumlah predictions dan class names
        logger.info('📊 Predictions shape: %s | Class names: %d', predictions.shape, len(self.class_names))
        
        # Validasi: pastikan jumlah predictions = jumlah class names
        if len(predictions) != len(self.class_names):
            logger.error('❌ MISMATCH! Model output: %d, Class names: %d', 
                        len(predictions), len(self.class_names))
            raise ValueError(
                f"Model mengeluarkan {len(predictions)} prediksi, "
                f"tapi ada {len(self.class_names)} kelas di class_names.json. "
                f"Pastikan class_names.json sesuai dengan model!"
            )

        # Top 5 prediksi (atau kurang jika kelas < 5)
        max_top = min(5, len(self.class_names))
        top5_idx = np.argsort(predictions)[::-1][:max_top]
        top5     = [
            PrediksiMobil(
                merek_model=self.class_names[int(i)],
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
