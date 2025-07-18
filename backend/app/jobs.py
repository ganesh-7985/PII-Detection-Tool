import os
import base64
import logging
from app.core.ocr import run_ocr
from app.core.pii_detection import detect_pii
from app.utils.image_mask import mask_image
from app.core.language_detection import detect_languages

# Use the configured logger
logger = logging.getLogger(__name__)

tasks = {}  # In-memory store

def process_job(job_id: str, image_path: str, languages: list = None):
    masked_path = f"tmp/{job_id}_masked.jpg"
    try:
        tasks[job_id] = {"status": "pending", "result": None}
        logger.info(f"Job {job_id} status updated to pending") 

        tasks[job_id]["status"] = "processing"
        logger.info(f"Job {job_id} status updated to processing")  

        detected_languages = languages or detect_languages(image_path)

        ocr_results = run_ocr(image_path, detected_languages)

        detections, flagged = detect_pii(ocr_results)


        mask_image(image_path, detections, masked_path)

        with open(masked_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode()

        # Save result
        tasks[job_id]["status"] = "completed"
        tasks[job_id]["result"] = {
            "detections": detections,
            "flagged": flagged,
            "image_base64": img_b64,
            "languages": detected_languages
        }
        logger.info(f"Job {job_id} status updated to completed")  # Log completion
    except Exception as e:
        logger.error(f"Error in job {job_id}: {str(e)}")
        tasks[job_id]["status"] = "failed"
        logger.info(f"Job {job_id} status updated to failed")  # Log failure
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
        if os.path.exists(masked_path):
            os.remove(masked_path)
