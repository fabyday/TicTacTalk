

from PyQt6.QtWidgets import  *
from PyQt6.QtCore import *
from PyQt6 import uic
from PyQt6.QtCore import QTimer, QTime
from .login import LoginWidget

import os 
pth = os.path.dirname(os.path.abspath(__file__))
print(os.path.join(pth, "chatui.ui"))
form_class = uic.loadUiType(os.path.join(pth, "test_chatroom.ui"))[0]
    
 # -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'test_chatroomLCkcVt.ui'
##
## Created by: Qt User Interface Compiler version 6.4.3
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PyQt6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PyQt6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PyQt6.QtWidgets import (QApplication, QHBoxLayout, QListWidget, QListWidgetItem,
    QMainWindow, QSizePolicy, QWidget)
import numpy as np 
import src.Commons.Audio as audio 
import time
import queue
import src.Commons.Audio.audio_manager as ad 

from src.Commons import Network as net 
import asyncio
from qasync import QEventLoop




import concurrent.futures
import copy 
from functools import partial


        
def audio_output_run( qq  ):
    o_info = ad.AudioManager().enumerate_output_device()[1]
    audiv = ad.AudioManager().create_output_device(o_info)
    track = {}
    import time 
    from ..Commons.Audio import audio_helper
    start = time.time()
    encode, decode = audio.audio_init("both")
    a = np.zeros(audio.CHUNK, dtype=np.int16).tobytes()
    print("test a", len(a))
    encode1, decode1 = audio_helper.audio_init("both")
    encode2, decode2 = audio_helper.audio_init("both")
    # a = encode(a)
    print("test a2", len(a))
    dl  = []
    start = time.time()
    
    while True:
   
    
    
    
        try : 
            pk = qq.get_nowait()
        except:
            pk = None 
        if pk is not None :
            q = track.setdefault(pk.user_name, {"queue": queue.Queue() , "decode" : audio_helper.audio_init("both")[1] } )
            q["queue"].put( q["decode"](pk.voice_data) )
        
        
            
        end = time.time()
        buffersize = 1
        if all([q["queue"].qsize() >= buffersize for q in track.values()]):
            keys = track.keys()
            #get
            for _ in range(buffersize):
                data_list = []
                for buffer_q in track.values():
                    dt =  buffer_q['queue'].get_nowait()
                    data_list.append(dt)
                # res = [audio.opus_decode(data) for data in data_list]
                res = audio.merge_mono_audio_chunks(np.int16, *data_list)
                # audiv.put_audio(res[0])
                audiv.get_ad().write(res)
            
            # print("merged time ", end - start)
            #merge 
            # audiv.get_ad().write(res)
            start = end 
        
            
            

        
import multiprocessing as mt 
class AudioProcess():
    def __init__(self , network ):
        with mt.Manager() as mng:
            # self.__m_manager = 
            self.shared_dict = mng.dict()
            self.__m_output_process = mt.Process(target= audio_output_run, name="test", args= (network.get_udp_input_queue(),))
        # self.__m_input_process = mt.Process(target= self.audio_input_run, args = (self.__m_network.get_udp_input_queue(), ))
            # self.__m_input_process = mt.Process(target= test,  name="tesst" )
        # self.__m_input_process.daemon = True
            self.__m_output_process.daemon = True

            self.__m_output_process.start()
        # self.__m_input_process.start()
        
        
        
    def audio_input_run(self , queue = None ):
        # i_info = ad.AudioManager().enumerate_input_device()[1]
        # self.input_dev = ad.AudioManager().create_input_device(i_info)
        # while True: 
        #     data = self.input_dev.get_audio()
        #     data = audio.opus_encode(data)
        #     queue.put(data)
        pass
    
    def audio_output_run(self, track = None  ):
        pass
        # o_info = ad.AudioManager().enumerate_output_device()[1]
        # self.audiv = ad.AudioManager().create_output_device(o_info)
        # while True:
        #     keys = track.keys()
        #     data_list = []
        #     #get
        #     for key in keys:
        #         dt =  track[key].get()
        #         data_list.append(dt)
            
        #     #decode 
        #     for di in range(len(data_list)):
        #         data_list[di] = audio.opus_decode(data_list[di])
                
        #     #merge 
        #     res = audio.merge_mono_audio_chunks(np.int16, *data_list)
        #     self.audiv.put_audio(res)
            
            
            
        
        
class Ui_MainWindow(QMainWindow):
    def __init__(self):
        QMainWindow.__init__(self)
        
        # print(self.m_network_proc.get_udp_addr())
        self.setupUi1(self)
        # self.loop = asyncio.get_event_loop()
        # self.loop = QEventLoop()
   

    def setupUi1(self, MainWindow):
        
        MainWindow.setCentralWidget(LoginWidget(self, self.setupUi2))
        
        
    def setupUi2(self, MainWindow, username):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(689, 814)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        self.horizontalLayout = QHBoxLayout(self.centralwidget)
        self.horizontalLayout.setObjectName(u"horizontalLayout")
        self.horizontalLayout.setContentsMargins(0, 0, 0, 0)
        self.room_list = QListWidget(self.centralwidget)
        self.room_list.setObjectName(u"room_list")

        self.horizontalLayout.addWidget(self.room_list)

        self.server_member_list = QListWidget(self.centralwidget)
        self.server_member_list.setObjectName(u"server_member_list")

        self.horizontalLayout.addWidget(self.server_member_list)

        self.horizontalLayout.setStretch(0, 4)
        self.horizontalLayout.setStretch(1, 1)
        MainWindow.setCentralWidget(self.centralwidget)

        self.retranslateUi(MainWindow)
        # self.init_audio()
        self.data = {}
        self.m_network_proc = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=12345, upd_server_port=13441)
        self.mmm = AudioProcess(self.m_network_proc)
        # self.consumer = Consumer(self.audiv, self.data, self.m_network_proc)
        # self.consumer2 = Consumer2(self.audiv, self.data, self.m_network_proc)
        # self.producer = producer(self.input_dev,  self.m_network_proc, username)
        # self.producer = producer2(self.input_dev,self.audiv,  self.m_network_proc, username, self.data)
        # self.consumer.start()
        # self.consumer2.start()
        # self.producer.start()
        
        # self.a = AudioProcess(self.m_network_proc)
    

        QMetaObject.connectSlotsByName(MainWindow)
        
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"MainWindow", None))
    # retranslateUi
    
    
    def join_user(self):
        q = QLabel(self.server_member_list)
        q.setText("test")
        print("join")
        item = QListWidgetItem(self.server_member_list)
        qq = QBrush()
        import random 
        
        qq.setColor(QColor( random.randint(0,255), random.randint(0,255), random.randint(0,255)))
        item.setBackground(qq)
        item.setText("test")

        self.server_member_list.addItem(item)
        self.server_member_list.repaint()
        
        
    def init_audio(self):
        # Room = room.Room()
        o_info = ad.AudioManager().enumerate_output_device()[1]
        self.audiv = ad.AudioManager().create_output_device(o_info)
        i_info = ad.AudioManager().enumerate_input_device()[1]
        print(i_info)
        self.input_dev = ad.AudioManager().create_input_device(i_info)
    
    


    



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
    # window = MainClass() 
    a = Ui_MainWindow()
    a.show()
    app.exec()
    # with loop:  # asyncio 이벤트 루프를 실행
        # loop.run_forever()

    
    
    
    
    