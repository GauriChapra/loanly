from flask import Blueprint, request, current_app, jsonify
import os
import uuid
from werkzeug.utils import secure_filename
import pytesseract
from PIL import Image
import datetime
import re

from app.services.document_processor import process_document, extract_document_data
from app.utils.validators import validate_aadhaar, validate_pan, validate_document_data
from app.utils.get_mime_type import get_mime_type

bp = Blueprint('document', __name__, url_prefix='/api/document')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if the file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/upload', methods=['POST'])
def upload_document():
    """
    Upload a document image and process it with OCR
    Returns extracted text and validation results
    """
    print("Document upload request received")
    
    # Set CORS headers for this route
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 204, response_headers)
        
    if 'document' not in request.files or 'type' not in request.form:
        return jsonify({'error': 'Missing document file or type'}), 400, response_headers
    
    file = request.files['document']
    doc_type = request.form['type']
    
    print(f"Processing document type: {doc_type}")
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400, response_headers
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file format. Allowed formats: png, jpg, jpeg'}), 400, response_headers
    
    # Verify actual file type
    file_content = file.read()
    file.seek(0)
    mime_type = get_mime_type(file_content)
    
    if not mime_type.startswith('image/'):
        return jsonify({'error': 'Invalid file type. Must be an image'}), 400, response_headers
    
    # Create upload directory if it doesn't exist
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Generate unique filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{secure_filename(file.filename)}"
    document_id = str(uuid.uuid4())
    
    # Save document file
    file_path = os.path.join(upload_folder, f"{document_id}_{filename}")
    file.save(file_path)
    
    # Process document with OCR
    try:
        text, is_valid, extracted_data = process_document(file_path, doc_type)
        
        # Add some debug information
        print(f"Document {doc_type} OCR results:")
        print(f"Text length: {len(text)}")
        print(f"Validation result: {is_valid}")
        print(f"Extracted data: {extracted_data}")
        
        if not is_valid:
            return jsonify({
                'document_id': document_id,
                'status': 'error',
                'error': 'Document validation failed',
                'message': 'Please upload a clearer image or check the document type',
                'debug_text': text[:200] + "..." if len(text) > 200 else text  # Include text for debugging
            }), 400, response_headers
        
        return jsonify({
            'document_id': document_id,
            'status': 'success',
            'text': text,
            'extracted_data': extracted_data,
            'message': 'Document processed successfully'
        }), 201, response_headers
    
    except Exception as e:
        print(f"Error processing document: {str(e)}")
        # Return helpful error for debugging
        return jsonify({
            'document_id': document_id,
            'status': 'error',
            'error': str(e),
            'message': 'Error processing document'
        }), 500, response_headers

@bp.route('/verify/<doc_type>', methods=['POST', 'OPTIONS'])
def verify_document(doc_type):
    """
    Verify data extracted from a document (Aadhaar, PAN, etc.)
    """
    # Set CORS headers for this route
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 204, response_headers)
    
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400, response_headers
    
    # Validate document data based on type
    validation_result = validate_document_data(doc_type, data)
    
    return jsonify(validation_result), 200, response_headers

@bp.route('/documents/<document_id>', methods=['GET', 'OPTIONS'])
def get_document(document_id):
    """
    Get information about a previously uploaded document
    """
    # Set CORS headers for this route
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 204, response_headers)
    
    # Find document
    document_path = None
    for f in os.listdir(current_app.config['UPLOAD_FOLDER']):
        if f.startswith(document_id):
            document_path = os.path.join(current_app.config['UPLOAD_FOLDER'], f)
            break
    
    if document_path is None:
        return jsonify({'error': 'Document not found'}), 404, response_headers
    
    # Get document type from filename (assuming doc type is stored in filename)
    doc_type = request.args.get('type', 'unknown')
    
    # Re-process document to get data
    try:
        text, is_valid, extracted_data = process_document(document_path, doc_type)
        
        return jsonify({
            'document_id': document_id,
            'status': 'success' if is_valid else 'error',
            'text': text,
            'extracted_data': extracted_data
        }), 200, response_headers
    
    except Exception as e:
        return jsonify({
            'document_id': document_id,
            'status': 'error',
            'error': str(e)
        }), 500, response_headers

@bp.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """
    Check if document processing is working properly
    """
    # Set CORS headers for this route
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }
    
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return ('', 204, response_headers)
    
    # Check if Tesseract is available
    try:
        pytesseract.get_tesseract_version()
        tesseract_available = True
    except Exception:
        tesseract_available = False
    
    # Check if upload directory exists and is writable
    upload_dir = current_app.config['UPLOAD_FOLDER']
    upload_dir_exists = os.path.exists(upload_dir)
    upload_dir_writable = os.access(upload_dir, os.W_OK) if upload_dir_exists else False
    
    return jsonify({
        'status': 'healthy',
        'ocr_available': tesseract_available,
        'upload_dir_exists': upload_dir_exists,
        'upload_dir_writable': upload_dir_writable
    }), 200, response_headers 