import logging
from flask_cors import CORS
from flask import Flask, request, jsonify, redirect
from emotion_analyzer import infer_emotion
from fitbit_auth import get_authorize_url, get_token, exchange_code_for_token
from fitbit_api import get_heart_rate, get_spo2, get_calories, get_activity_level

# Logging 설정
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://aurora-lighting-system.vercel.app"}})

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

    # emotion = infer_emotion(heart_rate, spo2, calories, activity)
    # return jsonify({"emotion": emotion})
    emotion, debug_info = infer_emotion(heart_rate, spo2, calories, activity)
    return jsonify({
        "emotion": emotion,
        "calculation": debug_info
    })

app.secret_key = "super_secret"  # Render에서 환경변수로 관리 추천

# 임시 저장용 (파일/DB도 가능)
token_store = {}

@app.route("/authorize")
def authorize():
    try:
        print("🔍 /authorize 호출됨")
        url = get_authorize_url()
        print("✅ Fitbit 인증 URL 생성됨:", url)
        return redirect(url)
    except Exception as e:
        print("❌ /authorize 에러 발생:", str(e))
        return jsonify({"error": "internal server error", "detail": str(e)}), 500
    # return redirect(get_authorize_url())

@app.route("/callback")
def callback():
    code = request.args.get("code")
    print("code:", code) 
    
    token_data = exchange_code_for_token(code)
    access_token = token_data.get("access_token")

    token_store["access_token"] = access_token

    if access_token:
        # access_token을 query로만 전달하고 hash는 제거
        return redirect(f"https://aurora-lighting-system.vercel.app/?access_token={access_token}")
    else:
        return jsonify({"error": "Token 요청 실패", "detail": token_data})
    
@app.route("/emotion-now", methods=["POST"])
def emotion_now():
    try:
        token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM1FIWlMiLCJzdWIiOiJDSzlHM0giLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyb3h5IHJociByYWN0IiwiZXhwIjoxNzQ4MzczMDM1LCJpYXQiOjE3NDgzNDQyMzV9.T7ihLAKdhpKWJv4zE3nxAslmAfBWUb-ScLIXaTgo0-M"

        hr, hr_log = get_heart_rate(token)
        spo2, spo2_log = get_spo2(token)
        cal, cal_log = get_calories(token)
        act, act_log = get_activity_level(token)
        emotion = infer_emotion(hr, spo2, cal, act)

        return jsonify({
            "emotion": emotion,
            "debug": {
                "token": token,
                "hr": hr,
                "spo2": spo2,
                "cal": cal,
                "act": act,
                "logs": {
                    "heart_rate": hr_log,
                    "spo2": spo2_log,
                    "calories": cal_log,
                    "activity": act_log
                }
            }
        })
    except Exception as e:
        return jsonify({"error": "예외 발생", "message": str(e)})