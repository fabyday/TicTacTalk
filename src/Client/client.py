from PyQt6.QtWidgets import *
from PyQt6 import uic 
import sys 
import os 
from PyQt6.QtCore import *
from ..UI import test_chatroom
from ..Commons.Network.connection import * 
class Client(QMainWindow, test_chatroom.form_class):
    connect_user = pyqtSignal()
    disconnect_user = pyqtSignal()
    def __init__(self) :
        QMainWindow.__init__(self)
        # 연결한 Ui를 준비한다.
        self.setupUi(self)
        self.__init_components()
        
    def __init_components():
        pass
    
    

if __name__ == "__main__":

    app = QApplication(sys.argv)
    s = Client()
    # s.show()
    # s = cls2()
    # a = form_class()
    # a.setupUi(s)
    s.show()
    sys.exit(app.exec())