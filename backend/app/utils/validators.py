import re

def validate_aadhaar(text, data):
    """
    Validate Aadhaar card data - simplified to just require aadhaar number
    
    Args:
        text (str): Raw OCR text
        data (dict): Extracted data
        
    Returns:
        bool: True if valid, False otherwise
    """
    # Check for Aadhaar number (primary requirement)
    if 'aadhaar_number' not in data:
        return False
    
    # Basic Aadhaar validation (12 digits)
    aadhaar = data['aadhaar_number']
    if not re.match(r'^\d{12}$', aadhaar):
        return False
    
    # We've simplified - if we have an Aadhaar number, it's considered valid
    return True

def validate_pan(text, data):
    """
    Validate PAN card data with capital letters for names
    
    Args:
        text (str): Raw OCR text
        data (dict): Extracted data
        
    Returns:
        bool: True if valid, False otherwise
    """
    # Check for PAN number (primary requirement)
    if 'pan_number' not in data:
        return False
    
    # Validate PAN format (5 uppercase letters + 4 digits + 1 uppercase letter)
    pan = data['pan_number']
    if not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', pan):
        return False
    
    # PAN card is considered valid if we have the number
    return True

def validate_document_data(doc_type, data):
    """
    Validate document data based on document type
    
    Args:
        doc_type (str): Type of document
        data (dict): Document data to validate
        
    Returns:
        dict: Validation result with status and errors
    """
    result = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    if 'aadhaar' in doc_type:
        if not data.get('aadhaar_number'):
            result['valid'] = False
            result['errors'].append('Aadhaar number is missing')
        elif not re.match(r'^\d{12}$', str(data.get('aadhaar_number', ''))):
            result['valid'] = False
            result['errors'].append('Invalid Aadhaar number format')
            
        if not data.get('name'):
            result['warnings'].append('Name not found in document')
            
    elif 'pan' in doc_type:
        if not data.get('pan_number'):
            result['valid'] = False
            result['errors'].append('PAN number is missing')
        elif not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', str(data.get('pan_number', ''))):
            result['valid'] = False
            result['errors'].append('Invalid PAN number format')
            
        if not data.get('name'):
            result['warnings'].append('Name not found in document')
            
    elif 'tax' in doc_type or 'income' in doc_type:
        if not data.get('income'):
            result['valid'] = False
            result['errors'].append('Income information not found')
            
        if not data.get('tax_year'):
            result['warnings'].append('Tax year not found')
            
        if not data.get('pan') and not re.match(r'^[A-Z]{5}[0-9]{4}[A-Z]{1}$', str(data.get('pan', ''))):
            result['warnings'].append('Valid PAN number not found in tax document')
            
    return result 