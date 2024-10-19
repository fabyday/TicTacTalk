import struct 
from dataclasses import dataclass
import socket

# packet data struct 
# | Fixed Packet Header | Extended Header | Body |
# 
import pickle 


class PacketClassManager:
    __instance = None 
    __m_packet_map = {}
    __m_allocated_id = 0

    
    @classmethod
    def register_packet(cls, packet_id, cls_ ):
        item = cls.__m_packet_map.get(packet_id, None)
        if item is None :
            cls.__m_packet_map[packet_id] = cls_
        print(cls.__m_packet_map)
    
    
    
    @classmethod
    def alloc_new_id(cls):
        cls.__m_allocated_id += 1
        return cls.__m_allocated_id

    
    @classmethod
    def get_cls_from_packet_id(cls, packet_id):
        return cls.__m_packet_map[packet_id]
        