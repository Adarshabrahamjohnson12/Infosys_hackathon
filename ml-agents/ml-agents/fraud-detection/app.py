# File: ml-agents/fraud-detection/app.py

from flask import Flask, request, jsonify
from detect_duplicates import is_duplicate
from detect_fake_bookings import is_fraudulent

app = Flask(__name__)

@app.route('/fraud-check/image', methods=['POST'])
def check_image():
    # Save uploaded image to temp
    file = request.files['image']
    filepath = 'ml-agents/fraud-detection/temp_upload.jpg'
    file.save(filepath)

    duplicate = is_duplicate(filepath)
    return jsonify({
        'status': 'success',
        'is_duplicate': duplicate
    })

@app.route('/fraud-check/booking', methods=['POST'])
def check_booking():
    new_booking = request.json  # Must have ip, user_id etc.
    fraud = is_fraudulent(new_booking)
    return jsonify({
        'status': 'success',
        'is_fraudulent': fraud
    })

if __name__ == '__main__':
    app.run(debug=True, port=5002)
