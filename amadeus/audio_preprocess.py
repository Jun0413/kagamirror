"""
Input:

audio_folder_dir, containing
<PERSON_ID>_<QUESTION_ID>.wav
<PERSON_ID>_<QUESTION_ID>.json

Output:

single CSV file, row attributes
- person_id
- question_id
- avg_words_per_chunk
- speech_rate
- unique_words_per_speech
- transcribe_confidence
- lang_score = 1
"""
import os
import json
from subprocess import check_output

"""
Configuration
"""
THRESH_HOLD = 70
NUM_PERSONS = 18
SPEECH_DUR = 20.0


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
    print(chunks)
    return chunks


def get_words_per_chunk(trans_res, chunks):
    # flat words into a single list
    results = trans_res['results']
    merged_words = []
    for result in results:
        merged_words += result['alternatives'][0]['words']
    
    # count words in each chunk
    words_per_chunk = []
    for chunk in chunks:
        splt_chk = chunk.split(" ")
        chk_start = float(splt_chk[0])
        chk_end = float(splt_chk[-1])
        num_words = 0
        startFound = False
        len_merged_words = len(merged_words)
        for i, word in enumerate(merged_words):
            word_start = float(word["startTime"][:-1])
            word_end = float(word["endTime"][:-1])
            chk_start_in_word = chk_start >= word_start and chk_start < word_end
            chk_end_in_word = chk_end <= word_end and chk_end > word_start
            lastWord = (i == len_merged_words - 1)
            if chk_start_in_word and (chk_end_in_word or lastWord):
                num_words += 1
                words_per_chunk.append(num_words)
                break
            if startFound:
                num_words += 1
                if chk_end_in_word or lastWord:
                    words_per_chunk.append(num_words)
                    break
            else:
                if chk_start_in_word:
                    startFound = True
                    num_words += 1

    # process number of words (return average)
    print(words_per_chunk)
    return words_per_chunk


def extract_features(person_id, question_id):

    # read data and execute auditok
    file_name = "{0}-{1}".format(person_id, question_id)
    audio_file_name = "%s.wav"%file_name
    res_file_name = "%s.json"%file_name
    if os.path.exists(audio_file_name) and os.path.exists(res_file_name):
        pass
    else:
        print("Given ID %s does not exist"%file_name)
        return
    fp = open(res_file_name, 'r')
    trans_res = json.load(fp)
    chunks = auditok_wrapper(audio_file_name)
    fp.close()

    # get speech_rate and unique_words_per_speech
    speech_rate = -1
    unique_words_per_speech = -1
    words = []
    utt_dur = 0
    results = trans_res['results']
    for result in results:
        words_level = result['alternatives'][0]['words']
        words += [wl['word'] for wl in words_level]
        utt_dur += (float(words_level[-1]['endTime'][:-1]) - float(words_level[0]['startTime'][:-1]))
    speech_rate = len(words) / SPEECH_DUR
    unique_words_per_speech = len(set(words)) / utt_dur

    # get average words per chunk
    words_per_chunk = get_words_per_chunk(trans_res, chunks)
    avg_words_per_chunk = sum(words_per_chunk) / float(len(words_per_chunk))

    # get average transcribe confidence
    transcribe_confidence = sum([result['alternatives'][0]['confidence'] for result in results]) / len(results)

    # substitute language score with 1
    data = [avg_words_per_chunk, speech_rate, unique_words_per_speech, transcribe_confidence, 1]
    print(data)
    return data


if __name__ == '__main__':
    # test
    extract_features(14, 3)