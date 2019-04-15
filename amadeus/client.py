import requests
import time

KM_API = "http://localhost:8000"

def showQuestion(question):
    res = requests.post(KM_API+"/showQuestion", data={'question': question})
    return res.status_code == 200

def showCountdown(text, duration):
    res = requests.post(KM_API+"/showCountdown", data={'text': text, 'duration': duration})
    return res.status_code == 200

def showLoading():
    res = requests.post(KM_API+"/showLoading")
    return res.status_code == 200

def showGrade(grades):
    res = requests.post(KM_API+"/showGrade", data={'grades': grades})
    return res.status_code == 200

def showError(message):
    res = requests.post(KM_API+"/showError", data={'message': message})
    return res.status_code == 200

if __name__ == "__main__":
    pass