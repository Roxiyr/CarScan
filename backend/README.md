# Car Classification Backend

Backend API untuk car type classification menggunakan ML model.

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Uncomment Framework Pilihan
Edit `requirements.txt` dan uncomment salah satu:
- **TensorFlow** (recommended): Mudah, punya banyak pre-trained models
- **PyTorch**: Flexible, industry-standard untuk research
- **ONNX**: Lightweight, cross-platform

### 3. Add Your Model
1. Train model atau download pre-trained model
2. Save ke `models/car_model.h5` (TensorFlow) atau `models/car_model.pt` (PyTorch)
3. Update `models/car_classifier.py` untuk load dan use model

### 4. Run API
```bash
python app.py
```
Server akan run di `http://localhost:5000`

## Recommended Models untuk Car Classification

### 1. **EfficientNet** (TensorFlow)
```python
import tensorflow_hub as hub
model = hub.load('https://tfhub.dev/google/efficientnet/b0/feature-vector/1')
```

### 2. **ResNet50** (PyTorch)
```python
import torchvision.models as models
model = models.resnet50(pretrained=True)
```

### 3. **MobileNetV2** (Lightweight)
```python
model = tf.keras.applications.MobileNetV2(weights='imagenet')
```

## API Endpoints

### POST /api/classify
Upload image untuk classify car type
```bash
curl -X POST -F "image=@car.jpg" http://localhost:5000/api/classify
```

Response:
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

## Project Structure

```
backend/
├── app.py                 # Flask API
├── requirements.txt       # Python dependencies
├── models/
│   ├── car_model.h5     # Your trained model (add this)
│   └── car_classifier.py # Model wrapper
└── uploads/              # Temp directory untuk uploaded images
```

## Training Your Own Model

### Option 1: Transfer Learning dengan TensorFlow
```python
import tensorflow as tf

# Load pre-trained model
base_model = tf.keras.applications.EfficientNetB0(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Add custom layers
model = tf.keras.Sequential([
    base_model,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(256, activation='relu'),
    tf.keras.layers.Dropout(0.2),
    tf.keras.layers.Dense(5, activation='softmax')  # 5 car classes
])

# Compile dan train
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(train_images, train_labels, epochs=10, validation_data=(val_images, val_labels))

# Save
model.save('models/car_model.h5')
```

### Option 2: PyTorch
```python
import torch
import torchvision.models as models
import torch.nn as nn

# Load pre-trained ResNet50
model = models.resnet50(pretrained=True)

# Modify final layer untuk 5 classes
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 5)

# Train...
torch.save(model.state_dict(), 'models/car_model.pt')
```

## Dataset Recommendations

- **Stanford Cars Dataset**: 16,185 images, 196 car types
- **CompCars Dataset**: 136,000+ images
- **COCO Dataset**: Include car annotations
- Atau collect custom dataset dari Google Images / Bing

Pastikan dataset ter-distribute ke 5 classes:
- SUV
- Sedan  
- Hatchback
- MPV
- Pickup

## Production Deployment

Untuk production, consider:
1. **Docker**: Containerize backend API
2. **Cloud**: Deploy ke AWS, Google Cloud, atau Azure
3. **Model Optimization**: Quantization, pruning untuk faster inference
4. **Monitoring**: Track API performance dan model accuracy
