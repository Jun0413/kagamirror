import json
import time
import threading
try:
    import Tkinter as tk # python2
except ImportError:
    import tkinter as tk # python3
import speech_recognition as sr

# configurations
"""
...
"""
RATE = 48000
CHUNK = 2048
DEVICE_ID = 2
DURATION = 10

with open("gcloud_credentials.json") as fp:
  GOOGLE_CLOUD_SPEECH_CREDENTIALS = fp.read()

r = sr.Recognizer()

class countdown_thread(threading.Thread):
    def run(self):
        for t in range(DURATION, -1, -1):
            sf = "{:02d}:{:02d}".format(*divmod(t, 60))
            time_str.set(sf)
            root.update()
            time.sleep(1)

class audiorecord_thread(threading.Thread):
    def run(self):
        with sr.Microphone(device_index=DEVICE_ID, sample_rate=RATE, chunk_size=CHUNK) as source:
            r.adjust_for_ambient_noise(source)
            countdown_thread().start()
            audio = r.record(source, DURATION)
        with open(e.get() + '.wav', 'wb') as fp:
            fp.write(audio.get_wav_data())
            fn_msg.set(e.get() + ".wav saved!")

def fn_saved():
    fn_msg.set("File name: " + e.get() + ".wav")
    root.update()

def start_record():
    # countdown_thread().start()
    audiorecord_thread().start()

def transcribe():
    fn = e.get() + ".wav"
    with sr.AudioFile(fn) as source:
        audio = r.record(source)
    res = r.recognize_google_cloud(audio, credentials_json=GOOGLE_CLOUD_SPEECH_CREDENTIALS, show_all=True)
    with open(e.get() + ".json", "w") as fp:
        json.dump(res, fp, indent=4)
    fn_msg.set(e.get() + ".json saved!")
    trans_text.set(res["results"][0]["alternatives"][0]["transcript"])

root = tk.Tk()

# window title
root.title("Audio Collector")

# prompt file name
tk.Label(root, text="Set file name (no suffix)").pack()

# enter file name
e = tk.Entry(root)
e.pack()
e.focus_set()

# indicate file name
fn_msg = tk.StringVar()
tk.Label(root, textvariable=fn_msg).pack()

# save file name
b = tk.Button(root, text="ok", command=fn_saved)
b.pack()

# countdown timer
time_str = tk.StringVar()
label_font = ('helvetica', 40)
tk.Label(root, textvariable=time_str, font=label_font, bg='white', fg='blue', relief='raised', bd=3).pack(fill='x', padx=5, pady=5)
tk.Button(root, text='record', command=start_record).pack()

# transcribe audio file
tk.Button(root, text='transcribe', command=transcribe).pack()

# transcribed text
trans_text = tk.StringVar()
tk.Label(root, textvariable=trans_text, bg='white', wraplength=500).pack(padx=5, pady=5)

root.mainloop()
