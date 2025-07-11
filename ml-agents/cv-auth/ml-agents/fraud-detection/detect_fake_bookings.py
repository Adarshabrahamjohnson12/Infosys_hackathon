# File: ml-agents/fraud-detection/detect_fake_bookings.py

import json

with open('ml-agents/fraud-detection/dummy_bookings.json') as f:
    bookings = json.load(f)

def is_fraudulent(new_booking):
    suspicious = []
    for booking in bookings:
        if booking['ip'] == new_booking['ip'] and booking['user_id'] != new_booking['user_id']:
            suspicious.append(booking)
    if len(suspicious) >= 1:
        return True
    return False
