import cv2
import numpy as np
import os
import tempfile

# Try to import DeepFace, but don't fail if it's not available
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except Exception as e:
    print(f"Warning: DeepFace import failed: {e}")
    print("Using fallback image comparison method instead.")
    DEEPFACE_AVAILABLE = False

def verify_faces(baseline_video_path, new_video_path, tolerance=0.6):
    """
    Compare faces between two videos to verify if they are the same person
    
    Args:
        baseline_video_path (str): Path to the first video
        new_video_path (str): Path to the second video
        tolerance (float): Face recognition tolerance threshold
        
    Returns:
        bool: True if same person, False otherwise
    """
    try:
        # Extract frame from baseline video
        baseline_frame = extract_first_frame(baseline_video_path)
        if baseline_frame is None:
            return False
        
        # Extract frame from new video
        new_frame = extract_first_frame(new_video_path)
        if new_frame is None:
            return False
        
        # Try to use DeepFace if available
        if DEEPFACE_AVAILABLE:
            try:
                # Save frames to temporary files for DeepFace
                with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f1, \
                     tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f2:
                    
                    baseline_temp = f1.name
                    new_temp = f2.name
                    
                    cv2.imwrite(baseline_temp, baseline_frame)
                    cv2.imwrite(new_temp, new_frame)
                
                try:
                    # Verify faces using DeepFace
                    result = DeepFace.verify(
                        img1_path=baseline_temp,
                        img2_path=new_temp,
                        enforce_detection=False,  # Don't enforce face detection (more lenient)
                        model_name="VGG-Face"     # Faster model
                    )
                    
                    # Clean up temporary files
                    os.unlink(baseline_temp)
                    os.unlink(new_temp)
                    
                    # Get verification result
                    is_same_person = result.get('verified', False)
                    
                    return is_same_person
                
                except Exception as e:
                    # If DeepFace fails, clean up and fall back to histogram comparison
                    os.unlink(baseline_temp)
                    os.unlink(new_temp)
                    print(f"DeepFace verification failed: {e}. Falling back to histogram comparison.")
                    # Continue to fallback method
            
            except Exception as e:
                print(f"Error preparing images for DeepFace: {e}. Using fallback method.")
                # Continue to fallback method
        
        # Fallback: histogram comparison
        similarity = compare_frames(baseline_frame, new_frame)
        print(f"Using fallback comparison method. Similarity score: {similarity}")
        return similarity >= 0.5
    
    except Exception as e:
        print(f"Error in face verification: {e}")
        return False

def extract_first_frame(video_path):
    """
    Extract the first frame from a video
    
    Args:
        video_path (str): Path to the video file
        
    Returns:
        numpy.ndarray: First frame or None if failed
    """
    try:
        # Open the video
        cap = cv2.VideoCapture(video_path)
        
        # Read the first frame
        ret, frame = cap.read()
        if not ret:
            return None
        
        # Return the frame
        return frame
        
    except Exception as e:
        print(f"Error extracting frame from video: {e}")
        return None
    finally:
        if 'cap' in locals():
            cap.release()

def compare_frames(frame1, frame2):
    """
    Compare two frames using histogram comparison
    
    Args:
        frame1 (numpy.ndarray): First frame
        frame2 (numpy.ndarray): Second frame
        
    Returns:
        float: Similarity score (0-1, higher is more similar)
    """
    # Convert frames to grayscale
    gray1 = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)
    
    # Resize to same dimensions if needed
    if gray1.shape != gray2.shape:
        gray2 = cv2.resize(gray2, (gray1.shape[1], gray1.shape[0]))
    
    # Calculate histograms
    hist1 = cv2.calcHist([gray1], [0], None, [256], [0, 256])
    hist2 = cv2.calcHist([gray2], [0], None, [256], [0, 256])
    
    # Normalize histograms
    cv2.normalize(hist1, hist1, 0, 1, cv2.NORM_MINMAX)
    cv2.normalize(hist2, hist2, 0, 1, cv2.NORM_MINMAX)
    
    # Compare histograms
    similarity = cv2.compareHist(hist1, hist2, cv2.HISTCMP_CORREL)
    
    return similarity 