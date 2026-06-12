# 🤱 Hooyo AI — Maternal Health Risk Assessment & Advisory System

Hooyo AI is an AI-powered maternal health assistant designed to help pregnant women in Somalia and East Africa understand their pregnancy risk level and receive personalized health guidance.

The platform combines Machine Learning and Generative AI to provide early risk assessment and easy-to-understand maternal health advice, especially for women living in areas with limited access to healthcare services.

---

## 🌍 Problem

Maternal mortality remains a significant challenge across many developing regions. Many pregnant women do not have regular access to doctors, midwives, or prenatal screening services.

Hooyo AI aims to support early awareness by:

* Assessing maternal health risk from vital signs
* Providing personalized pregnancy guidance
* Educating women about warning signs
* Encouraging timely medical care

**Important:** Hooyo AI is not a replacement for professional healthcare providers.

---

## ✨ Features

### 🩺 Maternal Risk Prediction

Predicts pregnancy risk level using:

* Age
* Systolic Blood Pressure
* Diastolic Blood Pressure
* Blood Sugar
* Body Temperature
* Heart Rate

Risk Levels:

* 🟢 Low Risk
* 🟡 Mid Risk
* 🔴 High Risk

---

### 🤖 AI Health Advisor

Powered by Google Gemini.

Provides:

* Personalized maternal health advice
* Pregnancy safety recommendations
* Warning signs to monitor
* Clinic visit guidance

Supports:

* English
* Somali

---

### 📊 Machine Learning Model

The prediction engine uses a trained classification model based on maternal health risk data.

The model analyzes patient vital signs and predicts the most likely risk category along with confidence scores.

---

### 📱 Modern User Interface

Built with React and designed for simplicity:

* Clean mobile-friendly design
* Fast risk assessments
* Easy-to-read results
* Interactive AI consultation

---

## 🛠 Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* FastAPI
* Python

### Machine Learning

* Scikit-Learn
* Joblib
* Pandas

### Artificial Intelligence

* Google Gemini 2.5 Flash

### Deployment

* Frontend: Vercel
* Backend: Render

---

## 🚀 Live Demo

Frontend:

https://maternal-health-ai-phi.vercel.app

Backend API:

https://maternal-health-ai-1.onrender.com

API Documentation:

https://maternal-health-ai-1.onrender.com/docs

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/HamdiNur/maternal-health-ai.git
cd maternal-health-ai
```

### Backend Setup

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Create a `.env` file:

```env
GEMINI_API_KEY=your_api_key_here
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## 📡 API Endpoints

### Predict Risk Level

POST `/predict`

Example Request:

```json
{
  "age": 25,
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "blood_sugar": 6.0,
  "body_temp": 98.6,
  "heart_rate": 75
}
```

---

### AI Consultation

POST `/chat`

Example Request:

```json
{
  "message": "I feel dizzy and tired",
  "risk_level": "mid",
  "vitals": {
    "age": 25,
    "systolic_bp": 120,
    "diastolic_bp": 80,
    "blood_sugar": 6.0,
    "body_temp": 98.6,
    "heart_rate": 75
  }
}
```

---

## 🎯 Future Improvements

* Voice-based interaction
* SMS support for rural communities
* Clinic locator integration
* Offline functionality
* Pregnancy week tracking
* Multi-language support (Arabic & Swahili)
* Health worker dashboard

---

## ⚠️ Disclaimer

This project is intended for educational and awareness purposes only.

Hooyo AI does not diagnose medical conditions and should never replace qualified healthcare professionals.

Always seek advice from a doctor, nurse, midwife, or healthcare provider regarding pregnancy-related concerns.

---

## 👨‍💻 Author

**Hamdi Nur**

AI & Full-Stack Developer

GitHub:
https://github.com/HamdiNur
