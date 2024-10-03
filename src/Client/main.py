from PyQt6.QtWidgets import QMainWindow, QApplication
from PyQt6 import uic 
import sys 
import os 

def get_cur_dir(file):
    return os.path.dirname(os.path.abspath(__file__))
    
class Client(QMainWindow):
    def __init__(self):
        super(Client, self).__init__()
        uic.load_ui.loadUi( os.path.join( os.path.dirname(os.path.abspath(__file__)),"../UI/client.ui"), self)
        self.show()
        
        
app = QApplication(sys.argv)
client = Client()
app.exec()