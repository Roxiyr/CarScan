from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from PIL import Image
import numpy as np
import io

# Import model (akan kita buat nanti)
# from models.car_classifier import CarClassifier

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Car classes yang akan di-classify
CAR_CLASSES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']

# Placeholder untuk model - akan diganti dengan model sebenarnya
class DummyClassifier:
    """Placeholder classifier - ganti dengan model TensorFlow/PyTorch Anda"""
    def predict(self, image_array):
        # Return dummy prediction
        # TODO: Replace dengan actual model
        import random
        confidences = np.random.dirichlet(np.ones(len(CAR_CLASSES)))
        predicted_class = CAR_CLASSES[np.argmax(confidences)]
        predicted_confidence = float(np.max(confidences))
        
        all_classes = {car_class: float(conf) for car_class, conf in zip(CAR_CLASSES, confidences)}
        
        return {
            'class': predicted_class,
            'confidence': predicted_confidence,
            'allClasses': all_classes
        }

classifier = DummyClassifier()

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_image(image_file):
    """Process uploaded image to array"""
    try:
        img = Image.open(io.BytesIO(image_file.read()))
        img = img.convert('RGB')
        img = img.resize((224, 224))
        img_array = np.array(img) / 255.0
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

@app.route('/api/classify', methods=['POST'])
def classify_image():
    """Main endpoint untuk classify car image"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image provided'}), 400
        
        image_file = request.files['image']
        
        if image_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if not allowed_file(image_file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        # Process image
        img_array = process_image(image_file)
        
        # Make prediction
        prediction = classifier.predict(img_array)
        
        return jsonify(prediction), 200
    
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Get list of supported car classes"""
    return jsonify({'classes': CAR_CLASSES}), 200

@app.route('/api/model-info', methods=['GET'])
def get_model_info():
    """Get model information"""
    return jsonify({
        'model': 'Car Classifier v1.0',
        'accuracy': 0.0,  # TODO: Update dengan actual accuracy
        'version': '1.0.0',
        'classes': CAR_CLASSES
    }), 200

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
