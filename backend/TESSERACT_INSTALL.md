# Installing Tesseract OCR

For the OCR functionality to work properly, you need to install Tesseract OCR on your system. Here are instructions for different platforms:

## macOS

### Using Homebrew (Recommended)

1. Install Homebrew if you don't have it:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Install Tesseract and language data:
   ```bash
   brew install tesseract
   brew install tesseract-lang  # For additional languages
   ```

3. Verify installation:
   ```bash
   tesseract --version
   ```

### Using MacPorts

1. Install MacPorts if you don't have it: https://www.macports.org/install.php

2. Install Tesseract:
   ```bash
   sudo port install tesseract
   sudo port install tesseract-eng  # English language data
   ```

## Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y tesseract-ocr libtesseract-dev
sudo apt install -y tesseract-ocr-eng  # English language data
```

## Windows

1. Download the installer from: https://github.com/UB-Mannheim/tesseract/wiki
2. Run the installer and follow the prompts
3. Add Tesseract to your PATH environment variable (the installer should give you option)
4. Restart your terminal/command prompt

## Verifying Installation

To verify that Tesseract is installed correctly, run:

```bash
tesseract --version
```

You should see version information if the installation was successful.

## Testing with the Application

Once Tesseract is installed, run the test script to verify it works with our application:

```bash
python test_setup.py
```

You should see a message indicating that pytesseract successfully ran OCR. 