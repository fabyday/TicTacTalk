import struct 
from dataclasses import dataclass
import socket

# packet data struct 
# | Fixed Packet Header | Extended Header | Body |
# 
import pickle 


class PacketManager:
    def __init__(self):
        self.__m_packet_map = {}
        self.__m_allocated_id = 0

    def register_packet(self, packet_id, cls ):
        item = self.__m_packet_map.get(packet_id, None)
        if item is None :
            self.__m_packet_map[packet_id] = cls
    
    
    def __new__(cls):
        if not hasattr(cls, "__instance"):
            cls.__instance = super(PacketManager, cls).__new__(cls)
        return cls.__instance
    
    def alloc_new_id(self):
        self.__m_allocated_id += 1
        return self.__m_allocated_id

    
    def get_cls_from_packet_id(self, packet_id):
        return self.__m_packet_map[packet_id]
        
    






@dataclass
class AbstractPacket:
    """little endian"""
    """
        
        big-endian
    """
    
    
    
    
        
    

    def __init_subclass__(cls) -> None:
        super().__init_subclass__()
        cls.packet_id = PacketManager().alloc_new_id()
        PacketManager().register_packet(cls.packet_id, cls)
        # cls.__create_header()
        # cls.header_format = cls.__base__.header_format + cls.header_format
        # cls.header_size = struct.calcsize(cls.header_format)
    
    # @classmethod
    # def __create_header(cls):
    #     cls.header_format = ""
    #     for _ in cls.__dataclass_fields__.items():
    #         cls.header_format += "I"
            
        
        
        
        
            
    def to_bytes(self):
        bb = bytes()
        metadata = []
        data = {}
        for _, item_meta in self.__dataclass_fields__.items():
            item = getattr(self, item_meta.name)
            data[item_meta.name] = item
        
        data = pickle.dumps(obj=data)         
        data_size = len(data)
            
            
        return struct.pack(self.__class__.header_format, *[self.__class__.packet_id, data_size]) + data

    @classmethod
    def from_bytes(cls, sender_info, payload : bytes):
        obj = pickle.loads(payload)
        obj["src_addr"] = sender_info
        
        # for _, item_meta in cls.__dataclass_fields__.items() :
        #     setattr(self, item_meta.name, obj[item_meta.name])
        return cls(**obj)
    
    

    
    # default data 
    time_stamp : int
    src_addr : tuple 
    dest_addr : tuple

    


# class FixedRawHeaderPacket(AbstractPacket):
#     """little endian"""
#     """
#         | Message Type (unsgined Int 4 bytes)             |
#         | extended header size( unsgiend int 4 bytes)     |
#         | body data size (unsigned long long 8 bytes)     |
        
#         big-endian
#     """
    
#     message_type : int
#     extended_header_size : int 
#     body_data_size : int


@dataclass
class FixedHeader:
    """little endian"""
    """
        | Message Type (unsgined Int 4 bytes)             |
        | body data size (unsigned Int 4 bytes)     |
        
        big-endian
    """
    header_format = ">II"
    header_size = struct.calcsize(header_format)
    
    @classmethod
    def get_header_size(cls):
        return cls.header_size
    
    @classmethod
    def unapack_header(cls, data):
        return FixedHeader(struct.unpack(cls.header_format, data) )
    
    
    message_type : int 
    body_size : int 
        






class InfoPacket(AbstractPacket):
    
   

    request : str 



class VoicePacket(AbstractPacket):
        
    codec : str 
    voice_data: bytes
    
    
    
class VideoPacket(AbstractPacket):
    pass


class PacketFactory:
    
    @staticmethod
    def deserialize_packet(sock : socket.socket):
        header_bytes, addr = sock.recvfrom(FixedHeader.get_header_size())
        header = FixedHeader.unapack_header(header_bytes)
        
        
        
        cls = PacketManager().get_cls_from_packet_id(header.message_type)
        packet = cls.from_bytes(sock.recvfrom(header.body_size))
        return packet
        
        

 