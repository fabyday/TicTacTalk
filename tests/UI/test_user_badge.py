 
from PyQt6.QtWidgets import QApplication, QMainWindow, QWidget
import sys, os 

# sys.path.append(os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..")))


from PyQt6.QtWidgets import  QWidget, QLabel, QVBoxLayout
from PyQt6 import uic 
from PyQt6.QtCore import QPoint
from PyQt6.QtGui import QPixmap, QResizeEvent
from PyQt6.QtCore import Qt


import src.UI.user_badge as clib
from src.Commons.path_finder import get_project_root_path

class MainClass(QMainWindow):
    def __init__(self, widget_cls) :
        QMainWindow.__init__(self)
        chatty = widget_cls(self, "None", clib.UserStatus.ONLINE  )
        self.resize(800, 800)
        self.setCentralWidget(chatty)            
        self.show()
        
if __name__ == "__main__":
    from tests import *
    
    
    app = QApplication(sys.argv) 
    # window = MainClass(clib.UserBadgeWidget)
    ex = clib.UserBadgeWidget(None, "", clib.UserStatus.ONLINE)
    
    app.exec()
    
    



    