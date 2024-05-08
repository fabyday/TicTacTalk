import Commons.Data.user as user

import Commons.Audio.audio as audio
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
        self.mutex.acquire()
        for key, user in self.m_users.items():
            msg = user.get_voice_message()
            if msg : 
                message.append(msg)
        self.mutex.release()
        if len(message) > 1:
            print("test clear")
        overlayed_msg = audio.overlay_frames(*message)
        return overlayed_msg




    def send_all(self):
        pass








