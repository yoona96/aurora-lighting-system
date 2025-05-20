from flask import Flask, request, jsonify
from emotion_analyzer import infer_emotion

app = Flask(__name__)

@app.route("/")
def home():
    return "✅ Emotion API is running!"

@app.route("/analyze-emotion", methods=["POST"])
def analyze():
    data = request.json
    heart_rate = data.get("heartRate")
    spo2 = data.get("spo2")
    calories = data.get("calories")
    activity = data.get("activityLevel")

    emotion = infer_emotion(heart_rate, spo2, calories, activity)
    return jsonify({"emotion": emotion})