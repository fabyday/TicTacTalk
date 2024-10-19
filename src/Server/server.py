from ..Commons import Network as net 
import threading 
import wave
from ..Commons import Network
from ..Commons import path_finder 
import os.path as osp 
from ..Commons.Audio import *

class Server:
    def __init__(self):
        self.__m_client_num = 2
        self.__m_network_manager = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=12345, upd_server_port=12346)
        self.__m_network_manager.initialize()
        # self.w1 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "1.wav"), "r")
        # self.w2 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "2.wav"), "r")
        
        
        
    def run(self):
        import time 
        
        while True : 
            
            # print(len(chunk1))
            # chunk1 = audio_helper.opus_encode(chunk1)
            p1 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 9090), time_stamp=100, codec="opus",user_name="1", voice_data=chunk1)
            self.__m_network_manager.send_udp_message( chunk1)


if __name__ == "__main__":
    Server().run()
    
    
    