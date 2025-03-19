from flask import Flask, jsonify
from flask_cors import CORS
import os
import importlib

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # Enable CORS
    CORS(app)
    
    # Ensure instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # Get the absolute path to the backend directory
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # Define upload directories relative to backend directory
    upload_folder = os.path.join(backend_dir, 'static', 'uploads')
    video_folder = os.path.join(backend_dir, 'static', 'videos')
    
    # Ensure upload folders exist
    os.makedirs(upload_folder, exist_ok=True)
    os.makedirs(video_folder, exist_ok=True)
    
    # Default configuration
    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY', 'dev_key_change_in_production'),
        UPLOAD_FOLDER=upload_folder,
        VIDEO_FOLDER=video_folder,
        MAX_CONTENT_LENGTH=16 * 1024 * 1024,  # Max 16 MB uploads
    )
    
    if test_config is None:
        # Load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # Load the test config if passed in
        app.config.from_mapping(test_config)
    
    # Import and register blueprints
    try:
        from app.routes import video_routes
        app.register_blueprint(video_routes.bp)
    except Exception as e:
        print(f"Warning: Could not register video routes: {e}")
    
    try:
        from app.routes import document_routes
        app.register_blueprint(document_routes.bp)
    except Exception as e:
        print(f"Warning: Could not register document routes: {e}")
    
    try:
        from app.routes import loan_routes
        app.register_blueprint(loan_routes.bp)
    except Exception as e:
        print(f"Warning: Could not register loan routes: {e}")
    
    @app.route('/')
    def root():
        return jsonify({
            'status': 'healthy',
            'message': 'Loanly API is running',
            'version': '1.0.0',
            'endpoints': {
                'health': '/health',
                'documents': '/api/documents/*',
                'videos': '/api/videos/*'
            }
        })

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}
    
    return app 