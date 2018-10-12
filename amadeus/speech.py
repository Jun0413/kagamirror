import speech_recognition as sr

# instantiate a recognizer
r = sr.Recognizer()

# mic config
RATE = 48000
CHUNK = 2048
DEVICE_ID = 2

# save for debug
toSave = True

# listen to microphone til silence
with sr.Microphone(device_index=DEVICE_ID, sample_rate=RATE, chunk_size=CHUNK) as m:
    r.adjust_for_ambient_noise(m)
    print("Say something!")
    audio = r.listen(m)
    # audio = r.record(m, 3) -- record to debug

print("finish recording")

if toSave:
    print("saving to test.wav")
    with open("test_rawmic.wav", "wb") as f:
        f.write(audio.get_wav_data())

# recognize speech using Google Speech Recognition
try:
    # for testing purposes, we're just using the default API key
    # to use another API key, use `r.recognize_google(audio, key="GOOGLE_SPEECH_RECOGNITION_API_KEY")`
    # instead of `r.recognize_google(audio)`
    speech = r.recognize_google(audio)
    print("Google Speech Recognition thinks you said " + speech)
except sr.UnknownValueError:
    print("Google Speech Recognition could not understand audio")
except sr.RequestError as e:
    print("Could not request results from Google Speech Recognition service; {0}".format(e))