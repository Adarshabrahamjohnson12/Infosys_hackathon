import fitz  # PyMuPDF
import easyocr
import os
from fuzzywuzzy import fuzz
import json

reader = easyocr.Reader(['en'], gpu=False)

def pdf_to_image(pdf_path, image_output="temp_id.jpg"):
    doc = fitz.open(pdf_path)
    page = doc.load_page(0)
    pix = page.get_pixmap(dpi=200)
    pix.save(image_output)
    return image_output

def extract_text(image_path):
    results = reader.readtext(image_path)
    text_blocks = [text for (_, text, _) in results]
    return text_blocks

def match_fields(ocr_text, form_input):
    name_score = max([fuzz.token_sort_ratio(form_input["name"].lower(), line.lower()) for line in ocr_text])
    dob_score = max([fuzz.ratio(form_input["dob"], line) for line in ocr_text])
    id_score  = max([fuzz.partial_ratio(form_input["id_number"], line) for line in ocr_text])

    status = "Verified" if min(name_score, dob_score, id_score) >= 80 else "Needs Review"

    return {
        "name_match": name_score,
        "dob_match": dob_score,
        "id_match": id_score,
        "status": status
    }

def verify_host_id(pdf_path, form_input):
    img_path = pdf_to_image(pdf_path)
    ocr_text = extract_text(img_path)
    os.remove(img_path)
    return match_fields(ocr_text, form_input)

if __name__ == "__main__":
    # Load simulated form input from JSON file
    with open("sample_input.json", "r") as f:
        form_data = json.load(f)

    pdf_path = "test.pdf"
    result = verify_host_id(pdf_path, form_data)
    print("\n🔍 AI Verification Result:")
    print(result)
    