from dataclasses import dataclass
import uuid
import time 
import datetime
@dataclass
class Token:
    token : uuid.UUID
    token_expired_time : int 
    token_issued_time : int  


def generate_token(self):
    token_issued_time = datetime.time()
    token_expired_time = token_issued_time + datetime.timedelta(days=30)
    return Token(token=uuid.uuid4(), token_expired_time=token_expired_time, token_issued_time=token_issued_time)