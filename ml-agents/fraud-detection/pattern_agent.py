from datetime import datetime, timedelta
from collections import defaultdict

def detect_suspicious(booking_data, new_booking):
    suspicious_reasons = []

    user_id = new_booking["user_id"]
    host_id = new_booking["host_id"]
    payment_id = new_booking["payment_id"]
    created_at = datetime.strptime(new_booking["timestamp"], "%Y-%m-%d %H:%M:%S")

    # Check if same user booked same host within 1 minute
    for b in booking_data:
        if b["user_id"] == user_id and b["host_id"] == host_id:
            old_time = datetime.strptime(b["timestamp"], "%Y-%m-%d %H:%M:%S")
            if abs((created_at - old_time).total_seconds()) < 60:
                suspicious_reasons.append("Multiple bookings by same user for same host in under 60 seconds")

    # Check if same payment ID used under different user IDs
    user_ids_with_payment = {b["user_id"] for b in booking_data if b["payment_id"] == payment_id}
    if len(user_ids_with_payment) > 1:
        suspicious_reasons.append("Same payment method used across multiple user IDs")

    # Check if this host is new but has > 5 bookings in 2 minutes
    recent_bookings_for_host = [
        b for b in booking_data if b["host_id"] == host_id
        and abs((created_at - datetime.strptime(b["timestamp"], "%Y-%m-%d %H:%M:%S")).total_seconds()) < 120
    ]
    if len(recent_bookings_for_host) >= 5:
        suspicious_reasons.append("Sudden spike in bookings for this host")

    return {
        "suspicious": bool(suspicious_reasons),
        "reasons": suspicious_reasons
    }

# Test run
if __name__ == "__main__":
    import json

    with open("sample_data.json") as f:
        history = json.load(f)

    new_booking = {
        "booking_id": "B4567",
        "user_id": "U002",
        "host_id": "H123",
        "payment_id": "PAY567",
        "timestamp": "2025-07-12 10:01:15"
    }

    result = detect_suspicious(history, new_booking)
    print("\n🔍 Booking check result:")
    print(result)
