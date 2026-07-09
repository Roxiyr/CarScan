#!/usr/bin/env python3
"""
Ekspor model Keras ke TensorFlow.js untuk frontend,
dan buat metadata (class names, img_size) yang dipakai backend & frontend.

Jalankan dari root project:
    python export_model.py
"""

import json
import os
import pickle
import sys

import tensorflow as tf

MODELS_DIR = os.path.join(os.path.dirname(__file__), "backend", "models")
FRONTEND_PUBLIC = os.path.join(os.path.dirname(__file__), "frontend", "public")
TFJS_DIR = os.path.join(FRONTEND_PUBLIC, "tfjs_model")


def _find_file(base: str, ext: str) -> str:
    for name in os.listdir(base):
        if name.endswith(ext):
            return os.path.join(base, name)
    raise FileNotFoundError(f"Tidak ada file {ext} di folder: {base}")


def load_class_names(models_dir: str, num_classes: int) -> list[str]:
    """Muat daftar kelas dari class_names.json atau label_encoder.pkl."""
    json_path = os.path.join(models_dir, "class_names.json")
    pkl_path = os.path.join(models_dir, "label_encoder.pkl")

    if os.path.exists(json_path):
        with open(json_path, encoding="utf-8") as f:
            names = json.load(f)
        print(f"OK Membaca {len(names)} kelas dari class_names.json")
    elif os.path.exists(pkl_path):
        with open(pkl_path, "rb") as f:
            le = pickle.load(f)
        names = list(le.classes_)
        print(f"OK Membaca {len(names)} kelas dari label_encoder.pkl")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(names, f, indent=2, ensure_ascii=False)
        print(f"OK class_names.json dibuat: {json_path}")
    else:
        raise FileNotFoundError(
            "Tidak ada class_names.json atau label_encoder.pkl di backend/models/"
        )

    if len(names) != num_classes:
        print(
            f"\nPERINGATAN: Model punya {num_classes} kelas, "
            f"tapi file label punya {len(names)} kelas."
        )
        print(
            "   Salin class_names.json dari hasil training (Colab) ke backend/models/"
        )
        print("   lalu jalankan ulang: python export_model.py\n")

    return names


def export_tfjs(model_path: str, output_dir: str) -> None:
    try:
        import tensorflowjs as tfjs
    except ImportError:
        print("ERROR: tensorflowjs belum terinstall. Jalankan: pip install tensorflowjs")
        sys.exit(1)

    os.makedirs(output_dir, exist_ok=True)
    print(f"Konversi model ke TensorFlow.js -> {output_dir}")
    tfjs.converters.save_keras_model(
        tf.keras.models.load_model(model_path),
        output_dir,
    )
    print("OK Model TensorFlow.js berhasil diekspor")


def export_metadata(class_names: list[str], img_size: tuple[int, int]) -> None:
    os.makedirs(FRONTEND_PUBLIC, exist_ok=True)

    idx_to_class = {str(i): name for i, name in enumerate(class_names)}
    class_to_idx = {name: i for i, name in enumerate(class_names)}

    config = {
        "num_classes": len(class_names),
        "img_size": list(img_size),
        "class_names": class_names,
        "class_to_idx": class_to_idx,
        "idx_to_class": idx_to_class,
    }

    frontend_path = os.path.join(FRONTEND_PUBLIC, "model_config.json")
    backend_path = os.path.join(MODELS_DIR, "model_config.json")

    with open(frontend_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    with open(backend_path, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)

    print(f"OK Metadata frontend: {frontend_path}")
    print(f"OK Metadata backend:  {backend_path}")


def main() -> None:
    model_path = _find_file(MODELS_DIR, ".keras")
    print(f"Model: {model_path}")

    model = tf.keras.models.load_model(model_path)
    _, height, width, _ = model.input_shape
    img_size = (int(height), int(width))
    num_classes = int(model.output_shape[-1])
    print(f"Input size: {img_size}")
    print(f"Output classes: {num_classes}")

    class_names = load_class_names(MODELS_DIR, num_classes)
    export_metadata(class_names, img_size)
    export_tfjs(model_path, TFJS_DIR)

    print("\nSelesai! Model siap dipakai di:")
    print("   Backend  -> backend/models/*.keras + class_names.json")
    print("   Frontend -> frontend/public/tfjs_model/ + model_config.json")


if __name__ == "__main__":
    main()
