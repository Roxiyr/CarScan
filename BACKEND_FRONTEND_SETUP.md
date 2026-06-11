# 🚗 CarScan - Full Stack Setup Guide

Panduan menjalankan backend dan frontend secara bersamaan.

## 📋 Persiapan

### Persyaratan
- Python 3.8+
- Node.js 16+ & npm
- Model di `backend/models/car_model.h5`
- Class names di `backend/models/class_names (1).json`

### Install Dependencies

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
npm install
```

---

## 🚀 Menjalankan Full Stack

### Opsi 1: Dua Terminal (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python run.py
# atau untuk Windows:
# run.bat (Command Prompt)
# .\run.ps1 (PowerShell)
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Frontend akan membuka di: **http://localhost:5173**  
Backend berjalan di: **http://localhost:8001**

---

### Opsi 2: PowerShell (Run Both)

**Backend + Frontend dalam satu folder:**
```powershell
# Terminal 1 - Backend
cd backend
python run.py

# Terminal 2 - Frontend (buka terminal baru)
npm run dev
```

---

## 🔍 Memverifikasi Koneksi

### Health Check Backend
```bash
# Di Terminal 3, cek backend:
curl http://localhost:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes_loaded": true,
  "jumlah_kelas": 5
}
```

### Test Upload Image
Buka http://localhost:5173 dan upload foto mobil untuk test prediksi.

---

## 📁 Struktur File

```
CarScan/
├── backend/
│   ├── run.py          ← Jalankan ini untuk backend
│   ├── run.bat         ← Windows Command Prompt
│   ├── run.ps1         ← Windows PowerShell
│   ├── app/
│   │   ├── main.py     ← FastAPI app
│   │   ├── predictor.py
│   │   └── schemas.py
│   └── models/
│       ├── car_model.h5
│       └── class_names (1).json
├── src/
│   ├── App.jsx
│   └── services/
│       └── carClassificationApi.js
├── vite.config.js      ← Frontend dev server & proxy
└── package.json
```

---

## 🔗 API Endpoints

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/predict` | POST | Upload foto & dapatkan prediksi |
| `/classes` | GET | Lihat semua kelas mobil |
| `/health` | GET | Cek status backend |

---

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'backend'"
✅ **Solved** - Gunakan `backend/run.py` bukan uvicorn dari root

### "ECONNREFUSED" di Frontend
- ✅ Pastikan backend berjalan: `python backend/run.py`
- ✅ Port 8001 tidak tertutup oleh program lain

### Model tidak loading
- ✅ Cek file ada di `backend/models/car_model.h5`
- ✅ Format model harus `.h5` (TensorFlow)
- ✅ Lihat log di terminal backend

---

## 📝 Notes

- Backend auto-reload ketika kode di-edit (Uvicorn)
- Frontend hot-reload otomatis (Vite)
- Proxy Vite mengarahkan `/predict` → backend port 8001
- Model load saat backend startup

---

Selamat menjalankan! 🎉
