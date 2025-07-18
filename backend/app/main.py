import os
import certifi
os.environ['SSL_CERT_FILE'] = certifi.where()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
import shutil
import logging  # Added for global logging setup

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(api_router)

# Cleanup tmp on startup
if os.path.exists("tmp"):
    shutil.rmtree("tmp")
os.makedirs("tmp", exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "PII Masking Service is running"}
