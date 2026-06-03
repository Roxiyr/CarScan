# CarScan - Car Classification AI

Complete React + Python ML application untuk classify car types dari image.

```
┌─────────────────────────────────────────────────────┐
│          React Frontend (Port 5173)                 │
│  - Upload image via drag & drop                     │
│  - Real-time preview                               │
│  - Beautiful result display                        │
└──────────────────┬──────────────────────────────────┘
                   │ (HTTP POST with image)
                   │
┌──────────────────▼──────────────────────────────────┐
│          Flask Backend (Port 5000)                  │
│  - Image preprocessing                             │
│  - Model inference                                 │
│  - Return predictions                              │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│       ML Model (TensorFlow/PyTorch)                 │
│  - Pre-trained CNN model                           │
│  - Classify into 5 car types                       │
└─────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Start Backend (Terminal 1)
```bash
cd backend
python app.py
```
Server runs at `http://localhost:5000`

### 2. Start Frontend (Terminal 2)
```bash
npm run dev
```
App opens at `http://localhost:5173`

### 3. Upload Car Image
- Drag & drop atau browse file
- Wait untuk classification
- See results dengan confidence score

## Architecture

### Frontend (React + Vite)
- **UI Library**: Tailwind CSS (clean, responsive)
- **HTTP Client**: Axios
- **Image Upload**: Drag & drop, file browser
- **State Management**: React hooks
- **Build Tool**: Vite (fast, modern)

### Backend (Flask)
- **Framework**: Flask + CORS
- **Model Framework**: TensorFlow / PyTorch (pilih satu)
- **Image Processing**: Pillow, NumPy
- **API**: RESTful endpoints

### Model Layer
- **Input**: 224x224 RGB images
- **Output**: Car class + confidence scores
- **Classes**: SUV, Sedan, Hatchback, MPV, Pickup

## Project Structure

```
CarScan/
├── src/                          # React Frontend
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── PredictionResult.jsx
│   │   └── LoadingSpinner.jsx
│   ├── services/
│   │   └── carClassificationApi.js
│   ├── hooks/
│   │   └── useImageUpload.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── README.md
├── backend/                      # Flask Backend
│   ├── app.py                   # Main Flask app
│   ├── config.py                # Configuration
│   ├── requirements.txt          # Dependencies
│   ├── models/
│   │   ├── car_classifier.py    # Model wrapper
│   │   └── car_model.h5         # Trained model (add this)
│   ├── uploads/                 # Temp uploaded images
│   └── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── .env.local
```

## Setup Instructions

### Frontend Setup
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Create virtual environment (recommended)
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Uncomment ML framework di requirements.txt
# - TensorFlow (recommended)
# - PyTorch
# - ONNX Runtime

# Add your trained model ke backend/models/car_model.h5 (atau .pt untuk PyTorch)

# Run Flask server
python backend/app.py
```

## Environment Variables

Create `.env.local` di root:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## What You Need to Add

### 1. Trained Model
Save model ke `backend/models/car_model.h5` (TensorFlow) atau `car_model.pt` (PyTorch)

Options:
- **Train your own**: Use Stanford Cars dataset atau custom dataset
- **Transfer learning**: Fine-tune pre-trained model (EfficientNet, ResNet50, etc)
- **Download pre-trained**: Dari TensorFlow Hub, PyTorch Hub, atau Hugging Face

### 2. Update Model Wrapper
Edit `backend/models/car_classifier.py`:
- Load your model
- Preprocess image sesuai model requirements
- Return predictions dalam format yang benar

### 3. Update Backend Config
Edit `backend/config.py` jika perlu:
- Model path
- Input size
- Car classes
- Framework type

## API Endpoints

### POST /api/classify
Classify car image

**Request:**
```bash
curl -X POST -F "image=@car.jpg" http://localhost:5000/api/classify
```

**Response:**
```json
{
  "class": "SUV",
  "confidence": 0.947,
  "allClasses": {
    "SUV": 0.947,
    "Sedan": 0.80,
    "Hatchback": 0.12,
    "MPV": 0.05,
    "Pickup": 0.02
  }
}
```

### GET /api/classes
Get supported car classes

### GET /api/model-info
Get model information

### GET /api/health
Health check

## Features

✅ Drag & drop image upload
✅ Real-time preview
✅ Clean, responsive UI
✅ Confidence scores
✅ All classes predictions
✅ Error handling
✅ Loading states
✅ CORS enabled

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Frontend: Fast with Vite + React
- Backend: Inference time depends on model (usually 0.5-2 seconds)
- Total round-trip: ~1-3 seconds dengan network latency

## Next Steps

1. **Get a model** (train or download)
2. **Put model** di `backend/models/`
3. **Update car_classifier.py** untuk load & use model
4. **Test di browser** dengan upload image
5. **Deploy** ke production

## Resources

- [Stanford Cars Dataset](https://ai.stanford.edu/~jkrause/cars/)
- [TensorFlow Hub](https://tfhub.dev/)
- [PyTorch Models](https://pytorch.org/vision/stable/models.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Flask Docs](https://flask.palletsprojects.com/)

## Troubleshooting

### "Cannot connect to backend"
- Check backend running: `python backend/app.py`
- Check port 5000 available
- Check `.env.local` API URL correct

### "Model not found"
- Ensure model file exists: `backend/models/car_model.h5`
- Update `MODEL_PATH` di config.py jika berbeda

### "CORS error"
- Check CORS enabled di app.py
- Update CORS_ORIGINS di config.py

### Slow predictions
- Model too large? Try quantization atau pruning
- Check API logs untuk bottleneck

## License

MIT

## Support

For issues, check:
1. Backend logs: `python backend/app.py`
2. Browser console: F12 → Console tab
3. API health: `curl http://localhost:5000/api/health`

---

Happy classifying! 🚗✨

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
