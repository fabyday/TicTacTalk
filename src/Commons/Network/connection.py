from . import packet
from typing import List, Union
import socket, threading
import inspect
from ..Data import shared_objects
import queue 
# from .ticprotocol import *
import multiprocessing as mt 


import asyncio

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
    
class UDPWorker:
    """
        UDP worker
        
    """ 
    def __init__(self, ip  = None, port : int = 9999):
        self.__m_server_ip = socket.gethostbyname(socket.gethostname()) if ip is  None else ip
        self.__m_port = port 
        self.__m_udp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # udp 
        self.__m_in_queue = mt.Queue()
        self.__m_out_queue = mt.Queue()
    
    
    def init(self):
        self.proc = mt.Process(target = self.run, name="test")
        self.proc.daemon = True
        self.proc.start()
    
    def run(self):
        while True : 
            pak = self.__m_in_queue.get()
            self.__m_port.sendto(pak.to_bytes(), pak.dest_addr) 
from dataclasses import   *

class AsyncServerConnectionManager:
    """
    
        multiprocess based ASync class.
        tcp and udp process created and will be run.
    """ 
    @dataclass 
    class Client:
        sock : socket.socket
        addr : socket._Address
    
    def __init__(self, listen_size = 24, server_ip = None, tcp_server_port = 6060, upd_server_port=7070):
        self.__m_listen_size = listen_size
        self.__m_server_ip = socket.gethostbyname(socket.gethostname()) if server_ip is  None else server_ip
        self.__m_server_port = tcp_server_port
        self.__m_udp_server_port = upd_server_port

        
        self.__m_tcp_sended_packet_num = 0
        self.__m_tcp_receive_packet_num = 0
        
        self.__m_udp_receive_packet_num = 0
        self.__m_udp_sended_packet_num = 0
        
        self.__m_input_message_queue = mt.Queue()
        self.__m_output_message_queue = mt.Queue()
        
        self.__m_joined_new_client_queue = mt.Queue()        
        # self.__m_tcp_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        # self.__m_tcp_sock.setblocking(True)
        # self.__m_tcp_sock.bind((self.__m_server_ip, self.__m_server_port))
        
        
        
        # self.__m_udp_sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        # self.__m_udp_sock.setblocking(True)
        # self.__m_udp_sock.bind((self.__m_server_ip, self.__m_udp_server_port))
        self.__m_upd_server_process = mt.Process(target = self.udp_process_method, name = "name" )
        self.__m_upd_server_process.daemon = True
        self.__m_upd_server_process.start()
        
        self.__m_tcp_server_process = mt.Process(target = self.__tcp_process_method, name = "name" )
        self.__m_tcp_server_process.daemon = True
        self.__m_tcp_server_process.start()
        
        self.__m_tcp_listen_server_process = mt.Process(target = self.__listen, name = "name" )
        self.__m_tcp_listen_server_process.daemon = True
        self.__m_tcp_listen_server_process.start()

    

    def initialize(self):
        pass

        
    def __tcp_process_method(self):
        self.__m_input_message_queue
        self.clients =[]
        self.__m_joined_new_client_queue
        loop = asyncio.get_event_loop()
        
        queue = asyncio.Queue()
        async def listen_message(client : AsyncServerConnectionManager.Client):
            try : 
                data = client.sock.recvfrom()
            except : 
                await asyncio.sleep(0.01)
        async def tcp_accept_f():
            while True : 
                self.__m_tcp_sock.listen(self.__m_listen_size)
                client_sock, addr = self.__m_tcp_sock.accept()
                self.__m_joined_new_client_queue.put()
                co_f = listen_message(AsyncServerConnectionManager.Client(client_sock, addr))
                loop.create_task(co_f)
        
        
            
        loop.create_task(tcp_accept_f())
        loop.run_forever()
        # while True : 
        #     try : 
        #         new_client = self.__m_joined_new_client_queue.get_nowait()
        #         self.clients.append(new_client)
        #     except : 
        #         data = None 
        #     for client in self.clients:
        #         client.
        
    def __listen(self):
        while True :
            self.__m_tcp_sock.listen(self.__m_listen_size)
            client_sock, addr = self.__m_tcp_sock.accept()
            self.__m_joined_new_client_queue.put(AsyncServerConnectionManager.Client(client_sock, addr))

    # def __server_tcp_recv_run(self):
    #     while True : 
    #         with self.__m_joined_clients as clients:
    #             for addr, sock in clients.items():
    #                 sock.recv
    # def __server_tcp_send_run(self):
    #     while True : 
    #         pass 
    
    # def get_tcp_message(self):
    #     pass 
    
    # def send_tcp_message(self, addr, data):
    #     pass 
    
    # def recv_udp_message(self):
    #     pass 
    
    
    def send_udp_message(self, packet : packet.AbstractPacket):
        self.__m_output_message_queue.put(packet)
        
    # def send_udp_message(self, packet : bytes):
        # self.__m_output_message_queue.put(packet)
        

    
    # def __server_udp_send_run(self):
    #     print("udp sender init")
    #     # ticpro_manager = TicProtocolManager()
    #     while True : 
    #         pak = self.__m_output_message_queue.get()
    #         # ticpro_manager.send(pak.to_bytes(), pak.dest_addr, self.__m_udp_sock)
    #         self.__m_udp_sock.sendto(pak.to_bytes(), pak.dest_addr)
    def udp_process_method(self):
        print("sender process run")
        # ticpro_manager = TicProtocolManager()
        self.__m_udp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        while True : 
            pak = self.__m_output_message_queue.get()
            # ticpro_manager.send(pak.to_bytes(), pak.dest_addr, self.__m_udp_sock)
            # self.__m_udp_sock.sendto(pak, ("localhost", 9090 ))
            self.__m_udp_sock.sendto(pak.to_bytes(), pak.dest_addr)
    # def __server_udp_send_run(self):
    #     print("udp sender init")
    #     # ticpro_manager = TicProtocolManager()
    #     while True : 
            
    #         pak = self.__m_output_message_queue.get()
    #         # ticpro_manager.send(pak.to_bytes(), pak.dest_addr, self.__m_udp_sock)
    #         # self.__m_udp_sock.sendto(pak, ("localhost", 9090 ))
    #         self.__m_udp_sock.sendto(pak.to_bytes(), pak.dest_addr)
    
    
    
    
    # def __server_udp_recv_run(self):
    #     def msg_callback(msg : bytes):
    #         header_size = packet.FixedHeader.get_header_size()
    #         raw_header = packet.FixedPacketHeaderHelper.unpack_header(msg[:header_size])
            
    #         packet_data = packet.PacketFactory.deserialize_packet(fixed_header=raw_header, data = msg[header_size:])
    #         self.__m_input_message_queue.put(packet_data)
    #     # ticprotocol_manager = TicProtocolManager()
    #     # ticprotocol_manager.add_datagram_loaded_callback(msg_callback)
        
    #     # while True : 
    #     #     # print("packet.FixedHeader.header_size", packet.FixedHeader.header_size)
    #     #     # ticprotocol_manager.receive(self, sock=self.__m_udp_sock)
    #     #     header_size = packet.FixedHeader.get_header_size()
    #     #     msg, _ = self.__m_udp_sock.recvfrom(2048)
    #     #     raw_header = packet.FixedPacketHeaderHelper.unpack_header(msg[:header_size])
            
    #     #     packet_data = packet.PacketFactory.deserialize_packet(fixed_header=raw_header, data = msg[header_size:])
    #     #     self.__m_input_message_queue.put(packet_data)
            
                
                
            
                
            
            
            
                
            
            
    


    













    

        









    


    





        
