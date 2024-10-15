import socket

import tests
import src.Commons.Audio.audio as audio 
import queue 


import struct
import src.Commons.Data.room as room 
import src.Commons.Network.packet as packet
import src.Commons.Audio.audio_manager as ad 

class Client:
    def __init__(self):
        self.sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        self.sock.bind(("localhost", 9090))
        self.init_audio()
    def run(self):
        
        self.init_audio()
        # self.sock.sendto(("localhost", 9090))
        while True : 
            pk = packet.PacketFactory.deserialize_packet(self.sock)
            print("test")
            self.audiv.put_audio(pk)
            # self.sock.sendto(b"test", ("localhost", 9090))
            # self.sock.recvfrom(1000)
            
    def init_audio(self):
        Room = room.Room()
        o_info = ad.AudioManager().enumerate_output_device()[1]
        self.audiv = ad.AudioManager().create_output_device(o_info)


Client().run()
