from flask_cors import CORS
from flask import Flask, request, jsonify, redirect
from emotion_analyzer import infer_emotion
from fitbit_auth import get_authorize_url, get_token, exchange_code_for_token

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

    emotion = infer_emotion(heart_rate, spo2, calories, activity)
    return jsonify({"emotion": emotion})

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
    data = request.get_json()
    token = data.get("access_token")   # ✅ 프론트에서 전달받은 토큰 사용!

    print("🔐 전달받은 토큰:", token)

    if not token:
        return jsonify({"error": "로그인 안됨"}), 401

    hr = get_heart_rate(token)
    spo2 = get_spo2(token)
    cal = get_calories(token)
    act = get_activity_level(token)

    print(f"🔍 받은 데이터: HR={hr}, SpO₂={spo2}, 칼로리={cal}, 활동={act}")

    emotion = infer_emotion(hr, spo2, cal, act)
    return jsonify({"emotion": emotion})
    # headers = {"Authorization": f"Bearer {token}"}
    # resp = requests.get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json", headers=headers)

    # if resp.status_code != 200:
    #     return jsonify({"error": "토큰 만료 또는 오류", "detail": resp.json()}), 401

    # # 예시: 최근 심박수 추출
    # heart_data = resp.json()["activities-heart-intraday"]["dataset"]
    # latest_heart = heart_data[-1]["value"] if heart_data else 75

    # emotion = infer_emotion(latest_heart, spo2=97)  # 임시로 spo2 하드코딩
    # return jsonify({"emotion": emotion})