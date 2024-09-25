import threading 

import queue 
class SharedDict:
    def __init__(self):
        self.__m_lock = threading.RLock()
        self.__m_dict = dict()

    def __enter__(self):
        self.__m_lock.acquire()
        return self.__m_dict
    def __exit__(self):
        self.__m_lock.release()



class SharedQueueBuffer:
    def __init__(self):
        self.__m_queue = queue.Queue(300)
        self.__m_lock = threading.RLock()

    def __enter__(self):
        self.__m_lock.acquire()
        return self.__m_queue
    
    def __exit__(self):
        self.__m_lock.release()
