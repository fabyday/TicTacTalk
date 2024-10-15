import tests 

import wave 
import src.Commons.path_finder as path_finder
import src.Commons.Audio.audio_manager as ad 

import os.path as osp
import threading



i_info = ad.AudioManager().enumerate_input_device()[1]
o_info = ad.AudioManager().enumerate_output_device()[1]
print(i_info)
print(o_info)

w1 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "1.wav"), "rb")
w2 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "2.wav"), "rb")
        
audiv = ad.AudioManager().create_output_device(o_info)
print(audiv)
print("getnframes : " , w1.getnframes())
print("getnframes : " , w2.getnframes())
print("getframerate : " , w1.getframerate())
print("getframerate : " , w2.getframerate())
print("sample width : " , w1.getsampwidth())
print("sample width : " , w2.getsampwidth())
print("sample width : " , w1.getnchannels())
print("sample width : " , w2.getnchannels())
i = 0 

import time
import numpy as np 
import time 
import src.Commons.Audio as audio


def audio_data_producer():
    
    frames = 0
    while frames < w2.getnframes() :
        bb = w2.readframes(ad.CHUNK)
        bb2 = w1.readframes(ad.CHUNK)
        print(len(bb), len(bb2))
        if len(bb) == 0 or len(bb2) == 0 :
            break
        bb = audio.stereo2mono(bb, w2.getnchannels(), np.int16)
        bb2 = audio.stereo2mono(bb2, w1.getnchannels(), np.int16)
        merged_bb = audio.merge_mono_audio_chunks(np.int16, bb, bb2)
        frames += ad.CHUNK
        audiv.put_audio(merged_bb)
        
tt = threading.Thread(target=audio_data_producer)
tt.start()
while audiv.get_ad().is_active():
    time.sleep(1)
tt.join()