# Backend API 🚗

Backend ini berisi FastAPI service untuk klasifikasi mobil menggunakan model TensorFlow.

## Struktur Project

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── predictor.py
│   └── schemas.py
├── models/
│   ├── car_model.h5
│   └── class_names.json
├── CarClassifier_Training.ipynb
├── requirements.txt
└── README.md
```

## Menjalankan API

1. Pasang dependency:
   ```bash
   pip install -r requirements.txt
   ```
2. Jalankan server dari folder `backend`:
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
   ```

   Jika Anda ingin menjalankan dari root workspace, gunakan:
   ```bash
   python -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8001
   ```
3. Buka dokumentasi otomatis di:
   ```
   http://127.0.0.1:8001/docs
   ```

## Endpoint utama

- `POST /predict` untuk mengirim foto mobil dan mendapatkan prediksi.
- `GET /health` untuk cek status server dan model.
- `GET /classes` untuk daftar nama kelas mobil.

## Catatan

Letakkan model `car_model.h5` dan label `class_names.json` di folder `models/`.
