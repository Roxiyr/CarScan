"""
Car Classification Model

Template untuk implement model classifier Anda.
Support format:
- TensorFlow/Keras
- PyTorch  
- ONNX
"""

import numpy as np
from PIL import Image
import os

class CarClassifier:
    """
    Car Classifier Model
    
    Gunakan TensorFlow, PyTorch, atau library lain untuk implement model sebenarnya.
    
    Example dengan TensorFlow:
    ```python
    import tensorflow as tf
    
    class CarClassifier:
        def __init__(self, model_path):
            self.model = tf.keras.models.load_model(model_path)
            self.classes = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']
        
        def predict(self, image_array):
            predictions = self.model.predict(np.expand_dims(image_array, 0))[0]
            predicted_class_idx = np.argmax(predictions)
            predicted_class = self.classes[predicted_class_idx]
            confidence = float(predictions[predicted_class_idx])
            
            all_classes = {
                self.classes[i]: float(predictions[i]) 
                for i in range(len(self.classes))
            }
            
            return {
                'class': predicted_class,
                'confidence': confidence,
                'allClasses': all_classes
            }
    ```
    """
    
    def __init__(self, model_path='models/car_model.h5'):
        """
        Initialize model
        
        Args:
            model_path: Path ke saved model
        """
        # TODO: Load model dari file
        # self.model = load_model(model_path)
        self.classes = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']
        self.model = None
    
    def preprocess_image(self, image_array):
        """
        Preprocess image untuk model
        
        Args:
            image_array: numpy array of image (224x224x3, normalized 0-1)
        
        Returns:
            Preprocessed image array
        """
        # TODO: Add preprocessing steps sesuai model requirements
        return image_array
    
    def predict(self, image_array):
        """
        Predict car class dari image
        
        Args:
            image_array: numpy array of image (224x224x3, normalized 0-1)
        
        Returns:
            {
                'class': str,          # e.g. 'SUV'
                'confidence': float,   # 0.0-1.0
                'allClasses': dict     # {class_name: confidence}
            }
        """
        # TODO: Implement actual prediction logic
        # predictions = self.model.predict(...)
        # return format_predictions(predictions)
        pass
    
    def batch_predict(self, image_arrays):
        """
        Predict multiple images sekaligus
        
        Args:
            image_arrays: list of numpy arrays
        
        Returns:
            list of predictions
        """
        results = []
        for img_array in image_arrays:
            results.append(self.predict(img_array))
        return results
