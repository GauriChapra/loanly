import cv2
import numpy as np
from PIL import Image

def preprocess_image(image_path):
    """
    Preprocess image for better OCR results
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        PIL.Image: Preprocessed image ready for OCR
    """
    try:
        # Read the image
        img = cv2.imread(image_path)
        
        # If image is not readable, return a blank image
        if img is None:
            # Create a blank image as fallback
            blank_img = np.zeros((300, 300, 3), np.uint8)
            blank_img.fill(255)  # White background
            return Image.fromarray(blank_img)
        
        # Resize if too large to improve processing speed
        # But not too small as it would affect OCR quality
        max_dim = max(img.shape[0], img.shape[1])
        scale_factor = 1.0
        if max_dim > 2000:
            scale_factor = 2000 / max_dim
            img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_AREA)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply thresholding to binarize the image
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Noise removal (Optional)
        kernel = np.ones((1, 1), np.uint8)
        opening = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        
        # Convert OpenCV image to PIL Image for further processing
        pil_img = Image.fromarray(opening)
        
        return pil_img
    except Exception as e:
        print(f"Error preprocessing image: {e}")
        # Return a blank image in case of error
        blank_img = np.zeros((300, 300, 3), np.uint8)
        blank_img.fill(255)  # White background
        return Image.fromarray(blank_img)

def enhance_document_image(image_path):
    """
    Apply advanced image enhancement for document images
    
    Args:
        image_path (str): Path to the image file
        
    Returns:
        PIL.Image: Enhanced image
    """
    try:
        # Read the image
        img = cv2.imread(image_path)
        
        # If image is not readable, return a blank image
        if img is None:
            blank_img = np.zeros((300, 300, 3), np.uint8)
            blank_img.fill(255)  # White background
            return Image.fromarray(blank_img)
        
        # Resize if needed (same as in preprocess_image)
        max_dim = max(img.shape[0], img.shape[1])
        scale_factor = 1.0
        if max_dim > 2000:
            scale_factor = 2000 / max_dim
            img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_AREA)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive histogram equalization
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        equalized = clahe.apply(gray)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoising(equalized, None, 10, 7, 21)
        
        # Edge enhancement
        kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        sharpened = cv2.filter2D(denoised, -1, kernel)
        
        # Try a different thresholding approach
        adaptive_thresh = cv2.adaptiveThreshold(
            sharpened, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )
        
        # Extra dilation to make text clearer
        dilation_kernel = np.ones((1, 1), np.uint8)
        dilated = cv2.dilate(adaptive_thresh, dilation_kernel, iterations=1)
        
        # Convert OpenCV image to PIL Image
        pil_img = Image.fromarray(dilated)
        
        return pil_img
    except Exception as e:
        print(f"Error enhancing image: {e}")
        # Return a blank image in case of error
        blank_img = np.zeros((300, 300, 3), np.uint8)
        blank_img.fill(255)  # White background
        return Image.fromarray(blank_img)

def crop_document_region(image_path, region='auto'):
    """
    Detect and crop the document region from an image
    
    Args:
        image_path (str): Path to the image file
        region (str): 'auto' for automatic detection or 'center' for center crop
        
    Returns:
        PIL.Image: Cropped document image
    """
    try:
        # Read the image
        img = cv2.imread(image_path)
        
        # If image is not readable, return a blank image
        if img is None:
            blank_img = np.zeros((300, 300, 3), np.uint8)
            blank_img.fill(255)  # White background
            return Image.fromarray(blank_img)
        
        # Resize if needed (same as in preprocess_image)
        max_dim = max(img.shape[0], img.shape[1])
        scale_factor = 1.0
        if max_dim > 3000:
            scale_factor = 3000 / max_dim
            img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_AREA)
        
        if region == 'auto':
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply Gaussian blur
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            
            # Edge detection
            edges = cv2.Canny(blur, 50, 150)
            
            # Dilate edges to connect broken contours
            dilated = cv2.dilate(edges, np.ones((3,3), np.uint8), iterations=1)
            
            # Find contours
            contours, _ = cv2.findContours(dilated, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
            
            # Sort contours by area (largest first)
            contours = sorted(contours, key=cv2.contourArea, reverse=True)
            
            # Find largest rectangle-like contour
            for cnt in contours[:10]:  # Check top 10 contours for better results
                peri = cv2.arcLength(cnt, True)
                approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
                
                # If contour has 4 points, it's likely a document
                if len(approx) == 4:
                    # Get bounding rectangle
                    x, y, w, h = cv2.boundingRect(approx)
                    
                    # Ensure the contour is big enough (filter out small rectangles)
                    if w > img.shape[1] * 0.3 and h > img.shape[0] * 0.3:
                        # Extend the rectangle a bit to ensure full document capture
                        padding = 10
                        x = max(0, x - padding)
                        y = max(0, y - padding)
                        w = min(img.shape[1] - x, w + 2*padding)
                        h = min(img.shape[0] - y, h + 2*padding)
                        
                        # Crop the image
                        cropped = img[y:y+h, x:x+w]
                        pil_img = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
                        return pil_img
        
        # Fallback to center crop if no suitable contour found or if region='center'
        h, w = img.shape[:2]
        crop_w = int(w * 0.8)
        crop_h = int(h * 0.8)
        
        start_x = (w - crop_w) // 2
        start_y = (h - crop_h) // 2
        
        cropped = img[start_y:start_y+crop_h, start_x:start_x+crop_w]
        pil_img = Image.fromarray(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
        
        return pil_img
    except Exception as e:
        print(f"Error cropping image: {e}")
        # Return a blank image in case of error
        blank_img = np.zeros((300, 300, 3), np.uint8)
        blank_img.fill(255)  # White background
        return Image.fromarray(cv2.cvtColor(blank_img, cv2.COLOR_BGR2RGB)) 