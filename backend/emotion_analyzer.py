ACTIVITY_LEVEL_MAP = {
    'SEDENTARY': 0,
    'LIGHTLY_ACTIVE': 1,
    'FAIRLY_ACTIVE': 2,
    'VERY_ACTIVE': 3
}

# def infer_emotion(heartRate, spo2, calories=None, activity=None):
#     try:
#         heartRate = float(heartRate)
#         spo2 = float(spo2)
#         calories = float(calories) if calories is not None else None
#         activity = float(activity) if activity is not None else None
#     except (ValueError, TypeError):
#         return "불충분"

#     if heartRate >= 88 and spo2 >= 96:
#         return "집중"
#     elif heartRate >= 85 and calories and calories >= 4.0:
#         return "집중"
#     elif heartRate >= 92 and spo2 < 95:
#         return "스트레스"
#     elif heartRate < 72 and spo2 >= 96:
#         return "이완"
#     elif heartRate < 68 and spo2 < 95:
#         return "피로"
#     else:
#         return "보통"

def infer_emotion(heart_rate, spo2, calories, activity_level):
    # 예시 계산 과정
    score = (heart_rate - 60) * 0.6 + (100 - spo2) * 1.2 + calories * 0.05 + activity_level * 2
    emotion = "stressed" if score > 50 else "happy"

    # 계산식 디버그용 문자열 생성
    debug_info = (
        f"score = (HR({heart_rate}) - 60) * 0.6 + (100 - SPO2({spo2})) * 1.2 "
        f"+ CAL({calories}) * 0.05 + ACT({activity_level}) * 2 = {score:.2f}"
    )

    return emotion, debug_info