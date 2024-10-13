import struct 
from dataclasses import dataclass
import socket

# packet data struct 
# | Fixed Packet Header | Extended Header | Body |
# 
import pickle 


class PacketClassManager:
    def __init__(self):
        self.__m_packet_map = {}
        self.__m_allocated_id = 0

    def register_packet(self, packet_id, cls ):
        item = self.__m_packet_map.get(packet_id, None)
        if item is None :
            self.__m_packet_map[packet_id] = cls
    
    
    def __new__(cls):
        if not hasattr(cls, "__instance"):
            cls.__instance = super(PacketClassManager, cls).__new__(cls)
        return cls.__instance
    
    def alloc_new_id(self):
        self.__m_allocated_id += 1
        return self.__m_allocated_id

    
    def get_cls_from_packet_id(self, packet_id):
        return self.__m_packet_map[packet_id]
        