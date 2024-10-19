import struct 
from dataclasses import dataclass
import socket

# packet data struct 
# | Fixed Packet Header | Extended Header | Body |
# 
import pickle 

from .packet_manager import PacketClassManager

    





@dataclass
class AbstractPacket:
    """little endian"""
    """
        
        big-endian
    """
    
    
    
    
        
    

    def __init_subclass__(cls) -> None:
        super().__init_subclass__()
        cls.packet_id = PacketClassManager.alloc_new_id()
        PacketClassManager.register_packet(cls.packet_id, cls)
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
        
        header_byte =  FixedHeader(self.__class__.packet_id, data_size).to_bytes() 
        
        return header_byte + data

    @classmethod
    def from_bytes(cls, sender_info, dest_info, payload : bytes):
        obj = pickle.loads(payload)
        obj["src_addr"] = sender_info
        obj["dest_addr"] = dest_info
        
        # for _, item_meta in cls.__dataclass_fields__.items() :
        #     setattr(self, item_meta.name, obj[item_meta.name])
        return cls(**obj)
    
    

    
    # default data 
    src_addr : tuple 
    dest_addr : tuple
    time_stamp : int

    



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
        return FixedHeader( *struct.unpack(cls.header_format, data[:cls.header_size]) )
    
    
    def to_bytes(self):
        return struct.pack(self.__class__.header_format, self.message_type, self.body_size)
        
    
    message_type : int 
    body_size : int 
        



        


class InfoPacket(AbstractPacket):
    
   

    request : str 


@dataclass
class VoicePacket(AbstractPacket):
        
    codec : str 
    user_name : str
    voice_data: bytes
    
    
    
class VideoPacket(AbstractPacket):
    pass


class PacketFactory:
    
    @staticmethod
    def deserialize_packet(sock : socket.socket):
        # header_bytes, addr = sock.recvfrom(FixedHeader.get_header_size())
        header_bytes, addr = sock.recvfrom(5896)
        h_size = FixedHeader.get_header_size()
        header = FixedHeader.unapack_header(header_bytes[:h_size])
        payload = header_bytes[h_size:]
        
        cls = PacketClassManager().get_cls_from_packet_id(header.message_type)
        packet = cls.from_bytes(addr, ("localhost", 4040), payload)
        return packet
        
        
        """
            craete custom packet 
            
            
            Use @dataclass decorator
            and specify your packet data
            
            @dataclass
            class SomeSuperGoodPacket(AbstractPacket):
                your_new_field : field-type(like object, str, whatever you want to write)
                .
                .
                .
            
            
        """