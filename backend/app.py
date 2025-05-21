from flask import Flask, request, jsonify, redirect
from emotion_analyzer import infer_emotion
from fitbit_auth import get_authorize_url, get_token

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

app.secret_key = "super_secret"  # Render에서 환경변수로 관리 추천

# 임시 저장용 (파일/DB도 가능)
token_store = {}

@app.route("/authorize")
def authorize():
    url = get_authorize_url()
    print("✅ Fitbit 인증 URL:", url)  # Render 로그에 출력됨
    return redirect(url)
    # return redirect(get_authorize_url())

@app.route("/callback")
def callback():
    code = request.args.get("code")
    token_data = get_token(code)

    if "access_token" in token_data:
        token_store["access_token"] = token_data["access_token"]
        return "✅ 로그인 성공! 이제 데이터 요청이 가능합니다."
    else:
        return jsonify({"error": "Token 요청 실패", "detail": token_data})

@app.route("/emotion-now")
def emotion_now():
    token = token_store.get("access_token")
    if not token:
        return jsonify({"error": "로그인 안됨"}), 401

    headers = {"Authorization": f"Bearer {token}"}
    resp = requests.get("https://api.fitbit.com/1/user/-/activities/heart/date/today/1d/1min.json", headers=headers)

    if resp.status_code != 200:
        return jsonify({"error": "토큰 만료 또는 오류", "detail": resp.json()}), 401

    # 예시: 최근 심박수 추출
    heart_data = resp.json()["activities-heart-intraday"]["dataset"]
    latest_heart = heart_data[-1]["value"] if heart_data else 75

    emotion = infer_emotion(latest_heart, spo2=97)  # 임시로 spo2 하드코딩
    return jsonify({"emotion": emotion})