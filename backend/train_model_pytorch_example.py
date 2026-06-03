"""
Example dengan PyTorch untuk car classification

Alternative ke TensorFlow jika Anda lebih prefer PyTorch
"""

import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from torch.utils.data import DataLoader, ImageFolder
import os

# Configuration
IMG_HEIGHT = 224
IMG_WIDTH = 224
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 1e-4
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
CAR_CLASSES = ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup']
DATASET_PATH = 'data/'
OUTPUT_MODEL_PATH = 'models/car_model.pt'

def create_model():
    """Create ResNet50 model untuk car classification"""
    model = models.resnet50(pretrained=True)
    
    # Freeze base model
    for param in model.parameters():
        param.requires_grad = False
    
    # Replace final layer
    num_features = model.fc.in_features
    model.fc = nn.Sequential(
        nn.Linear(num_features, 256),
        nn.ReLU(),
        nn.Dropout(0.3),
        nn.Linear(256, 128),
        nn.ReLU(),
        nn.Dropout(0.2),
        nn.Linear(128, len(CAR_CLASSES))
    )
    
    return model

def train_epoch(model, train_loader, criterion, optimizer):
    """Train one epoch"""
    model.train()
    total_loss = 0
    correct = 0
    total = 0
    
    for images, labels in train_loader:
        images = images.to(DEVICE)
        labels = labels.to(DEVICE)
        
        # Forward
        outputs = model(images)
        loss = criterion(outputs, labels)
        
        # Backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        
        # Stats
        total_loss += loss.item()
        _, predicted = outputs.max(1)
        total += labels.size(0)
        correct += predicted.eq(labels).sum().item()
    
    accuracy = 100 * correct / total
    return total_loss / len(train_loader), accuracy

def validate(model, val_loader, criterion):
    """Validate model"""
    model.eval()
    total_loss = 0
    correct = 0
    total = 0
    
    with torch.no_grad():
        for images, labels in val_loader:
            images = images.to(DEVICE)
            labels = labels.to(DEVICE)
            
            outputs = model(images)
            loss = criterion(outputs, labels)
            
            total_loss += loss.item()
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += predicted.eq(labels).sum().item()
    
    accuracy = 100 * correct / total
    return total_loss / len(val_loader), accuracy

def main():
    """Main training function"""
    
    print(f"Using device: {DEVICE}")
    
    # Data transforms
    train_transform = transforms.Compose([
        transforms.RandomResizedCrop(IMG_HEIGHT),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(20),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    val_transform = transforms.Compose([
        transforms.Resize((IMG_HEIGHT, IMG_WIDTH)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Load datasets
    train_dataset = ImageFolder(os.path.join(DATASET_PATH, 'train'), transform=train_transform)
    val_dataset = ImageFolder(os.path.join(DATASET_PATH, 'validation'), transform=val_transform)
    
    train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
    val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)
    
    # Create model
    print("Creating model...")
    model = create_model().to(DEVICE)
    
    # Loss dan optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=LEARNING_RATE)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, 'min', factor=0.5, patience=3)
    
    # Training loop
    best_val_acc = 0
    for epoch in range(EPOCHS):
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer)
        val_loss, val_acc = validate(model, val_loader, criterion)
        scheduler.step(val_loss)
        
        print(f"Epoch {epoch+1}/{EPOCHS}")
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.2f}%")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.2f}%")
        
        if val_acc > best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), OUTPUT_MODEL_PATH)
            print(f"Model saved! Best Val Acc: {best_val_acc:.2f}%")
    
    print(f"\nTraining complete! Model saved to: {OUTPUT_MODEL_PATH}")

if __name__ == '__main__':
    main()
