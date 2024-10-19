import socket

import tests
import src.Commons.Audio as audio 
import queue 


import struct
import src.Commons.Data.voiceroom as voiceroom 
import src.Commons.Network.packet as packet
import src.Commons.Audio.audio_manager as ad 
import time 
import threading 
import numpy as np 
import multiprocessing as mt 




class Client:
    def __init__(self):
        
        self.__m_data = {}
        self.__m_queue = mt.Queue()
        self.proc = mt.Process(target = self.run)
        self.proc.start()
        
        self.init_audio()
        
            
    def pushf(self):
        print(mt.parent_process())
        if mt.parent_process():
            start = time.time()
            
            while True:
                pk = self.__m_queue.get()
                self.__m_data.setdefault(pk.user_name, queue.Queue()).put(pk.voice_data)
                end = time.time()
                delta = end - start
                if  delta > 0.1:
                    keys = self.__m_data.keys()
                    data_list = []
                    # print(self.__m_data)
                    for key in keys:
                        try : 
                            data = self.__m_data[key].get_nowait()
                            # print(data)
                            data_list.append(data)        
                        except:
                            continue
                        
                    if data_list:
                        overlayed_chunk = audio.merge_mono_audio_chunks(np.int16, *data_list)
                        self.audiv.put_audio(overlayed_chunk)
                    start = end
 
    def run(self):
        self.sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        self.sock.bind(("localhost", 9090))
        # self.sock.sendto(("localhost", 9090))
        while True : 
            
            # pk = packet.PacketFactory.deserialize_packet(self.sock)
            # pk = pk.voice_data
            pk = packet.PacketFactory.deserialize_packet(self.sock)
            # pk, _ = self.sock.recvfrom(6000)
            self.__m_queue.put(pk)
            # self.__m_data.setdefault(pk.user_name, queue.Queue()).put(pk.voice_data)
            # self.__m_buffer.put(pk)
            
            # t = time.time()
            # while True : 
            #     a.setdefault(pk.user_name, queue.Queue()).put(pk)
            #     if 1 < time.time() - t:
            #         break
            # chunks = []
            # for item in a.values():
            #     try : 
            #         data = item.get_nowait()
            #         chunks.append(data.voice_data)
            #     except : 
            #         data = np.zeros(audio.CHUNK, np.int16)
            #         chunks.append(data)
            # pk = audio.audio_helper.merge_mono_audio_chunks(np.int16, *chunks)
            # self.audiv.put_audio(pk)
            
            # t = time.time()
            # self.sock.sendto(b"test", ("localhost", 9090))
            # self.sock.recvfrom(1000)
            
    def init_audio(self):
        # Room = room.Room()
        o_info = ad.AudioManager().enumerate_output_device()[1]
        self.audiv = ad.AudioManager().create_output_device(o_info)

if __name__ == "__main__":
    client = Client().pushf()
