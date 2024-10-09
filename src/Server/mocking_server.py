from ..Commons import Network as net 
import threading 
import wave
from ..Commons import Network
from ..Commons import path_finder 
import os.path as osp 
class Server:
    def __init__(self):
        self.__m_client_num = 2
        self.__m_network_manager = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=6060, upd_server_port=9090)
        self.w1 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "1.wav"), "r")
        self.w2 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "2.wav"), "r")
        
        
        
    def run(self):
        import time 
        self.__m_network_manager.initialize()
        w1frames = self.w1.getnframes()
        w2frames = self.w2.getnframes()
        frame_rate = self.w1.getframerate()
        print(w1frames)
        
        while True : 
            # voice_packet = Network.packet.VoicePacket()
            self.__m_network_manager.send_udp_message(("localhost", 9090), self.w1.readframes(frame_rate))
            self.__m_network_manager.send_udp_message(("localhost", 8080), self.w2.readframes(frame_rate))
            time.sleep(0.5)


if __name__ == "__main__":
    Server().run()
    
    
    