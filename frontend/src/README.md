cd C:\CarScan\CarScan\backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8001# Frontend - Car Classification React App

Clean, modern React UI untuk car type classification.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure API URL
Create `.env.local` file:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start Dev Server
```bash
npm run dev
```
Open `http://localhost:5173`

### 4. Build untuk Production
```bash
npm run build
```

## Folder Structure

```
src/
├── components/           # Reusable React components
│   ├── Header.jsx       # App header
│   ├── ImageUpload.jsx  # Image upload with drag-drop
│   ├── LoadingSpinner.jsx
│   └── PredictionResult.jsx  # Results display
├── hooks/               # Custom React hooks
│   └── useImageUpload.js
├── services/            # API calls
│   └── carClassificationApi.js
├── utils/               # Helper functions
├── App.jsx              # Main component
├── index.css            # Tailwind CSS
└── main.jsx             # Entry point
```

## Components Overview

### Header
Menampilkan app title dan navigation

### ImageUpload
- Drag & drop support
- File browser button
- File validation (type & size)
- Image preview

### LoadingSpinner
Loading indicator saat classify

### PredictionResult
- Main prediction display
- All predictions dengan progress bars
- "Classify another" button

## Custom Hooks

### useImageUpload
Manage image upload state:
- `image`: File object
- `preview`: Data URL preview
- `isDragActive`: Drag state
- `handleFile()`: Process file
- `handleDrag()`: Drag handlers
- `handleDrop()`: Drop handler
- `reset()`: Clear state

## API Integration

File `src/services/carClassificationApi.js` provide methods:

```javascript
// Classify image
const result = await carClassificationApi.classifyImage(file);
// Returns: { class, confidence, allClasses }

// Get supported classes
const classes = await carClassificationApi.getSupportedClasses();

// Get model info
const info = await carClassificationApi.getModelInfo();
```

## Styling

Menggunakan **Tailwind CSS** untuk styling yang clean:
- Responsive design
- Consistent spacing & colors
- Dark mode ready (bisa add nanti)

## Environment Variables

Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Development defaults ke `http://localhost:5000/api`

## Production Build

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

Output ada di `dist/` folder - siap deploy ke Netlify, Vercel, atau server lain.

## Customization

### Change Car Classes
Edit `backend/config.py`:
```python
CAR_CLASSES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup', 'Motorcycle']
```

### Change UI Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#your-color',
}
```

### Add More Features
- Dark mode toggle
- History of classifications
- Export results as PDF
- Real-time camera capture
- Batch classification

## Deployment

### Frontend
```bash
# Deploy to Vercel
npm install -g vercel
vercel

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Backend
See `backend/README.md` untuk deployment instructions
