from PyQt6.QtWidgets import QMainWindow, QApplication
from PyQt6 import uic 
import sys 
import os 

from ..UI.test_chatroom import *
pth = os.path.dirname(os.path.abspath(__file__))
try : 
    generated_class, base_class = uic.loadUiType("D:\\project\\tic-tac-talk\\src\\UI\\test_chatroom.ui")
except:
    print("error")
    sys.exit()

# class TestChatRoom(QMainWindow, generated_class):
#     def __init__(self) :
#         QMainWindow.__init__(self)
#         self.setupUi(self)
        
if __name__ == "__main__":
    app = QApplication(sys.argv)
    s = TestChatRoom()
    # s.show()
    # s = cls2()
    # a = form_class()
    # a.setupUi(s)
    s.show()
    sys.exit(app.exec())