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

### Encryption
- Uses Fernet symmetric encryption
- PBKDF2 key derivation with SHA256
- Secure key storage via environment variables

### Data Integrity
- HMAC verification for all files
- SHA256 hashing algorithm
- Integrity checks on file retrieval

### Audit Logging
- Comprehensive logging in `audit.log`
- Tracks all operations with timestamps
- Logs include:
  - File uploads/downloads
  - Application submissions
  - Error events
  - Access attempts

## Development

For development with auto-reload:
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## CORS Configuration

The API is configured to accept requests from all origins during development. In production, update the CORS settings in `main.py` to restrict access to your frontend domain.

## Error Handling

The API includes comprehensive error handling:
- File not found errors
- Invalid document type errors
- Encryption/decryption errors
- All errors are logged in the audit log

## Security Notes

1. **Production Deployment**:
   - Use strong, unique keys for SECRET_KEY and ENCRYPTION_KEY
   - Implement proper authentication
   - Use HTTPS
   - Restrict CORS to your frontend domain
   - Use secure random salt for key derivation

2. **Data Protection**:
   - All sensitive data is encrypted at rest
   - Files are encrypted before storage
   - Temporary files are used for downloads
   - Comprehensive audit logging for all operations

3. **Compliance**:
   - Follows RBI guidelines for digital lending
   - Adheres to Aadhaar Act 2016 provisions
   - Compliant with IT Act 2000 requirements
   - Implements GDPR data protection measures

## Legal Requirements

1. **Privacy Policy**:
   - Data collection and usage
   - User consent mechanisms
   - Data retention policies
   - User rights and obligations

2. **Terms of Service**:
   - Usage terms
   - User responsibilities
   - Service limitations
   - Dispute resolution

3. **Compliance Documentation**:
   - Data protection measures
   - Security protocols
   - Audit procedures
   - Incident response plans

## Support

For issues or questions, please refer to the project documentation or contact the development team. 