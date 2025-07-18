import easyocr
from langdetect import detect

def detect_languages(image_path: str):
    reader = easyocr.Reader(["en"], gpu=False)
    results = reader.readtext(image_path)
    text = " ".join([res[1] for res in results])
    if not text:
        return ["en"]
    lang = detect(text)
    lang_map = {"en": "en", "hi": "hi", "ml": "ml"}
    return [lang_map.get(lang, "en")]
