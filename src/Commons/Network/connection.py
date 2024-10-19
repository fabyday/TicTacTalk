from . import packet
from typing import List, Union
import socket, threading
import inspect
from ..Data import shared_objects
import queue 
# from .ticprotocol import *
import multiprocessing as mt 





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
            
class AsyncServerConnectionManager:
    """
    
        multiprocess based ASync class.
        tcp and udp process created and will be run.
    """ 
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
        
        
        # self.__m_tcp_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
        # self.__m_tcp_sock.setblocking(True)
        # self.__m_tcp_sock.bind((self.__m_server_ip, self.__m_server_port))
        
        
        
        # self.__m_udp_sock = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)
        # self.__m_udp_sock.setblocking(True)
        # self.__m_udp_sock.bind((self.__m_server_ip, self.__m_udp_server_port))
        self.__m_upd_server_process = mt.Process(target = self.udp_process_method, name = "name" )
        self.__m_upd_server_process.daemon = True
        self.__m_upd_server_process.start()
        print("test is over")
        # self.__m_upd_server_process = self.__initialize_process(self.__server_udp_send_run, args = (), name=self.__class__.__name__ + "." + self.__server_udp_send_run.__name__)

    
    # def __initialize_process(self, target, args, name):
    #     process = mt.Process(target = target, name = name, args=args )
    #     process.daemon = True
    #     process.start()
    #     return process

    # def __initialize_thread(self, target, name):
        
    #     thread = threading.Thread(target=target, name=name)
    #     thread.setDaemon(True)
    #     thread.start()
    #     return thread


    def initialize(self):

        pass
        # self.__m_listen_thread = self.__initialize_thread(target = self.__listen, name=self.__class__.__name__ + "." + self.__listen.__name__)
        # self.__m_tcp_recv_server_thread = self.__initialize_thread(target = self.__server_tcp_send_run, name=self.__class__.__name__ + "." + self.__server_tcp_send_run.__name__)
        # self.__m_tcp_send_server_thread = self.__initialize_thread(target = self.__server_tcp_recv_run, name=self.__class__.__name__ + "." + self.__server_tcp_recv_run.__name__)
        # self.__m_udp_recv_server_thread = self.__initialize_thread(target = self.__server_udp_recv_run, name=self.__class__.__name__ + "." + self.__server_udp_recv_run.__name__)
        # self.__m_udp_send_server_thread = self.__initialize_thread(target = self.__server_udp_send_run, name=self.__class__.__name__ + "." + self.__server_udp_send_run.__name__)

        
        
    # def __listen(self):
    #     while True :
    #         self.__m_tcp_sock.listen(self.__m_listen_size)
    #         client_sock, addr = self.__m_tcp_sock.accept()
    #         with self.__m_joined_clients as d:
    #             d[addr] = client_sock


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
            
                
                
            
                
            
            
            
                
            
            
    


    













    

        









    


    





        
