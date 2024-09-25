import queue


class User:


    def __init__(self):
        self.ip = ""
        self.port = ""
        self.voice_message_queue = queue.Queue(1000)
        # self.video_streaming_queue = queue.Queue(1000)


    def recv(self, packet):
        self.voice_message_queue.put(packet)

    def get_voice_message(self):
        try : 
            return self.voice_message_queue.get_nowait()
        except:
            return None 



    def __eq__(self, value: object) -> bool:
        pass

