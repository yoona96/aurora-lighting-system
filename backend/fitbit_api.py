import requests
import datetime

def get_heart_rate(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/heart/date/{today}/1d/1min.json"

    try:
        res = requests.get(url, headers=headers)
        status = res.status_code
        raw = res.text

        data = res.json()
        series = data.get("activities-heart-intraday", {}).get("dataset", [])
        if not series:
            return None, f"📭 HR: 빈 데이터셋 - status {status}, res {raw[:150]}"
        return series[-1]["value"], f"✅ HR OK - {series[-1]['value']}"
    except Exception as e:
        return 75, f"❌ HR 실패 (fallback=75) - {str(e)}"


def get_spo2(token):
    headers = {"Authorization": f"Bearer {token}"}
    url = "https://api.fitbit.com/1/user/-/spo2/date/today.json"

    try:
        res = requests.get(url, headers=headers)
        status = res.status_code
        raw = res.text

        data = res.json()
        value = data.get("spo2", {}).get("value", 97)
        return value, f"✅ SpO2 OK - {value}"
    except Exception as e:
        return 97, f"❌ SpO2 실패 - {str(e)}"


def get_activity_level(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/date/{today}.json"

    try:
        res = requests.get(url, headers=headers)
        status = res.status_code
        raw = res.text

        data = res.json()
        summary = data.get("summary", {})
        lightly = summary.get("lightlyActiveMinutes", 0)
        fairly = summary.get("fairlyActiveMinutes", 0)
        very = summary.get("veryActiveMinutes", 0)

        if very > 30:
            level = 3
        elif fairly > 30:
            level = 2
        elif lightly > 30:
            level = 1
        else:
            level = 0

        return level, f"✅ 활동량 OK - level {level} (L:{lightly} / F:{fairly} / V:{very})"
    except Exception as e:
        return 0, f"❌ 활동량 실패 - {str(e)}"


def get_calories(token):
    headers = {"Authorization": f"Bearer {token}"}
    today = datetime.date.today().isoformat()
    url = f"https://api.fitbit.com/1/user/-/activities/date/{today}.json"

    try:
        res = requests.get(url, headers=headers)
        status = res.status_code
        raw = res.text

        data = res.json()
        cal = data.get("summary", {}).get("caloriesOut", 4320) / (24 * 60)
        return cal, f"✅ 칼로리 OK - {cal:.2f} cal/min"
    except Exception as e:
        return 3.0, f"❌ 칼로리 실패 - {str(e)}"
