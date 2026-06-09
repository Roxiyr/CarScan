# QUICK START GUIDE

Panduan cepat untuk jalankan CarScan app.

## 1. Setup Backend (First Time)

```bash
# Buka terminal 1
cd c:\CarScan\CarScan\backend

# Create virtual environment (recommended)
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# PENTING: Edit requirements.txt dan uncomment salah satu:
# Uncomment: tensorflow==2.13.0  (recommended untuk CNN car classification)
# Atau: torch==2.0.0 + torchvision==0.15.0 (alternative)

pip install tensorflow==2.13.0

# Download/prepare model
# - Option 1: Train sendiri pakai train_model_example.py
# - Option 2: Download pre-trained model dari TensorFlow Hub/PyTorch Hub
# Hasil model save ke: backend/models/car_model.h5

# Update backend/models/car_classifier.py untuk load model Anda
```

## 2. Setup Frontend (First Time)

```bash
# Terminal 2 (beda window)
cd c:\CarScan\CarScan

npm install

# Sudah di-install:
# - react-dropzone (drag & drop)
# - axios (API calls)
# - tailwindcss (styling)
```

## 3. Setup Environment Variable

Create `.env.local` di root project (sudah dibuat):
```env
VITE_API_URL=http://localhost:8001
```

## 4. Run Application

### Terminal 1 - Backend
```bash
cd c:\CarScan\CarScan\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```
✅ Backend running at: http://localhost:8001

### Terminal 2 - Frontend
```bash
cd c:\CarScan\CarScan
npm run dev
```
✅ Frontend running at: http://localhost:5173

## 5. Test Application

1. Open browser ke http://localhost:5173
2. Upload car image
3. Lihat prediction result

## File Structure Quick Reference

```
c:\CarScan\CarScan\
├── src/                              # React components
│   ├── App.jsx                       # Main app
│   ├── index.css                     # Tailwind CSS
│   ├── components/
│   │   ├── ImageUpload.jsx          # Upload component
│   │   ├── PredictionResult.jsx     # Results
│   │   └── ...
│   ├── services/
│   │   └── carClassificationApi.js  # API calls
│   └── hooks/
│       └── useImageUpload.js        # Upload logic
├── backend/
│   ├── app.py                        # Flask API
│   ├── config.py                     # Settings
│   ├── requirements.txt              # Dependencies
│   ├── models/
│   │   ├── car_classifier.py        # Model wrapper
│   │   └── car_model.h5             # YOUR MODEL (tambahkan)
│   ├── train_model_example.py       # TensorFlow training
│   └── uploads/                      # Temp files
├── package.json
├── vite.config.js
├── tailwind.config.js
└── .env.local                        # Environment variables
```

## Next Steps - Get a Model

### Option A: Transfer Learning (RECOMMENDED)
```bash
cd backend
python train_model_example.py
```
Butuh dataset di `data/train/` dan `data/validation/`

### Option B: Download Pre-trained Model
```python
import tensorflow_hub as hub
import tensorflow as tf

# Download dari TensorFlow Hub
model_url = 'https://tfhub.dev/google/efficientnet/b0/feature-vector/1'
model = hub.load(model_url)
# ... add custom layers dan save
```

### Option C: Use Hugging Face Models
```bash
pip install transformers
# Download vision models dari huggingface
```

## Troubleshooting

### Error: "Cannot connect to backend"
- Check backend running: `python backend/app.py`
- Check port 5000 available: `netstat -ano | findstr :5000`
- Check CORS di `.env.local`

### Error: "Model not found"
- Ensure file exists: `backend/models/car_model.h5`
- Update path di `backend/models/car_classifier.py`

### Slow predictions
- Check model size (too large?)
- Check GPU support: `python -c "import tensorflow as tf; print(tf.config.list_physical_devices('GPU'))"`

### CORS Error di browser
- Backend harus running
- Check `REACT_APP_API_URL` di `.env.local`
- Update CORS_ORIGINS di `backend/config.py`

## Commands Reference

```bash
# Frontend
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Check code

# Backend
python app.py       # Start Flask server
python -m pip install -r requirements.txt  # Install deps

# Git (optional)
git add .
git commit -m "Initial setup"
```

## Performance Tips

1. **Model Optimization**
   - Use quantization untuk smaller model size
   - Use pruning untuk faster inference
   - Use TensorFlow Lite untuk mobile

2. **API Performance**
   - Add caching untuk repeat classifications
   - Use batch processing jika banyak images

3. **Frontend Performance**
   - Already optimized dengan Vite
   - Use React.memo untuk components

## Documentation

- Frontend: `src/README.md`
- Backend: `backend/README.md`
- Full: `README.md`

---

**DONE!** 🎉

Tinggal:
1. Get/train model
2. Run backend + frontend
3. Upload car image
4. See magic happen ✨

Sukses! 🚗
