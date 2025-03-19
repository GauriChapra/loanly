import os
# No dotenv, using direct environment variables
from app import create_app

# Create the Flask application
app = create_app()

if __name__ == '__main__':
    # Run the app in debug mode when called directly
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 8000)), debug=True) 