 
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget
import sys, os 

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..")))



class MainClass(QMainWindow):
    def __init__(self, widget_cls) :
        QMainWindow.__init__(self)
        chatty = widget_cls(self)
        self.setCentralWidget(chatty)            
        self.show()
        
if __name__ == "__main__":
    from tests import *
    import src.UI.chatty as clib
    
    
    app = QApplication(sys.argv) 
    window = MainClass(clib.Chatty)
    app.exec()
    
    



    