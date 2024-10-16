class ServerDataManager:
    def __init__(self):
        self.__m_rooms = {}  



    def __new__(cls):
        if not hasattr(cls, "__instance"):
            cls.__instance = super(ServerDataManager, cls).__new__(cls)
        return cls.__instance





class ClientDataManager : 
    pass 
