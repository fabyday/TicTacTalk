import tests 

from src.Commons import Network as net 
import threading 
import wave
from src.Commons import Network
from src.Commons import path_finder 
import os.path as osp 
from src.Commons.Audio import *

class MockServer:
    def __init__(self):
        self.__m_client_num = 2
        self.__m_network_manager = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=12345, upd_server_port=12346)
        # self.__m_network_manager.initialize()
        # self.test = net.connection.UDPWorker()
        # self.test.init()
        self.w1 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "1.wav"), "r")
        self.w2 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "2.wav"), "r")
        
        
        
    def run(self):
        import time 
        # self.__m_network_manager.initialize()
        w1frames = self.w1.getnframes()
        w2frames = self.w2.getnframes()
        frame_rate = self.w1.getframerate()
        
        print(w1frames)
        
        while True : 
            # voice_packet = Network.packet.VoicePacket()
            chunk1 = self.w1.readframes(CHUNK)
            # print( self.w1.getnchannels(), self.w1.getsampwidth())
            # print( self.w2.getnchannels(), self.w2.getsampwidth())
            chunk1 = audio_helper.stereo2mono(chunk1, self.w1.getnchannels(), self.w1.getsampwidth())
            # CHUNKSIZE= CHUNK*2
            chunk2 = self.w2.readframes(CHUNK)
            chunk2 = audio_helper.stereo2mono(chunk2, self.w2.getnchannels(), self.w2.getsampwidth())
            # chunk2s= []
            # for i in range(1):
            #     chunk2 = audio_helper.stereo2mono(chunk2[CHUNKSIZE*i:CHUNKSIZE*(i+1)], self.w2.getnchannels(), self.w2.getsampwidth())
            #     print("fsize " , len(chunk2))
            #     chunk2 = audio_helper.opus_encode(chunk2)
            #     p2 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 9090), time_stamp=100, codec="opus",user_name="2", voice_data=chunk2)
            #     # chunk2s.append(chunk2)
            #     self.__m_network_manager.send_udp_message(chunk2)
            # chunk2 = audio_helper.stereo2mono(chunk2, self.w2.getnchannels(), self.w2.getsampwidth())
            
            # print(len(chunk1))
            # chunk1 = audio_helper.opus_encode(chunk1)
            p1 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 9090), time_stamp=100, codec="opus",user_name="1", voice_data=chunk1)
            p2 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 9090), time_stamp=100, codec="opus",user_name="2", voice_data=chunk2)
            self.__m_network_manager.send_udp_message(p1)
            self.__m_network_manager.send_udp_message(p2)


if __name__ == "__main__":
    print("server is running")
    MockServer().run()
    
    
    