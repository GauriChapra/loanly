from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import uuid
from typing import Optional
from pydantic import BaseModel
import os
import shutil
from datetime import datetime
import logging
import hashlib
import hmac
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import json
from pathlib import Path

# Configure logging
logging.basicConfig(
    filename='audit.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Security configuration
SECRET_KEY = os.getenv('SECRET_KEY', 'your-secure-secret-key')  # In production, use environment variable
ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY', 'your-encryption-key')  # In production, use environment variable

# Initialize encryption
def get_encryption_key():
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=b'fixed_salt',  # In production, use a secure random salt
        iterations=100000,
    )
    key = base64.urlsafe_b64encode(kdf.derive(ENCRYPTION_KEY.encode()))
    return Fernet(key)

fernet = get_encryption_key()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create secure storage directory
UPLOAD_DIR = "secure_storage"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Pydantic models for request validation
class LoanApplication(BaseModel):
    loan_type: str
    amount: float
    purpose: str
    tenure: int
    monthly_income: float

# Security utilities
def generate_hmac(data: str) -> str:
    """Generate HMAC for data integrity verification"""
    return hmac.new(
        SECRET_KEY.encode(),
        data.encode(),
        hashlib.sha256
    ).hexdigest()

def encrypt_file(file_content: bytes) -> bytes:
    """Encrypt file content"""
    return fernet.encrypt(file_content)

def decrypt_file(encrypted_content: bytes) -> bytes:
    """Decrypt file content"""
    return fernet.decrypt(encrypted_content)

def log_audit(action: str, details: dict):
    """Log audit information"""
    log_entry = {
        "timestamp": datetime.now().isoformat(),
        "action": action,
        "details": details
    }
    logging.info(json.dumps(log_entry))

# Routes
@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create secure directory
        video_dir = os.path.join(UPLOAD_DIR, "encrypted_videos")
        os.makedirs(video_dir, exist_ok=True)
        
        # Read and encrypt file content
        content = await file.read()
        encrypted_content = encrypt_file(content)
        
        # Save encrypted file
        file_path = os.path.join(video_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(encrypted_content)
        
        # Generate HMAC for integrity verification
        hmac_value = generate_hmac(unique_filename)
        
        # Log the upload
        log_audit("video_upload", {
            "filename": unique_filename,
            "original_name": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "hmac": hmac_value
        })
        
        return {
            "filename": unique_filename,
            "hmac": hmac_value,
            "message": "Video uploaded successfully"
        }
    except Exception as e:
        log_audit("video_upload_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-document")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = None
):
    try:
        # Validate document type
        valid_types = ['aadhar_front', 'aadhar_back', 'pan_front', 'pan_back']
        if document_type not in valid_types:
            raise HTTPException(status_code=400, detail="Invalid document type")
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create secure directory
        doc_dir = os.path.join(UPLOAD_DIR, "encrypted_documents", document_type)
        os.makedirs(doc_dir, exist_ok=True)
        
        # Read and encrypt file content
        content = await file.read()
        encrypted_content = encrypt_file(content)
        
        # Save encrypted file
        file_path = os.path.join(doc_dir, unique_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(encrypted_content)
        
        # Generate HMAC for integrity verification
        hmac_value = generate_hmac(unique_filename)
        
        # Log the upload
        log_audit("document_upload", {
            "filename": unique_filename,
            "document_type": document_type,
            "original_name": file.filename,
            "content_type": file.content_type,
            "size": len(content),
            "hmac": hmac_value
        })
        
        return {
            "filename": unique_filename,
            "hmac": hmac_value,
            "message": "Document uploaded successfully"
        }
    except Exception as e:
        log_audit("document_upload_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-video/{filename}")
async def get_video(filename: str):
    try:
        file_path = os.path.join(UPLOAD_DIR, "encrypted_videos", filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Video not found")
        
        # Read and decrypt file
        with open(file_path, "rb") as buffer:
            encrypted_content = buffer.read()
        decrypted_content = decrypt_file(encrypted_content)
        
        # Log the access
        log_audit("video_access", {
            "filename": filename,
            "size": len(decrypted_content)
        })
        
        # Create temporary file for response
        temp_path = os.path.join(UPLOAD_DIR, "temp", filename)
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        with open(temp_path, "wb") as buffer:
            buffer.write(decrypted_content)
        
        return FileResponse(temp_path)
    except Exception as e:
        log_audit("video_access_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-document/{document_type}/{filename}")
async def get_document(document_type: str, filename: str):
    try:
        file_path = os.path.join(UPLOAD_DIR, "encrypted_documents", document_type, filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Read and decrypt file
        with open(file_path, "rb") as buffer:
            encrypted_content = buffer.read()
        decrypted_content = decrypt_file(encrypted_content)
        
        # Log the access
        log_audit("document_access", {
            "filename": filename,
            "document_type": document_type,
            "size": len(decrypted_content)
        })
        
        # Create temporary file for response
        temp_path = os.path.join(UPLOAD_DIR, "temp", filename)
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        with open(temp_path, "wb") as buffer:
            buffer.write(decrypted_content)
        
        return FileResponse(temp_path)
    except Exception as e:
        log_audit("document_access_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/submit-application")
async def submit_application(application: LoanApplication):
    try:
        # Log the application submission
        log_audit("application_submit", {
            "loan_type": application.loan_type,
            "amount": application.amount,
            "purpose": application.purpose,
            "tenure": application.tenure,
            "monthly_income": application.monthly_income
        })
        
        # In a real application, you would save this to a database
        # For now, we'll just return the application data
        return {
            "message": "Application submitted successfully",
            "application": application.dict()
        }
    except Exception as e:
        log_audit("application_submit_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/application-status/{application_id}")
async def get_application_status(application_id: str):
    try:
        # Log the status check
        log_audit("application_status_check", {
            "application_id": application_id
        })
        
        # In a real application, you would fetch this from a database
        # For now, we'll return a mock status
        return {
            "application_id": application_id,
            "status": "pending",
            "submitted_at": datetime.now().isoformat()
        }
    except Exception as e:
        log_audit("application_status_check_error", {"error": str(e)})
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 