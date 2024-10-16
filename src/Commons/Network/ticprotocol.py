import socket 
from .packet import *
import struct
seq:int 
from dataclasses import dataclass
import uuid
from . import timestamp
@dataclass
class TicPacketHeader:
    """ 
        packet_unique_id 
        cruent_sequence_num
        total_sequence
    """
    header_format = ">IIIf"
    header_size = struct.calcsize(header_format)
    max_packet_size = 2048
    payload_size = max_packet_size - header_size
    



    
    packet_id : uuid.UUID 
    sequence_num:int 
    total_sequence_num:int 
    time_stamp : float 


    def to_bytes(self):
        return struct.pack(TicPacketHeader.header_format, self.packet_id, self.sequence_num, self.total_sequence_num, self.time_stamp)


    @classmethod
    def from_bytes(cls):
        return TicPacketHeader(*struct.unpack(cls.header_format))
    


    
@dataclass
class TicPacket:
    header : TicPacketHeader
    payload : bytes
    
    
    


class TicProtocol():
    
    max_packet_size = TicPacketHeader.max_packet_size
    
    @classmethod
    def convert_to(cls, packet : bytes) -> bytes:  
        
        
        payload_size = TicPacketHeader.payload_size
        chunk_num = len(packet) // payload_size + 1
        chunk_list = []
        uid = uuid.uuid4()


        t = timestamp.get_current_timestamp()

        for seq_num, chunk_i in enumerate(range(chunk_num)):
            
            header =  TicPacketHeader(uid, seq_num, total_sequence_num=chunk_num, time_stamp=t).to_bytes()
            chunk = packet[chunk_i* payload_size : (chunk_i + 1)* payload_size ]
            chunk_list.append(header + chunk)
        return chunk_list
            
            
            
    
    @classmethod
    def restore_from_bytes(cls, raw_bytes : bytes) -> TicPacket:
        
        raw_header = raw_bytes[:TicPacketHeader.header_size]
        payload = raw_bytes[TicPacketHeader.header_size:]
        header = TicPacketHeader(*struct.unpack(TicPacketHeader.header_format,raw_header))
        return TicPacket(header, payload)



    
    
    
class TicProtocolManager():
    def __init__(self):
        self.__m_segmented_datagram_store = {} 
        self.__m_compl_callbacks = []
            
    
    def __new__(cls):
        if not hasattr(cls, "__instance"):
            cls.__instance = super(TicProtocolManager, cls).__new__(cls)
        return cls.__instance
    
    
    
    def send(data : bytes, adress : socket._Address, sock : socket.socket) -> list:
        chunks = TicProtocol.convert_to(data)
        for chunk in chunks:
            sock.sendto(chunk, adress)

    def add_datagram_loaded_callback(self, func):
        self.__m_compl_callbacks.append(func)
    
    def receive(self, sock :socket.socket):
        
        data, _ = sock.recvfrom(TicProtocol.max_packet_size)
        pak = TicProtocol.restore_from_bytes(data)
        if pak.header.total_seq == 1 : 
            for callback in self.__m_compl_callbacks:
                callback(pak)
        elif pak.header.sequence_num < pak.header.total_sequence_num: 
        
    def append_data_chunk(self, packet):
        self.__m_segmented_datagram_store.get()