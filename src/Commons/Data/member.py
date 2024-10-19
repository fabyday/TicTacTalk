from dataclasses import dataclass

from .token import Token

@dataclass
class ServerMember:
    name : str 
    token : Token
    profile_image : object | None 