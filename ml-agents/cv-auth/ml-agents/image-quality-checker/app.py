# File: ml-agents/image-quality-checker/app.py

from flask import Flask, request, jsonify
from check_quality import check_image_quality
import os

app = Flask(__name__)

# Create upload folder if not exists
UPLOAD_FOLDER = 'ml-agents/image-quality-checker/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "✅ Flask Image Quality Checker running! Use POST on /image-quality."

@app.route('/image-quality', methods=['GET', 'POST'])
def image_quality():
    if request.method == 'GET':
        return "✅ Flask running! Use POST to check image quality."

    if 'image' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, 'temp_upload.jpg')
    file.save(filepath)

    result = check_image_quality(filepath)
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, port=5003)
