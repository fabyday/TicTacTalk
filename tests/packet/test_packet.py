import tests

from dataclasses import dataclass

import time 
import src.Commons.Network as network 


plib = network.packet
@dataclass 
class TestPacket(plib.AbstractPacket):
    test : str
    
    
    
    

packet = TestPacket(("localhost", 9090),("localhost", 9090), time.timezone, "test")
b = packet.to_bytes()

header_byte = b[:plib.FixedHeader.get_header_size()]
header = plib.FixedHeader.unapack_header(header_byte)
print(header.message_type)
pload = b[plib.FixedHeader.get_header_size():plib.FixedHeader.get_header_size()+header.body_size]
test_packet = TestPacket.from_bytes(("localhost", 9090), ("localhost", 9090), pload)

print(test_packet)