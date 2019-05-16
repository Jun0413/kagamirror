###############################################################################
# Run on Mac
# Converted for Python2
###############################################################################

import os
import sys
import json
from time import sleep
from time import strftime

from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play
import speech_recognition as sr

import audio_preprocess
from model import predict

import client

PROMPT_MSG = "Now entering speech grader mode. Please read the intructions."
GTTS_ERR_MSG = "Sorry, speech synthesis API is not available at the moment. Please try again in few minutes."
PROC_ERR_MSG = "Sorry, we're unable to process your speech at the moment. Please try again in few minutes."

QUESTIONS = [
    "Question one. Describe a language you have learned.",
    "Question two. What is your favorite sport and why?",
    "Question three. What usually makes you happy and why?"
]

DIV_DUR = 1#sec
INSTRUCT_DUR = 3#sec
THINKING_DUR = 3#sec
RECORDING_DUR = 5#sec
RATE = 48000
CHUNK = 2048
DEVICE_ID = 2
DURATION = 10

BEEP = AudioSegment.from_mp3("beep.mp3")

with open("gcloud_credentials.json") as fp:
  GOOGLE_CLOUD_SPEECH_CREDENTIALS = fp.read()

r = sr.Recognizer()

def speak(text):
    tts = gTTS(text=text, lang="en")
    tts.save("tmp.mp3")
    qn_audio = AudioSegment.from_mp3("tmp.mp3")
    play(qn_audio)
    os.remove("tmp.mp3")

def audio_transcribe(audio_file_name, save=True):
    # call google cloud to transcribe
    with sr.AudioFile(audio_file_name) as source:
        audio = r.record(source)
    res = r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS, show_all=True)
    
    # save transcribe results
    if save:
        with open(audio_file_name.replace("wav", "json"), "w") as fp:
            json.dump(res, fp, indent=4)
        print(audio_file_name.replace("wav", "json") + " saved!")

    # return whole transcript
    return "".join([result["alternatives"][0]["transcript"] for result in res["results"]])

if __name__ == "__main__":

    log_fp = open("user.log", "w")

    """
    I. Collect recordings
    """
    sleep(DIV_DUR) # wait for Alexa speaks

    try:
        speak(PROMPT_MSG)
    except Exception as e:
        log_fp.write(str(e))
        client.showError(GTTS_ERR_MSG)
        log_fp.close()
        sys.exit()

    sleep(INSTRUCT_DUR) # wait for tester to read instructions
    
    audio_files = []
    
    for i, question in enumerate(QUESTIONS):
        # 1. ask & display question
        client.showQuestion(question)
        speak(question)
        
        # 2. wait & display thinking bar
        client.showCountdown("Thinking time left", THINKING_DUR)
        sleep(THINKING_DUR + 1)

        # 3. beep and record
        with sr.Microphone(sample_rate=RATE, chunk_size=CHUNK) as source:
            r.adjust_for_ambient_noise(source)
            play(BEEP)
            print("start recording...")
            client.showCountdown("Recording time left", RECORDING_DUR)
            audio = r.record(source, RECORDING_DUR)
            # file_name = strftime("%Y%m%d-%H%M%S") + '-%s.wav'%(i+1)
            file_name = "0-{0}.wav".format(i+1) # default user id is 0
        with open(file_name, 'wb') as fp:
            fp.write(audio.get_wav_data())
            audio_files.append(file_name)
            print("saved %s"%file_name)

    """
    II. Process audio files and predict results
    """
    try:
        client.showLoading()
        data = []

        for i, filename in enumerate(audio_files):
            
            # 1. transcribe and save to json
            text = audio_transcribe("0-{0}.wav".format(i+1))
            log_fp.write("## Transcript for question {0} ##".format(i + 1))
            log_fp.write("\n" + text + "\n")
            
            # 2. extract features from audio & json
            data.append(audio_preprocess.extract_features(0, i + 1))
            log_fp.write("## Features till question {0} ##".format(i + 1))
            log_fp.write("\n")
            for d in data:
                log_fp.write(str(d) + " ")
            log_fp.write("\n")
        
        # 3. call model to grade
        grades = predict(data)
        log_fp.write("\n### Grades for questions ###\n")
        for g in grades:
            log_fp.write(g + " ")
        client.showGrade(grades)

    except Exception as e:
        # unexpected error, such as:
        # fail to extract features; fail to call Google API, etc.
        log_fp.write("\n\n##ERROR##\n\n" + str(e))
        client.showError(PROC_ERR_MSG)
    finally:
        log_fp.close()
