# File: ml-agents/image-quality-checker/check_quality.py

import cv2
import numpy as np

def check_resolution(img, min_width=800, min_height=600):
    h, w = img.shape[:2]
    return w >= min_width and h >= min_height

def check_brightness(img, threshold=100):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean_brightness = np.mean(gray)
    return mean_brightness >= threshold

def check_blur(img, threshold=100.0):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    variance = cv2.Laplacian(gray, cv2.CV_64F).var()
    return variance >= threshold

def check_image_quality(image_path):
    img = cv2.imread(image_path)
    if img is None:
        return {'error': 'Image not found'}

    resolution_ok = check_resolution(img)
    brightness_ok = check_brightness(img)
    sharpness_ok = check_blur(img)

    return {
        'resolution_ok': bool(resolution_ok),
        'brightness_ok': bool(brightness_ok),
        'sharpness_ok': bool(sharpness_ok)
    }
