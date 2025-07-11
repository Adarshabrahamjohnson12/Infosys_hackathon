# File: ml-agents/chatbot/app.py

from flask import Flask, request, jsonify
from googletrans import Translator

app = Flask(__name__)
translator = Translator()

# Your mini FAQ logic right here — inline for simplicity
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

@app.route('/chatbot', methods=['GET', 'POST'])
def chatbot():
    if request.method == 'GET':
        return "✅ Bot is running! Use POST with JSON to talk."

    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "No input message provided"}), 400

    # Auto-detect & translate to English
    translated = translator.translate(user_input, dest='en')
    english_text = translated.text

    # Get answer in English
    answer_en = get_answer(english_text)

    # Translate back to user's original language if needed
    detected_lang = translated.src
    if detected_lang != 'en':
        answer_translated = translator.translate(answer_en, dest=detected_lang).text
    else:
        answer_translated = answer_en

    return jsonify({
        'detected_lang': detected_lang,
        'user_input_translated': english_text,
        'answer': answer_translated
    })

if __name__ == '__main__':
    app.run(debug=True, port=5004)
