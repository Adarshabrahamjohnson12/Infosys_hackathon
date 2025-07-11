# File: ml-agents/chatbot/faq.py

def get_answer(user_input):
    user_input = user_input.lower()

    if "price" in user_input or "cost" in user_input:
        return "Our village stays typically start from ₹1000/night. You can filter by budget."
    elif "book" in user_input:
        return "To book, select your stay, choose dates, and click 'Book Now'."
    elif "refund" in user_input:
        return "Refunds depend on the host's policy. You can check it on the stay page."
    elif "payment" in user_input:
        return "You can pay securely via UPI, card, or net banking."
    elif "farmstay" in user_input:
        return "We have beautiful farmstays in Kerala, Tamil Nadu, and Himachal. Use filters to find one!"
    else:
        return "Sorry, I didn't understand. Can you please rephrase your question?"
