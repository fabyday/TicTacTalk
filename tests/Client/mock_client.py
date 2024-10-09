import socket

import tests
import src.Commons.Audio.audio as audio 
import queue 


import struct
import src.Commons.Data.room as room 

 
class Client:
    def __init__(self):
        self.sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        audio.init()
    def run(self):
        
        self.init_audio()
        # self.sock.sendto(("localhost", 9090))
        while True : 
            print(b"test".__sizeof__())
            self.sock.sendto(b"test", ("localhost", 9090))
            # self.sock.recvfrom(1000)
            
    def init_audio(self):
        audio.init()
        Room = room.Room()

        self.buffer1 = queue.Queue()
        self.buffer2 = queue.Queue()
        for i in audio.enumerate_input_device():
            print("index : {}, name : {} max input channels : {}".format(i.get("index"), i.get("name"), i.get("maxInputChannels")))
        input_index = input("select index : ")
        try:
            input_index = int(input_index)
        except:
            input_index = 0
            print("except")

        finally:
            print(audio.get_device_nums(), input_index)
            print(0<input_index)
            print(input_index >= audio.get_device_nums())
            if 0>input_index or input_index >= audio.get_device_nums():
                input_index = 0
        
        for i in audio.enumerate_output_device():
            print("index : {}, name : {} maxInput channels : {} maxOutput channels : {}".format(i.get("index"), i.get("name"), i.get("maxInputChannels"), i.get("maxOutputChannels")))
        output_index = input("select index : ")
        try:
            output_index = int(output_index)
        except:
            output_index = 0
            print("except")
        finally:
            if 0>output_index or output_index >= audio.get_device_nums():
                output_index = 0
        print(input_index)
        print(output_index)
        audio.select_input_output_device(input_index, output_index, audio.callback_factory(Room))

Client().run()
