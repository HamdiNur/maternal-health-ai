from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
import joblib
import pandas as pd
import os

load_dotenv()

# --- LOAD TRAINED MODEL ---
model = joblib.load("maternal_health_model.pkl")
label_encoder = joblib.load("label_encoder.pkl")

# --- GEMINI SETUP ---
API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=API_KEY)

SYSTEM_PROMPT = """
You are Hooyo AI, a warm and caring maternal health advisor built specifically 
for pregnant women in Somalia and East Africa.

You receive a patient's vital signs and their AI-predicted risk level.
Your job is to:
1. Explain what the risk level means in simple, calm language
2. Give 3 specific things the woman should do right now
3. List danger signs she must watch for
4. Tell her clearly whether she needs to go to a clinic urgently or can wait

VERY IMPORTANT RULES:
- If risk is HIGH: be urgent but calm — tell her to go to a clinic or hospital TODAY
- If risk is MID: be cautious — tell her to see a health worker within 3 days
- If risk is LOW: be reassuring — give healthy pregnancy tips
- Always end with: "This AI does not replace a real doctor. Please always consult a health worker."
- If the user writes in Somali, respond fully in Somali
- If the user writes in English, respond in English
- Use simple words — many users have limited literacy
- Be warm, like a trusted older sister or community health worker
- Always mention nearest clinic or health post if they describe their location

SOMALIA CONTEXT:
- Major hospitals: Mogadishu General Hospital, Hargeisa Group Hospital, Garowe General Hospital
- Emergency number in Somalia: 888
- Common danger signs in pregnancy: heavy bleeding, severe headache, blurred vision, 
  high fever, no fetal movement, severe swelling of face/hands
- Many women are far from clinics — give advice for both urban and rural situations
"""

app = FastAPI(title="Hooyo AI — Maternal Health Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- INPUT MODELS ---
class VitalSigns(BaseModel):
    age: float
    systolic_bp: float
    diastolic_bp: float
    blood_sugar: float
    body_temp: float
    heart_rate: float

class ChatMessage(BaseModel):
    message: str
    risk_level: str
    vitals: VitalSigns

# --- ROUTES ---
@app.get("/")
def home():
    return {"status": "Hooyo AI is running ✅", "model": "Maternal Health Risk Classifier v1.0"}

@app.post("/predict")
def predict(vitals: VitalSigns):
    try:
        # Create DataFrame with correct column names
        input_df = pd.DataFrame([[
            vitals.age,
            vitals.systolic_bp,
            vitals.diastolic_bp,
            vitals.blood_sugar,
            vitals.body_temp,
            vitals.heart_rate
        ]], columns=["Age", "SystolicBP", "DiastolicBP", "BS", "BodyTemp", "HeartRate"])

        # Predict risk level
        prediction = model.predict(input_df)
        probabilities = model.predict_proba(input_df)[0]
        risk_level = label_encoder.inverse_transform(prediction)[0]
        confidence = round(max(probabilities) * 100, 1)

        # Get all probabilities
        risk_probs = {}
        for i, label in enumerate(label_encoder.classes_):
            risk_probs[label] = round(probabilities[i] * 100, 1)

        return {
            "risk_level": risk_level,
            "confidence": confidence,
            "probabilities": risk_probs,
            "status": "success"
        }

    except Exception as e:
        return {"error": str(e), "status": "failed"}

@app.post("/chat")
def chat(data: ChatMessage):
    try:
        # Build context message for Gemini
        prompt = f"""
Patient vital signs:
- Age: {data.vitals.age} years
- Blood Pressure: {data.vitals.systolic_bp}/{data.vitals.diastolic_bp} mmHg
- Blood Sugar: {data.vitals.blood_sugar} mmol/L
- Body Temperature: {data.vitals.body_temp}°F
- Heart Rate: {data.vitals.heart_rate} bpm

AI Risk Assessment: {data.risk_level.upper()}

Patient message: {data.message}

Please provide personalized maternal health advice based on these vitals and risk level.
"""

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
            contents=prompt
        )

        return {"reply": response.text, "status": "success"}

    except Exception as e:
        error_msg = str(e)
        if "503" in error_msg or "UNAVAILABLE" in error_msg:
            return {"reply": "⚠️ AI advisor is temporarily busy. Your risk level result above is still accurate. Please try again in 1 minute.", "status": "busy"}
        elif "429" in error_msg:
            return {"reply": "⚠️ Too many requests. Please wait a moment and try again.", "status": "limited"}
        else:
            return {"reply": "⚠️ Something went wrong. Please try again.", "status": "error"}