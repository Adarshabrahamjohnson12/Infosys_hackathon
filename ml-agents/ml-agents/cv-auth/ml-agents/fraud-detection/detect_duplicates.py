# File: ml-agents/fraud-detection/detect_duplicates.py

from PIL import Image
import imagehash
import os

# Example: keep a folder with known host images
KNOWN_IMAGES_DIR = 'ml-agents/fraud-detection/dummy_images/'

def get_image_hash(image_path):
    img = Image.open(image_path)
    return imagehash.average_hash(img)

def is_duplicate(new_image_path):
    new_hash = get_image_hash(new_image_path)

    for filename in os.listdir(KNOWN_IMAGES_DIR):
        existing_hash = get_image_hash(os.path.join(KNOWN_IMAGES_DIR, filename))
        # Hamming distance threshold
        if new_hash - existing_hash < 5:
            return True

    return False
