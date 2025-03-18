# Loan Application Backend

A secure FastAPI backend for handling loan applications with video verification and document management. This implementation follows Indian financial regulations and GDPR requirements for handling sensitive financial data.

## Features

- Secure video upload and storage
- Encrypted document management
- Loan application processing
- Application status tracking
- Comprehensive audit logging
- Data integrity verification
- End-to-end encryption for sensitive data

## Security Features

- **File Encryption**: All uploaded files are encrypted using Fernet (symmetric encryption)
- **Data Integrity**: HMAC verification for file integrity
- **Audit Logging**: Comprehensive logging of all operations
- **Secure Storage**: Encrypted file storage with proper directory structure
- **Document Validation**: Strict validation for document types
- **Environment Variables**: Secure key management

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
# Create a .env file with the following variables
SECRET_KEY=your-secure-secret-key
ENCRYPTION_KEY=your-encryption-key
```

4. Run the server:
```bash
python main.py
```

The server will start at `http://127.0.0.1:8000`

## API Documentation

### Video Upload
- **Endpoint**: `POST /api/upload-video`
- **Description**: Upload a video file with encryption
- **Response**: Returns filename and HMAC for integrity verification

### Document Upload
- **Endpoint**: `POST /api/upload-document`
- **Description**: Upload a document with encryption
- **Parameters**:
  - `document_type`: One of ['aadhar_front', 'aadhar_back', 'pan_front', 'pan_back']
- **Response**: Returns filename and HMAC for integrity verification

### File Retrieval
- **Video**: `GET /api/get-video/{filename}`
- **Document**: `GET /api/get-document/{document_type}/{filename}`
- **Description**: Retrieve encrypted files (automatically decrypted)

### Loan Application
- **Submit**: `POST /api/submit-application`
- **Status**: `GET /api/application-status/{application_id}`

## File Storage Structure

```
secure_storage/
├── encrypted_videos/      # Encrypted video files
├── encrypted_documents/   # Encrypted document files
│   ├── aadhar_front/
│   ├── aadhar_back/
│   ├── pan_front/
│   └── pan_back/
└── temp/                 # Temporary files for downloads
```

## Security Implementation

### 1. File Encryption
- **Algorithm**: Fernet (symmetric encryption)
- **Key Derivation**: PBKDF2 with SHA256
  ```python
  kdf = PBKDF2HMAC(
      algorithm=hashes.SHA256(),
      length=32,
      salt=b'fixed_salt',
      iterations=100000,
  )
  ```
- **Key Storage**: Environment variables (SECRET_KEY, ENCRYPTION_KEY)
- **File Processing**:
  - Files are encrypted before storage
  - Decrypted only during authorized access
  - Temporary files are used for downloads
  - Files are immediately deleted after download

### 2. Data Integrity
- **HMAC Implementation**:
  ```python
  def generate_hmac(data: str) -> str:
      return hmac.new(
          SECRET_KEY.encode(),
          data.encode(),
          hashlib.sha256
      ).hexdigest()
  ```
- **Verification Process**:
  - HMAC generated for each file upload
  - Stored with file metadata
  - Used to verify file integrity on retrieval
  - Prevents tampering and unauthorized modifications

### 3. File System Security
- **Directory Structure**:
  ```
  secure_storage/
  ├── encrypted_videos/      # 0o700 permissions
  ├── encrypted_documents/   # 0o700 permissions
  │   ├── aadhar_front/     # 0o700 permissions
  │   ├── aadhar_back/
  │   ├── pan_front/
  │   └── pan_back/
  └── temp/                 # Temporary files
  ```
- **File Permissions**:
  - Directories: 0o700 (owner read/write/execute only)
  - Files: 0o600 (owner read/write only)
  - Temporary files: 0o600 with immediate deletion

### 4. Input Validation
- **File Size Limits**:
  - Maximum file size: 50MB
  - Enforced before processing
  - Prevents DoS attacks
- **File Type Validation**:
  - Videos: mp4, quicktime
  - Documents: pdf, jpeg, png
  - Strict MIME type checking
- **Document Type Validation**:
  - Aadhaar (front/back)
  - PAN (front/back)
  - Prevents unauthorized document types

### 5. Rate Limiting
- **Development Mode** (default):
  ```python
  RATE_LIMITS = {
      'development': {
          'video_upload': "1000/minute",
          'document_upload': "2000/minute",
          'file_download': "5000/minute",
          'application_submit': "2000/minute",
          'status_check': "10000/minute"
      }
  }
  ```
- **Production Mode**:
  ```python
  RATE_LIMITS = {
      'production': {
          'video_upload': "5/minute",
          'document_upload': "10/minute",
          'file_download': "30/minute",
          'application_submit': "10/minute",
          'status_check': "60/minute"
      }
  }
  ```
- **Mode Configuration**:
  - Set via environment variable: `DEV_MODE`
  - Default: `true` (development mode)
  - Set to `false` for production mode
- **Implementation**:
  - IP-based rate limiting
  - 429 Too Many Requests response
  - Automatic request queuing

### 6. Audit Logging
- **Structured Logging**:
  ```python
  structlog.configure(
      processors=[
          structlog.processors.TimeStamper(fmt="iso"),
          structlog.processors.JSONRenderer()
      ]
  )
  ```
- **Logged Events**:
  - File uploads/downloads
  - Application submissions
  - Error events
  - Access attempts
  - File operations
- **Log Format**:
  ```json
  {
    "timestamp": "ISO-8601",
    "action": "event_type",
    "details": {
      "filename": "string",
      "size": "number",
      "content_type": "string",
      "hmac": "string"
    }
  }
  ```

### 7. Asynchronous Processing
- **Thread Pool**:
  ```python
  thread_pool = ThreadPoolExecutor(max_workers=4)
  ```
- **Benefits**:
  - Non-blocking file operations
  - Better concurrent request handling
  - Improved performance
  - Resource management

## Regulatory Compliance

### 1. RBI Guidelines for Digital Lending
- **Data Protection**:
  - End-to-end encryption
  - Secure storage
  - Access controls
  - Audit trails
- **Customer Protection**:
  - Rate limiting
  - Input validation
  - Error handling
  - Clear error messages

### 2. Aadhaar Act 2016
- **Document Handling**:
  - Secure storage
  - Encryption
  - Access logging
  - Data minimization
- **Compliance Requirements**:
  - Audit trails
  - Data retention
  - Access controls
  - Security measures

### 3. IT Act 2000
- **Security Requirements**:
  - Encryption
  - Digital signatures
  - Access controls
  - Audit logs
- **Data Protection**:
  - Secure storage
  - Data integrity
  - Access logging
  - Error handling

### 4. GDPR Compliance
- **Data Protection**:
  - Encryption at rest
  - Secure transmission
  - Access controls
  - Data minimization
- **User Rights**:
  - Data access
  - Data deletion
  - Data portability
  - Consent management

## API Documentation

### 1. Video Upload
- **Endpoint**: `POST /api/upload-video`
- **Rate Limit**: 
  - Development: 1000/minute
  - Production: 5/minute
- **Request**:
  - Content-Type: multipart/form-data
  - Body: video file
- **Response**:
  ```json
  {
    "filename": "uuid.extension",
    "hmac": "hash_value",
    "message": "Video uploaded successfully"
  }
  ```
- **Validation**:
  - File size: max 50MB
  - File types: mp4, quicktime
  - Content-Type validation

### 2. Document Upload
- **Endpoint**: `POST /api/upload-document`
- **Rate Limit**:
  - Development: 2000/minute
  - Production: 10/minute
- **Request**:
  - Content-Type: multipart/form-data
  - Body: document file
  - Query: document_type (aadhar_front, aadhar_back, pan_front, pan_back)
- **Response**:
  ```json
  {
    "filename": "uuid.extension",
    "hmac": "hash_value",
    "message": "Document uploaded successfully"
  }
  ```
- **Validation**:
  - File size: max 50MB
  - File types: pdf, jpeg, png
  - Document type validation

### 3. File Retrieval
- **Video**: `GET /api/get-video/{filename}`
- **Document**: `GET /api/get-document/{document_type}/{filename}`
- **Rate Limit**:
  - Development: 5000/minute
  - Production: 30/minute
- **Response**: File stream
- **Security**:
  - Temporary file creation
  - Immediate deletion
  - Access logging

### 4. Loan Application
- **Submit**: `POST /api/submit-application`
- **Rate Limit**:
  - Development: 2000/minute
  - Production: 10/minute
- **Request Body**:
  ```json
  {
    "loan_type": "string",
    "amount": "number",
    "purpose": "string",
    "tenure": "number",
    "monthly_income": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Application submitted successfully",
    "application": {
      "loan_type": "string",
      "amount": "number",
      "purpose": "string",
      "tenure": "number",
      "monthly_income": "number"
    }
  }
  ```

### 5. Application Status
- **Endpoint**: `GET /api/application-status/{application_id}`
- **Rate Limit**:
  - Development: 10000/minute
  - Production: 60/minute
- **Response**:
  ```json
  {
    "application_id": "string",
    "status": "string",
    "submitted_at": "ISO-8601"
  }
  ```

## Error Handling

### 1. HTTP Status Codes
- 200: Success
- 400: Bad Request (validation error)
- 404: Resource not found
- 429: Too many requests
- 500: Server error

### 2. Error Response Format
```json
{
  "detail": "Error message"
}
```

### 3. Error Logging
- All errors are logged with:
  - Timestamp
  - Error type
  - Stack trace
  - Request details

## Development Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set environment variables:
```bash
# Required
SECRET_KEY=your-secure-secret-key
ENCRYPTION_KEY=your-encryption-key

# Optional (defaults to true)
DEV_MODE=true  # Set to false for production mode
```

4. Run the server:
```bash
python main.py
```

## Production Deployment

1. **Security Checklist**:
   - Use strong, unique keys
   - Enable HTTPS
   - Configure proper CORS
   - Set up monitoring
   - Regular security audits
   - Set DEV_MODE=false

2. **Performance Optimization**:
   - Configure worker processes
   - Set up caching
   - Monitor resource usage
   - Regular backups

3. **Monitoring**:
   - Set up log aggregation
   - Configure alerts
   - Monitor rate limits
   - Track error rates

## Support

For issues or questions, please refer to the project documentation or contact the development team. 