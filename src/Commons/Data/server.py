from dataclasses import dataclass



@dataclass
class Server:
    server_name : str 
    server_aliased_name : str 
    server_members : str
    server_addr : str | int 
    server_port : str | int 
    
    