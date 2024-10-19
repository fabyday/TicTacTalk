from dataclasses import *
import uuid

@dataclass
class User:
    token : uuid.UUID