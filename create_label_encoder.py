#!/usr/bin/env python3
"""
Script untuk membuat label_encoder.pkl dari daftar class names.
Jalankan: python create_label_encoder.py
"""

import pickle
import json
from sklearn.preprocessing import LabelEncoder
import os

import os

models_dir = os.path.join(os.path.dirname(__file__), 'backend', 'models')
json_path = os.path.join(models_dir, 'class_names.json')

if os.path.exists(json_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        class_names = json.load(f)
    print(f"✅ Membaca {len(class_names)} kelas dari class_names.json")
else:
    # Default kelas jika JSON tidak ada
    class_names = [
        "Toyota Avanza",
        "Toyota Yaris",
        "Honda Jazz",
        "Honda CR-V",
        "Daihatsu Xenia",
        "Mitsubishi Xpander",
        "Suzuki Ertiga",
        "Wuling Cortez",
        "Hyundai H-1",
        "Isuzu Panther"
    ]
    print(f"⚠️  JSON tidak ditemukan, menggunakan {len(class_names)} kelas default")

# Buat label encoder
le = LabelEncoder()
le.fit(class_names)

# Simpan ke pkl
pkl_path = os.path.join(models_dir, 'label_encoder.pkl')
os.makedirs(models_dir, exist_ok=True)

with open(pkl_path, 'wb') as f:
    pickle.dump(le, f)

print(f"✅ Label encoder berhasil dibuat: {pkl_path}")
print(f"   Classes: {list(le.classes_)}")
