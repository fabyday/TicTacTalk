
from PyQt6.QtWidgets import  QWidget, QLabel, QVBoxLayout
from PyQt6 import uic 
from PyQt6.QtCore import QPoint, Qt
from PyQt6.QtGui import QPixmap, QResizeEvent


import os 

from enum import unique, Enum 

from src.Commons.path_finder import get_project_root_path

@unique
class UserStatus(Enum):
    ONLINE = 1
    OFFLINE = 2 

class UserBadgeWidget(QWidget):
    
    # online_badge = QPixmap("")
    # offline_badge = QPixmap("")
    
    def __init__(self, parent, image_pth, badge_status : UserStatus):
        super(UserBadgeWidget, self).__init__(parent)
        self.initUI()
        self.show()        
        self.update_image(image_pth)    
        self.update_status(badge_status)    

    
    def initUI(self):
        
        
        self.__m_root_laytout = QVBoxLayout()

        if not hasattr(self, "__m_user_image"):
            self.__m_user_image = QLabel(self)
            self.__m_badge_status = QLabel(self)
        self.__m_user_image
        # self.__m_root_laytout.setContentsMargins(0,0,0,0)
        
        # self.__m_root_laytout.addWidget(self.__m_user_image)
        # self.__m_user_image.setAlignment(Qt.AlignmentFlag.AlignCenter)
        
        
    def resizeEvent(self, a0: QResizeEvent) -> None:
        size = self.__m_user_image.geometry().bottomRight() - self.__m_user_image.geometry().topLeft()
        # self.__m_user_image.geometry().
        desired_width = size.x()//5
        width_and_height = QPoint(desired_width, desired_width)
        right_coner = self.__m_user_image.geometry().topLeft() + (size - width_and_height)

        self.__m_badge_status.setStyleSheet("background : black")
        self.__m_badge_status.resize(width_and_height.x(), width_and_height.y())
        self.__m_badge_status.move(right_coner)
        
        return super().resizeEvent(a0) 
    
    def update_image(self, image_pth):
        if os.path.exists(image_pth):
            self.__m_user_image.setPixmap(QPixmap(image_pth))
        else : 
            self.img = QPixmap(os.path.join(get_project_root_path(), "images/icon.jpg"))
            self.__m_user_image.setPixmap(self.img)
            self.__m_user_image.resize(self.img.size())
            self.resize(self.img.size())
            
        
        
        
        
    def update_status(self, badge_status : UserStatus):
        # if badge_status is UserStatus.ONLINE:
        #     self.__m_badge_status = UserBadgeWidget.online_badge
        # elif badge_status is UserStatus.OFFLINE:
        #     self.__m_badge_status = UserBadgeWidget.offline_badge
        size = self.__m_user_image.geometry().bottomRight() - self.__m_user_image.geometry().topLeft()
        print(self.geometry().getRect())
        desired_width = size.x()//5
        width_and_height = QPoint(desired_width, desired_width)
        right_coner = self.__m_user_image.geometry().topLeft() + (size - width_and_height + QPoint(1, 1))

        # TODO
        self.__m_user_image.setStyleSheet("background : red")
        self.__m_badge_status.setStyleSheet("background : black")
        
        self.__m_badge_status.resize(width_and_height.x(), width_and_height.y())
        self.__m_badge_status.move(right_coner)
