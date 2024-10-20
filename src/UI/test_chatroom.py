

from PyQt6.QtWidgets import  QWidget, QApplication, QMainWindow, QPushButton
from PyQt6 import uic
from PyQt6.QtCore import QTimer, QTime

import os 
pth = os.path.dirname(os.path.abspath(__file__))
print(os.path.join(pth, "chatui.ui"))
form_class = uic.loadUiType(os.path.join(pth, "test_chatroom.ui"))[0]
    


class TestChatRoom(QMainWindow, form_class):
    def __init__(self) :
        QMainWindow.__init__(self)
        # 연결한 Ui를 준비한다.
        # chatty = Chat(self)
        # self.timer = QTimer(self)
        # self.timer.setInterval(10000)
        # self.timer.timeout.connect(self.timeout)
        # self.timer.start()
        
        self.setupUi(self)
        # self.setCentralWidget(chatty)            
        # 화면을 보여준다.
        # self.show()

    



if __name__ == "__main__":
    import sys 
    class MainClass(QMainWindow, form_class):
        def __init__(self) :
            QMainWindow.__init__(self)
            # 연결한 Ui를 준비한다.
            # chatty = Chat(self)
            # self.timer = QTimer(self)
            # self.timer.setInterval(10000)
            # self.timer.timeout.connect(self.timeout)
            # self.timer.start()
            
            self.setupUi(self)
            # self.setCentralWidget(chatty)            
            # 화면을 보여준다.
            self.show()
        # def timeout(self):
            # print("timeouted")
            # self.setCentralWidget(QPushButton(parent=None)) 
    app = QApplication(sys.argv) 
    window = MainClass() 
    app.exec()
    
    
    
    
    