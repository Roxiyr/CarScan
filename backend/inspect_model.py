import os
import sys
import pickle

sys.path.insert(0, os.getcwd())
from app.predictor import get_predictor

p = get_predictor()
p._load_model()
print('model_output_dim', p.model.output_shape[-1])
print('model_path', p.model_path)
print('class_names_path', p.class_names_path)
print('class_names', p.class_names)
print('label_encoder_path', p.label_encoder_path)
print('exists_label_encoder', os.path.exists(p.label_encoder_path))
print('exists_class_json', os.path.exists(p.class_names_path))
if os.path.exists(p.class_names_path):
    with open(p.class_names_path, encoding='utf-8') as f:
        print('json_content', f.read())
if os.path.exists(p.label_encoder_path):
    with open(p.label_encoder_path, 'rb') as f:
        le = pickle.load(f)
    print('label_encoder_classes', list(le.classes_))
