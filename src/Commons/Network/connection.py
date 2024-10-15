from . import packet
from typing import List, Union
import socket, threading
import inspect
from ..Data import shared_objects
import queue 
from .ticprotocol import *

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
    def __init__(self, listen_size = 24, server_ip = None, tcp_server_port = 6060, upd_server_port=7070):
        self.__m_listen_size = listen_size
        self.__m_server_ip = socket.gethostbyname(socket.gethostname()) if server_ip is  None else server_ip
        self.__m_server_port = tcp_server_port
        self.__m_udp_server_port = upd_server_port

        self.__m_joined_clients = shared_objects.SharedDict()
        
        self.__m_tcp_sended_packet_num = 0
        self.__m_tcp_receive_packet_num = 0
        
        self.__m_udp_receive_packet_num = 0
        self.__m_udp_sended_packet_num = 0
        
        self.__m_input_message_queue = queue.Queue()
        self.__m_output_message_queue = queue.Queue()
        
        
        self.__m_tcp_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        self.__m_tcp_sock.setblocking(True)
        self.__m_tcp_sock.bind((self.__m_server_ip, self.__m_server_port))
        
        
        
        self.__m_udp_sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        self.__m_udp_sock.setblocking(True)
        self.__m_udp_sock.bind((self.__m_server_ip, self.__m_udp_server_port))
        

    def __initialize_thread(self, target, name):
        self.__m_listen_thread = threading.Thread(target=target, name=name)
        self.__m_listen_thread.setDaemon(True)
        self.__m_listen_thread.start()


    def initialize(self):


        self.__m_listen_thread = self.__initialize_thread(target = self.__listen, name=self.__class__.__name__ + "." + self.__listen.__name__)
        self.__m_tcp_recv_server_thread = self.__initialize_thread(target = self.__server_tcp_send_run, name=self.__class__.__name__ + "." + self.__server_tcp_send_run.__name__)
        self.__m_tcp_send_server_thread = self.__initialize_thread(target = self.__server_tcp_recv_run, name=self.__class__.__name__ + "." + self.__server_tcp_recv_run.__name__)
        self.__m_udp_recv_server_thread = self.__initialize_thread(target = self.__server_udp_recv_run, name=self.__class__.__name__ + "." + self.__server_udp_recv_run.__name__)
        self.__m_udp_send_server_thread = self.__initialize_thread(target = self.__server_udp_send_run, name=self.__class__.__name__ + "." + self.__server_udp_send_run.__name__)

    def __listen(self):
        while True :
            self.__m_tcp_sock.listen(self.__m_listen_size)
            client_sock, addr = self.__m_tcp_sock.accept()
            with self.__m_joined_clients as d:
                d[addr] = client_sock


    def __server_tcp_recv_run(self):
        while True : 
            with self.__m_joined_clients as clients:
                for addr, sock in clients.items():
                    sock.recv
    def __server_tcp_send_run(self):
        while True : 
            pass 
    
    def get_tcp_message(self):
        pass 
    
    def send_tcp_message(self, addr, data):
        pass 
    
    def recv_udp_message(self):
        pass 
    
    
    def send_udp_message(self, packet : packet.AbstractPacket):
        self.__m_output_message_queue.put(packet)
        

    
    def __server_udp_send_run(self):
        print("udp sender init")
        ticpro_manager = TicProtocolManager()
        while True : 
            pak = self.__m_output_message_queue.get()
            ticpro_manager.send(pak.to_bytes(), pak.dest_addr, self.__m_udp_sock)

        
    
    def __server_udp_recv_run(self):
        print("udp init")
        def msg_callback(msg : bytes):
            raw_header = packet.FixedPacketHeaderHelper.unpack_header(msg)
            packet_data = packet.PacketFactory.deserialize_packet(fixed_header=raw_header, data = data)
            self.__m_input_message_queue.put(packet_data)
        ticprotocol_manager = TicProtocolManager()
        ticprotocol_manager.add_datagram_loaded_callback(msg_callback)
        
        while True : 
            print("packet.FixedHeader.header_size", packet.FixedHeader.header_size)
            ticprotocol_manager.receive(self, sock=self.__m_udp_sock)
            
                
                
            
                
            
            
            
                
            
            
    


    













    

        









    


    





        
