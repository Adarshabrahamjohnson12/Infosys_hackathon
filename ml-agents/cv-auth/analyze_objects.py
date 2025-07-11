import torch
import os

# Load YOLOv5s model from Ultralytics (COCO-pretrained)
model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Define expected objects for a real homestay photo
EXPECTED_OBJECTS = {
    "bed", "chair", "sofa", "tv", "dining table", "refrigerator", "sink", "potted plant"
}

def analyze_stay_image_yolo(image_path):
    try:
        # Run inference
        results = model(image_path)
        labels = results.pandas().xyxy[0]['name'].tolist()

        # Find which expected objects are detected
        found_objects = set(labels)
        intersection = EXPECTED_OBJECTS.intersection(found_objects)

        score = len(intersection) / len(EXPECTED_OBJECTS)
        status = "Valid" if score >= 0.3 else "Suspicious"

        return {
            "status": status,
            "found_objects": list(found_objects),
            "expected_matches": list(intersection),
            "confidence_score": round(score, 2)
        }

    except Exception as e:
        return {
            "status": "Error",
            "error": str(e)
        }

# ✅ Standalone test
if __name__ == "__main__":
    image_path = r"D:\Infosys_hackathon\Infosys_hackathon\ml-agents\sample_ids\stay1.jpg"
    print("Testing with:", image_path)
    result = analyze_stay_image_yolo(image_path)
    print(result)

