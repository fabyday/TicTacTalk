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
        self.__m_network_manager = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=12345, upd_server_port=9999)
        # self.__m_network_manager.initialize()
        # self.test = net.connection.UDPWorker()
        print(self.__m_network_manager.get_udp_addr())

        
        
    def run(self):
        import time 
        # self.__m_network_manager.initialize()
        user = set()
        
        while True : 
            msg = self.__m_network_manager.recv_udp_message()
            if msg is None :
                continue 
            if msg.src_addr not in user:
                user.add(msg.src_addr)
            
            for addr in user:
                msg.dest_addr = addr
                self.__m_network_manager.send_udp_message(msg)


if __name__ == "__main__":
    print("server is running")
    MockServer().run()
    
    
    