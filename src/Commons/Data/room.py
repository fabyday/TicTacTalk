from src.Commons.Data import user

from  src.Commons.Audio import audio 
import threading
class Room:
    def __init__(self):
        self.m_users = {}
        self.me = {}
        self.mutex = threading.Lock()

    def recv(self, header, packet):
        
        try : 
            self.m_users[header].recv(packet)
        except : 
            self.add_user(header)
            self.m_users[header].recv(packet)



    def add_user(self, user_key):
        self.mutex.acquire()
        self.m_users[user_key] = user.User()
        self.mutex.release()        
        


    def get_voice_all(self):
        message = []
        for key in self.m_users.keys():
            if user:=self.m_users.get(key):
                msg =  user.get_voice_message()

                if msg : 
                    message.append(msg)
        overlayed_msg = audio.overlay_frames(*message)
        return overlayed_msg









