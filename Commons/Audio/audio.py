import pyaudio 
from queue import Queue
import numpy as np 
import opuslib



CHUNK = 1024*10
CHUNK = int(44100/4.0) # 0.25sec
CHUNK = 2880 # 0.25sec

# CHUNK = 44100
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
RATE = 48000
# RATE = 1000
RECORD_SECONDS = 5
# see also  https://github.com/orion-labs/opuslib/issues/11
# 480, 960, 1920, and 2880

opus_encoder = opuslib.Encoder(fs = RATE, channels=1, application="voip")
opus_decoder = opuslib.Decoder(fs = RATE, channels=1)


queue = Queue(100)

audio_manager = pyaudio.PyAudio()


stream = audio_manager.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)

stream = None 
audio_manager = None 
def init():
    global audio_manager
    if not audio_manager:
        audio_manager = pyaudio.PyAudio()

def deinit():
    global audio_manager
    if audio_manager :
        audio_manager.terminate()

def audio_open(input_device_index = 0, output_device_index = 0):
    global stream
    if  stream :
        audio_close()
    print(list(filter(lambda x : x.get("index") == input_device_index, enumerate_input_device())))
    print(list(filter(lambda x : x.get("index") == output_device_index, enumerate_output_device())))
    input_item = list(filter(lambda x : x.get("index") == input_device_index, enumerate_input_device()))[0]
    output_item = list(filter(lambda x : x.get("index") == output_device_index, enumerate_output_device()))[0]

    input_item_max_channel = input_item.get("maxInputChannels") if input_item.get("maxInputChannels") >= input_item.get("maxOutputChannels") else input_item.get("maxOutputChannels")
    output_item_max_channel = output_item.get("maxInputChannels") if output_item.get("maxInputChannels") >= output_item.get("maxOutputChannels") else output_item.get("maxOutputChannels")
    max_channel = output_item_max_channel if output_item_max_channel > input_item_max_channel else input_item_max_channel
    print("max", max_channel)
    stream = audio_manager.open(format=FORMAT,
                        channels=1,
                        rate=RATE,
                        input_device_index=input_device_index,
                        output_device_index = output_device_index,
                        input=True,
                        output=True)

    # # Play samples from the wave file (3)
    # while len(data := wf.readframes(CHUNK)):  # Requires Python 3.8+ for :=
    #     # stream.write(data)
    #     data = stream.read(1024)
    #     stream.write(data)




def audio_close():
    global stream

    if stream:
        stream.close()

# output_stream = p.open(format=p.get_format_from_width(stream.getsampwidth()),
#                 channels=1,
#                 rate=RATE,
#                 output=True)

# data = output_stream.readframes(CHUNK)

# while data != '':
#     stream.write(data)
#     data = output_stream.readframes(CHUNK)

# stream.stop_stream()
# stream.close()

# p.terminate()

output_queue = Queue(100)



#use it in thread
def read_input():
    global queue
    while True : 
        data = stream.read(CHUNK, exception_on_overflow=False)
        queue.put(data)

# transfer
def get_input():
    global queue
    return queue.get()

def write_output_queue(data):
    global output_queue
    output_queue.put(data)


def write_output():
    global output_queue
    while True:
        # print(output_queue.get())
        if (data:= output_queue.get()) :
            stream.write(data)


def get_device_nums():
    global audio_manager
    info = audio_manager.get_host_api_info_by_index(0)
    f = info.get("deviceCount")
    return f


def enumerate_input_device():
    global audio_manager
    f = get_device_nums()

    res = []
    for i in range(f):
        dev_info = audio_manager.get_device_info_by_host_api_device_index(0, i)
        a = dev_info.get("maxInputChannels")
        if a>0:
            res.append(dev_info)
    return res



def enumerate_output_device():
    global audio_manager

    f = get_device_nums()
    res = []
    for i in range(f):
        dev_info = audio_manager.get_device_info_by_host_api_device_index(0, i)
        a = dev_info.get("maxOutputChannels")
        if a>0:
            res.append(dev_info)
    return res


def select_input_output_device(in_index = None, out_index = None):
    audio_open(in_index, out_index)




if __name__ == "__main__":
    print(list(map(lambda x : x.get("name"), enumerate_input_device())))
    print(list(map(lambda x : x.get("name"), enumerate_output_device())))
