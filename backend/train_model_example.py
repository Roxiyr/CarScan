"""
Example script untuk train car classification model dengan TensorFlow

Ini adalah template - Anda perlu:
1. Download dataset (Stanford Cars, CompCars, atau custom)
2. Organize dataset ke folder structure:
   data/
   ├── train/
   │   ├── SUV/
   │   ├── Sedan/
   │   ├── Hatchback/
   │   ├── MPV/
   │   └── Pickup/
   └── validation/
       ├── SUV/
       ├── Sedan/
       ├── Hatchback/
       ├── MPV/
       └── Pickup/
3. Run script ini untuk train model
"""

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os

# Configuration
IMG_HEIGHT = 224
IMG_WIDTH = 224
BATCH_SIZE = 32
EPOCHS = 20
CAR_CLASSES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']
DATASET_PATH = 'data/'
OUTPUT_MODEL_PATH = 'models/car_model.h5'

def create_model():
    """
    Create model menggunakan transfer learning dengan EfficientNetB0
    
    Transfer learning lebih cepat dan akurat dibanding train dari scratch
    """
    # Load pre-trained EfficientNetB0
    base_model = tf.keras.applications.EfficientNetB0(
        input_shape=(IMG_HEIGHT, IMG_WIDTH, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers (fine-tuning)
    base_model.trainable = False
    
    # Add custom layers
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.2),
        layers.Dense(len(CAR_CLASSES), activation='softmax')
    ])
    
    return model, base_model

def load_data():
    """Load dan preprocess dataset menggunakan ImageDataGenerator"""
    
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    train_generator = train_datagen.flow_from_directory(
        os.path.join(DATASET_PATH, 'train'),
        target_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    validation_generator = val_datagen.flow_from_directory(
        os.path.join(DATASET_PATH, 'validation'),
        target_size=(IMG_HEIGHT, IMG_WIDTH),
        batch_size=BATCH_SIZE,
        class_mode='categorical'
    )
    
    return train_generator, validation_generator

def train_model():
    """Main training function"""
    
    print("Creating model...")
    model, base_model = create_model()
    
    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.TopKCategoricalAccuracy(k=2, name='top_2_accuracy')]
    )
    
    print("Loading data...")
    train_gen, val_gen = load_data()
    
    print("Training model...")
    history = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=EPOCHS,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=1e-7
            )
        ]
    )
    
    # Unfreeze base model layers untuk fine-tuning
    print("Fine-tuning base model...")
    base_model.trainable = True
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=10,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=3,
                restore_best_weights=True
            )
        ]
    )
    
    print(f"Saving model to {OUTPUT_MODEL_PATH}...")
    model.save(OUTPUT_MODEL_PATH)
    
    print("Training complete!")
    return model, history

if __name__ == '__main__':
    try:
        model, history = train_model()
        print("Model trained successfully!")
        print(f"Model saved to: {OUTPUT_MODEL_PATH}")
    except Exception as e:
        print(f"Error during training: {e}")
        print("\nMake sure:")
        print(f"1. Dataset folder exists at: {DATASET_PATH}")
        print("2. Folder structure is correct (train/validation subdirectories)")
        print("3. Car class folders exist: " + ", ".join(CAR_CLASSES))
