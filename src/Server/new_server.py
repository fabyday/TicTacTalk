
from PyQt5.QtWidgets import * 




from ..Commons.Network import connection

class TicTacTalkServer:

    
    def __init__(self):
        self.__m_Mbps = 0
        self.__m_connection_manager = connection.AsyncServerConnectionManager()

    def run(self):
        self.__m_connection_manager.initialize()
    



