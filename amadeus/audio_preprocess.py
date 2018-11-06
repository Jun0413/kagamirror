"""
Input:

audio_folder_dir, containing
<PERSON_ID>_<QUESTION_ID>.wav
<PERSON_ID>_<QUESTION_ID>.json

Output:

single CSV file, row attributes
- person_id
- question_id
- words_per_chunk
- speech_rate
- unique_words_per_speech
- transcribe_confidence
- lang_score = 1
"""
import os
import subprocess
from subprocess import Popen, PIPE, call, check_output

"""
Configuration
"""
THRESH_HOLD = 70

def concat(chunks):
    concat_chunks = []
    prev_idx = -1
    for i in range(len(chunks)):
        if i == 0:
            concat_chunks.append(chunks[i])
        else:
            splt_last_chunk = concat_chunks[-1].split(" ")
            splt_cur_chunk = chunks[i].split(" ")
            if splt_last_chunk[-1] == splt_cur_chunk[0]:
                temp = concat_chunks[-1].split(" ")
                temp[-1] = splt_cur_chunk[-1]
                concat_chunks[-1] = " ".join(temp)
            else:
                concat_chunks.append(chunks[i])
    return concat_chunks


def auditok_wrapper(wav_file_name):
    # get output
    output = check_output(["auditok", "-i%s"%wav_file_name, "-e%d"%THRESH_HOLD])
    # convert output to chunks
    chunks = [" ".join(chk.split(" ")[1:]) for chk in output.split("\n")[:-1]]
    # concatenate chunks
    chunks = concat(chunks)
    # print(chunks)
    return chunks

if __name__ == '__main__':
    # test
    auditok_wrapper('13-1.wav')