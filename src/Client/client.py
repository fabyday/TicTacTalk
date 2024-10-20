from PyQt6.QtWidgets import QMainWindow, QApplication
from PyQt6 import uic 
import sys 
import os 

from ..UI import test_chatroom
from ..Commons.Network.connection
class Client(QMainWindow, test_chatroom.form_class):
    def __init__(self) :
        QMainWindow.__init__(self)
        # 연결한 Ui를 준비한다.
        self.setupUi(self)

if __name__ == "__main__":

    app = QApplication(sys.argv)
    s = Client()
    # s.show()
    # s = cls2()
    # a = form_class()
    # a.setupUi(s)
    s.show()
    sys.exit(app.exec())