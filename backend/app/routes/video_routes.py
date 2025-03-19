from flask import Blueprint, request, current_app, jsonify
import os
import uuid
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import datetime

from app.services.face_verification import verify_faces

bp = Blueprint('video', __name__, url_prefix='/api/video')

def allowed_video_file(filename):
    """Check if uploaded file is an allowed video format"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'mp4', 'webm', 'mov'}

@bp.route('/upload', methods=['POST'])
def upload_video():
    """
    Upload video response from user
    Returns unique identifier for the video
    """
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400
    
    file = request.files['video']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if not allowed_video_file(file.filename):
        return jsonify({'error': 'Invalid file format. Allowed formats: mp4, webm, mov'}), 400
    
    # Generate unique filename with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{timestamp}_{secure_filename(file.filename)}"
    video_id = str(uuid.uuid4())
    
    # Save video file
    file_path = os.path.join(current_app.config['VIDEO_FOLDER'], f"{video_id}_{filename}")
    file.save(file_path)
    
    # Extract a frame to check if the video is valid
    cap = cv2.VideoCapture(file_path)
    success, frame = cap.read()
    cap.release()
    
    if not success:
        return jsonify({
            'error': 'Could not read video frame',
            'video_id': video_id,
            'status': 'error'
        }), 400
    
    return jsonify({
        'message': 'Video uploaded successfully',
        'video_id': video_id,
        'status': 'success'
    }), 201

@bp.route('/verify', methods=['POST'])
def verify_video():
    """
    Verify that the face in the new video matches the baseline video
    """
    if 'video' not in request.files or 'baseline_video_id' not in request.form:
        return jsonify({'error': 'Missing video file or baseline ID'}), 400
    
    file = request.files['video']
    baseline_video_id = request.form['baseline_video_id']
    
    if file.filename == '' or not allowed_video_file(file.filename):
        return jsonify({'error': 'Invalid file'}), 400
    
    # Generate unique filename
    filename = f"{secure_filename(file.filename)}"
    verification_id = str(uuid.uuid4())
    
    # Save new video
    file_path = os.path.join(current_app.config['VIDEO_FOLDER'], f"{verification_id}_{filename}")
    file.save(file_path)
    
    # Find baseline video
    baseline_video = None
    for f in os.listdir(current_app.config['VIDEO_FOLDER']):
        if f.startswith(baseline_video_id):
            baseline_video = os.path.join(current_app.config['VIDEO_FOLDER'], f)
            break
    
    if baseline_video is None:
        return jsonify({'error': 'Baseline video not found'}), 404
    
    # Verify faces
    is_same_person = verify_faces(baseline_video, file_path)
    
    return jsonify({
        'message': 'Face verification completed',
        'is_same_person': is_same_person,
        'status': 'success'
    }), 200 