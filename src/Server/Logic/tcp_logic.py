from ...Commons.Network.packet import * 



class ConnectRequest():
    connect : int 
    
class DisconnectRequest():
    id : int 
    




class TcpPacketLogic:



    def __init__(self):

        pass 




    


    def logic(self, packet : AbstractPacket):
        if isinstance(packet, InfoPacket):
            packet.request


