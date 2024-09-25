import struct 
from dataclasses import dataclass


@dataclass
class FixedPacketHeader:
    message_type : int 
    extended_header_size : int 
    body_data_size : int

@dataclass
class AbstractExtendedPacketHeader:
    pass 

class FixedPacketHeaderHelper:
    """little endian"""
    """
        | Message Type (unsgined Int 4 bytes)             |
        | extended header size( unsgiend int 4 bytes)     |
        | body data size (unsigned long long 8 bytes)     |
        
        big-endian
    """

    __fixed_header_format = ">IIQ"
    __header_size = struct.calcsize(__fixed_header_format)


    def pack_header(message_type : int , extra_header : bytes, body_data_size : int ):
        return struct.pack(FixedPacketHeaderHelper.__fixed_header_format,message_type, len(extra_header), body_data_size) + extra_header
    def unpack_header(data : bytes):
        return struct.unpack(FixedPacketHeaderHelper.__fixed_header_format, data)
    
        



# packet data struct 
# | Fixed Packet Header | Extended Header | Body |
# 


@dataclass
class AbstractPacket:


    class SerializerDescriptor:
        def serialize(packet):
            pass
        def deserialize(packet):
            pass 
    
    @dataclass
    class AbstractDataStruct:
        pass

    con_type : int 
    header : bytes 
    data : any




PingPacket = AbstractPacket(1, "", "")






class InfoPacket(AbstractPacket):
    
    class InfoData(AbstractPacket.AbstractDataStruct):
        user : str 
        request : str
        args : str



    class SerializerDescriptor(AbstractPacket.SerializerDescriptor):
        def serialize(self):
            pass

    pass



class VoicePacket(AbstractPacket):
    class VoiceData(AbstractPacket.AbstractDataStruct):
        
        codec : str 
        voicepacket : bytes

    class SerializerDescriptor(AbstractPacket.SerializerDescriptor):
        pass 
    pass 

class VideoPacket(AbstractPacket):
    
    class VideoData(AbstractPacket.AbstractDataStruct):
        codec : str 
        videopacket : bytes 


    class SerializerDescriptor(AbstractPacket.SerializerDescriptor):
        pass 
    pass 
    