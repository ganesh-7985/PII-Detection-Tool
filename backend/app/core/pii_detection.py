import re
import spacy

nlp = spacy.load("en_core_web_sm")

EMAIL_RE = re.compile(r"[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}")
PHONE_RE = re.compile(r"\b[6-9]\d{9}\b")
AADHAAR_RE = re.compile(r"\b\d{4}\s?\d{4}\s?\d{4}\b")
DATE_RE = re.compile(r"\b(\d{2}[\-/]\d{2}[\-/]\d{4})\b")
ADDRESS_RE = re.compile(r"\b(\d+ [a-zA-Z]+ (St|Road|Ave))\b")  # Simplified

THRESHOLD = 0.8

def detect_pii(ocr_results):
    detections, flagged = [], []
    for item in ocr_results:
        txt = item["text"]
        typ = None
        if EMAIL_RE.search(txt): typ = "EMAIL"
        elif PHONE_RE.search(txt): typ = "PHONE"
        elif AADHAAR_RE.search(txt): typ = "AADHAAR"
        elif DATE_RE.search(txt): typ = "DATE"  # DOB as date
        elif ADDRESS_RE.search(txt): typ = "ADDRESS"

        doc = nlp(txt)
        for ent in doc.ents:
            if ent.label_ == "PERSON": typ = "NAME"
            elif ent.label_ == "DATE" and not typ: typ = "DOB"

        if typ:
            det = {**item, "type": typ}
            detections.append(det)
            if item["confidence"] < THRESHOLD:
                flagged.append(det)
    return detections, flagged
