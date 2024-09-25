from . import packet
from typing import List, Union
import socket, threading
import inspect
from ..Data import shared_dict

class AsyncClientConnectionManager:
    def __init__(self):
        pass 



    async def connect(self, ip, port):
        self.__m_tcp_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        self.__m_tcp_sock.setblocking(False)
        self.__m_tcp_sock.connect((ip, port))


        self.__m_tcp_sock.send()
        

    
    
    async def send_packets(self, packets : Union[packet.AbstractPacket, List[packet.AbstractPacket]] ):
        pass 

    async def recv_packets(self):
        pass 

    async def get_connection_state(self):
        pass 
    


class AsyncServerConnectionManager:
    def __init__(self, listen_size = 24, server_ip = None, server_port = 6060):
        self.__m_listen_size = listen_size
        self.__m_server_ip = socket.gethostbyname(socket.gethostname()) if server_ip is  None else server_ip
        self.__m_server_port = server_port


        self.__m_joined_clients = shared_dict.SharedDict()

    def __initialize_thread(self, target, name):
        self.__m_listen_thread = threading.Thread(target=self.__listen, name=self.__class__.__name__ + "." + self.__listen.__name__)
        self.__m_listen_thread.setDaemon(True)
        self.__m_listen_thread.start()


    def initialize(self):
        self.__m_tcp_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        self.__m_tcp_sock.setblocking(False)
        self.__m_tcp_sock.bind((self.__m_server_ip, self.__m_server_port))

        self.__m_listen_thread = self.__initialize_thread(target = self.__listen, name=self.__class__.__name__ + "." + self.__listen.__name__)
        self.__m_tcp_server_thread = self.__initialize_thread(target = self.__listen, name=self.__class__.__name__ + "." + self.__server_tcp_run.__name__)
        self.__m_udp_server_thread = self.__initialize_thread(target = self.__listen, name=self.__class__.__name__ + "." + self.__server_udp_run.__name__)



    def __listen(self):
        while True :
            self.__m_tcp_sock.listen(self.__m_listen_size)
            client_sock, addr = self.__m_tcp_sock.accept()
            with self.__m_joined_clients as d:
                d[addr] = client_sock


    def __server_tcp_run(self):
        while True : 
            with self.__m_joined_clients as clients:
                for addr, sock in clients.items():
                    sock.recv


    def __server_udp_run(self):
        while True : 
            pass 


    













    

        









    


    





        
