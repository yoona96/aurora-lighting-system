import requests
import datetime

def get_heart_rate(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/heart/date/{today}/1d/1min.json"
    res = requests.get(url, headers=headers)
    print("✅ Fitbit 응답 상태코드:", res.status_code)
    print("✅ 응답 내용:", res.text)
    try:
        res = res.json()
        series = res["activities-heart-intraday"]["dataset"]
        if not series:
            return None
        return series[-1]["value"]  # 가장 마지막 값
    except:
        return None

def get_spo2(token):
    headers = {"Authorization": f"Bearer {token}"}
    url = "https://api.fitbit.com/1/user/-/spo2/date/today.json"
    res = requests.get(url, headers=headers)
    print("✅ Fitbit 응답 상태코드:", res.status_code)
    print("✅ 응답 내용:", res.text)
    try:
        res = res.json()
        return res["spo2"]["value"]
    except:
        return 97  # 값 없을 경우 대체값

def get_activity_level(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/date/{today}.json"
    res = requests.get(url, headers=headers)
    print("✅ Fitbit 응답 상태코드:", res.status_code)
    print("✅ 응답 내용:", res.text)
    try:
        res = res.json()
        lightly = res["summary"]["lightlyActiveMinutes"]
        fairly = res["summary"]["fairlyActiveMinutes"]
        very = res["summary"]["veryActiveMinutes"]
        if very > 30:
            return 3
        elif fairly > 30:
            return 2
        elif lightly > 30:
            return 1
        else:
            return 0
    except:
        return 0

def get_calories(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/date/{today}.json"
    res = requests.get(url, headers=headers)
    try:
        res = res.json()
        return res["summary"]["caloriesOut"] / 24 / 60  # 1분당 가정
    except:
        return 3.0
