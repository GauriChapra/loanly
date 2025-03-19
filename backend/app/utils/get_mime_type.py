import mimetypes

def get_mime_type(file_content):
    """Detect MIME type from file content by examining magic bytes
    
    Args:
        file_content (bytes): The content of the file
        
    Returns:
        str: MIME type string
    """
    # Initialize mimetypes
    mimetypes.init()
    
    # Get first few bytes for basic check
    header = file_content[:12]
    
    # Check for common image signatures
    if header.startswith(b'\xff\xd8'):  # JPEG
        return 'image/jpeg'
    elif header.startswith(b'\x89PNG\r\n\x1a\n'):  # PNG
        return 'image/png'
    elif header.startswith(b'GIF87a') or header.startswith(b'GIF89a'):  # GIF
        return 'image/gif'
    
    # Default to octet-stream if can't determine
    return 'application/octet-stream' 