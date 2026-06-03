import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).parent
MODELS_DIR = BASE_DIR / 'models'
UPLOADS_DIR = BASE_DIR / 'uploads'

# Create directories if not exist
MODELS_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

# Model settings
MODEL_PATH = MODELS_DIR / 'car_model.h5'
MODEL_INPUT_SIZE = (224, 224)
MODEL_FRAMEWORK = 'tensorflow'  # atau 'pytorch'

# API settings
API_HOST = 'localhost'
API_PORT = 5000
API_DEBUG = True

# File upload settings
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

# Car classes
CAR_CLASSES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']

# CORS settings
CORS_ORIGINS = [
    'http://localhost:5173',  # Vite dev server
    'http://localhost:3000',  # Alternative port
    'http://localhost:5000',  # Same origin
    'http://127.0.0.1:5173',
]
