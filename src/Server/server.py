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
        
    def run(self):
        import time 
        
        while True : 
            self.__m_network_manager.recv_udp_message()
            self.__m_network_manager.send_udp_message()


if __name__ == "__main__":
    Server().run()
    
    
    