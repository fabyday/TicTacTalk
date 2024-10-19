

from PyQt6.QtWidgets import  QWidget, QApplication, QMainWindow
from PyQt6 import uic 

import os 
pth = os.path.dirname(os.path.abspath(__file__))

form_class = uic.loadUiType(os.path.join(pth, "chat.ui"))[0]
class Chat(QWidget, form_class):
    def __init__(self, parent):
        QWidget.__init__(self, parent=parent)
        self.setupUi(self)
        self.show()
    
    



if __name__ == "__main__":
    import sys 
    class MainClass(QMainWindow):
        def __init__(self) :
            QMainWindow.__init__(self)
            # 연결한 Ui를 준비한다.
            chatty = Chat(self)
            self.setCentralWidget(chatty)            
            # 화면을 보여준다.
            self.show()
        
    app = QApplication(sys.argv) 
    window = MainClass() 
    app.exec()
    
    
    
    
    