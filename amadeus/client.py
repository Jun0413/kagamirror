import requests
import time

KM_API = "http://localhost:3000"

def showQuestion(question):
    res = requests.post(KM_API+"/showQuestion", data={'question': question})
    return res.status_code == 200

if __name__ == "__main__":
    pass