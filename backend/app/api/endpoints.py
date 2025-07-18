import os
import shutil
from fastapi import APIRouter, UploadFile, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from uuid import uuid4
from app.jobs import tasks, process_job
from app.core.schemas import UploadResponse, StatusResponse, ResultResponse, ReviewRequest
from typing import List
from pypdfium2 import PdfDocument
from PIL import Image

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
def upload_image(file: UploadFile, bg_tasks: BackgroundTasks, languages: List[str] = None):
    if not file.content_type.startswith(('image/', 'application/pdf')):
        raise HTTPException(400, "Invalid file type")
    if file.size > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large")

    job_id = str(uuid4())
    path = f"tmp/{job_id}.jpg"
    os.makedirs("tmp", exist_ok=True)

    # PDF to image
    if file.content_type == 'application/pdf':
        pdf = PdfDocument(file.file)
        page = pdf[0]
        bitmap = page.render(scale=2)
        img = bitmap.to_pil()
        img.save(path)
    else:
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    tasks[job_id] = {"status": "pending"}
    bg_tasks.add_task(process_job, job_id, path, languages)
    return {"job_id": job_id}

@router.get("/jobs/{job_id}/status", response_model=StatusResponse)
def get_status(job_id: str):
    job = tasks.get(job_id)
    if not job:
        raise HTTPException(404, "Job not found")
    return {"status": job["status"]}

@router.get("/jobs/{job_id}/result", response_model=ResultResponse)
def get_result(job_id: str):
    job = tasks.get(job_id)
    if not job or job["status"] != "completed":
        raise HTTPException(404, "Result not available")
    return job["result"]

@router.post("/review/{job_id}")
def review(job_id: str, review: ReviewRequest):
    if job_id not in tasks:
        raise HTTPException(404, "Job not found")
    tasks[job_id]["review"] = review.decisions
    return JSONResponse({"message": "Review recorded"})
