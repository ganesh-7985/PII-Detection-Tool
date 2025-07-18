import easyocr
from google.cloud import vision

def run_ocr(image_path: str, languages: list):
    reader = easyocr.Reader(languages, gpu=False)
    results = reader.readtext(image_path)
    ocr_results = [{"bbox": res[0], "text": res[1], "confidence": res[2]} for res in results]

    # Basic handwriting: Re-run low-conf with Vision
    low_conf = [r for r in ocr_results if r["confidence"] < 0.5]
    if low_conf:
        client = vision.ImageAnnotatorClient()
        with open(image_path, "rb") as f:
            content = f.read()
        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        # Simplified merging (for demo; update text if needed)
        for annotation in response.text_annotations[1:]:  # Skip full text
            # Basic: Log or minimal integration
            pass
    return ocr_results
