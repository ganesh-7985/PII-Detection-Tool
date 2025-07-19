# PII Detection & Masking Tool

A comprehensive web application for detecting and masking Personally Identifiable Information (PII) in images and PDF documents. This tool combines OCR (Optical Character Recognition), natural language processing, and machine learning to identify sensitive information and provide an interactive review interface.

## 🚀 Features

### Core Functionality
- **Multi-format Support**: Process images (JPG, PNG) and PDF documents
- **Advanced OCR**: Extract text from images using EasyOCR and Google Cloud Vision
- **PII Detection**: Identify various types of sensitive information:
  - Email addresses
  - Phone numbers (Indian format)
  - Aadhaar numbers
  - Names and personal identifiers
  - Dates and birth dates
  - Addresses
- **Multi-language Support**: Detect and process text in multiple languages
- **Confidence-based Flagging**: Automatically flag low-confidence detections for review
- **Interactive Review**: Manual review and approval system for flagged detections
- **Real-time Processing**: Background job processing with status updates

### User Interface
- **Modern React Frontend**: Built with React 19 and Vite
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Live status updates during processing
- **Interactive Preview**: Visual overlay of detected PII on processed images
- **Review Panel**: Easy approval/rejection of flagged detections

## 🏗️ Architecture

### Backend (FastAPI)
```
backend/
├── app/
│   ├── api/
│   │   └── endpoints.py          # REST API endpoints
│   ├── core/
│   │   ├── language_detection.py # Language detection logic
│   │   ├── ocr.py               # OCR processing
│   │   ├── pii_detection.py     # PII detection algorithms
│   │   └── schemas.py           # Pydantic data models
│   ├── utils/
│   │   └── image_mask.py        # Image masking utilities
│   ├── jobs.py                  # Background job processing
│   └── main.py                  # FastAPI application entry
└── requirements.txt             # Python dependencies
```

### Frontend (React)
```
frontend/
├── components/
│   ├── ImageUpload.jsx          # File upload component
│   ├── LanguageSwitch.jsx       # Language selection
│   ├── LoadingSpinner.jsx       # Loading indicators
│   ├── PreviewBox.jsx           # Image preview with overlays
│   ├── ReviewPanel.jsx          # PII review interface
│   └── StatusCard.jsx           # Processing status display
├── services/
│   └── api.js                   # API client functions
├── src/
│   ├── App.jsx                  # Main application component
│   └── main.jsx                 # React entry point
└── package.json                 # Node.js dependencies
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **EasyOCR**: OCR library for text extraction from images
- **Google Cloud Vision**: Advanced OCR and image analysis
- **spaCy**: Natural language processing for entity recognition
- **OpenCV**: Image processing and manipulation
- **Pillow**: Python Imaging Library
- **PyPDFium2**: PDF processing and conversion
- **Pydantic**: Data validation and serialization

### Frontend
- **React 19**: Latest React with modern features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **ESLint**: Code linting and formatting

## 📋 Prerequisites

- Python 3.8+
- Node.js 18+
- Google Cloud Vision API credentials (optional, for enhanced OCR)
- 4GB+ RAM (recommended for processing large documents)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd pii-detection
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Set up Google Cloud credentials (optional)
export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Build for production (optional)
npm run build
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Server**
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Production Mode

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Serve with Production Server**
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📖 Usage Guide

### 1. Upload Document
- Click "Choose File" to select an image or PDF
- Supported formats: JPG, PNG, PDF
- Maximum file size: 10MB

### 2. Language Selection
- Choose the primary language(s) for text detection
- Multiple languages can be selected for better accuracy

### 3. Processing
- The system will automatically:
  - Extract text using OCR
  - Detect PII using NLP and regex patterns
  - Flag low-confidence detections
  - Generate a masked version of the image

### 4. Review and Approve
- Review flagged detections in the review panel
- Approve or reject each detection
- Submit your decisions

### 5. Download Results
- View the processed image with PII masked
- Download the final result

## 🔧 Configuration

### Environment Variables
```bash
# Google Cloud Vision API (optional)
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json

# Server Configuration
HOST=0.0.0.0
PORT=8000
```

### PII Detection Patterns
The system uses regex patterns and NLP models to detect:
- **Emails**: `[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}`
- **Phone Numbers**: Indian format `\b[6-9]\d{9}\b`
- **Aadhaar**: `\b\d{4}\s?\d{4}\s?\d{4}\b`
- **Dates**: `\b(\d{2}[\-/]\d{2}[\-/]\d{4})\b`
- **Names**: Detected using spaCy NER
- **Addresses**: Pattern-based detection

## 🔒 Security Features

- **File Size Limits**: 10MB maximum file size
- **File Type Validation**: Only allowed image and PDF formats
- **Temporary Storage**: Files are stored temporarily and cleaned up
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive input validation using Pydantic

## 🧪 API Endpoints

### POST `/upload`
Upload an image or PDF for PII detection
- **Parameters**: `file` (UploadFile), `languages` (List[str])
- **Response**: `{"job_id": "uuid"}`

### GET `/jobs/{job_id}/status`
Get processing status
- **Response**: `{"status": "pending|processing|completed|failed"}`

### GET `/jobs/{job_id}/result`
Get processing results
- **Response**: `{"image_base64": "...", "detections": [...], "flagged": [...]}`

### POST `/review/{job_id}`
Submit review decisions
- **Body**: `{"decisions": [{"id": "...", "approved": true}]}`

## 🐛 Troubleshooting

### Common Issues

1. **OCR Not Working**
   - Ensure EasyOCR is properly installed
   - Check if the image quality is sufficient
   - Verify language support

2. **Google Cloud Vision Errors**
   - Verify credentials are properly set
   - Check API quotas and billing
   - Ensure the service account has Vision API access

3. **Memory Issues**
   - Reduce image resolution
   - Process smaller files
   - Increase system RAM

4. **Frontend Build Errors**
   - Clear node_modules and reinstall
   - Update Node.js to latest LTS version
   - Check for conflicting dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- EasyOCR for text extraction capabilities
- spaCy for natural language processing
- Google Cloud Vision for advanced OCR
- FastAPI for the robust backend framework
- React and Vite for the modern frontend experience

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/docs`
- Review the troubleshooting section above

---

**Note**: This tool is designed for educational and development purposes. Always ensure compliance with data protection regulations when processing sensitive information in production environments.
