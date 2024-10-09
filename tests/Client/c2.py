import socket
import socket
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional


@dataclass
class AbstractPacket(ABC):
    src_ip: str
    dest_ip: str
    timestamp: Optional[str] = None

    @abstractmethod
    def display_info(self):
        pass

    @abstractmethod
    def to_bytes(self) -> bytes:
        pass

    @classmethod
    @abstractmethod
    def from_bytes(cls, data: bytes) -> 'AbstractPacket':
        pass


@dataclass
class VoicePacket(AbstractPacket):
    codec: str
    payload: bytes

    def __post_init__(self):
        if self.timestamp is None:
            from datetime import datetime
            self.timestamp = datetime.now().isoformat()

    def display_info(self):
        print(f"Voice Packet:")
        print(f"  Source IP: {self.src_ip}")
        print(f"  Destination IP: {self.dest_ip}")
        print(f"  Codec: {self.codec}")
        print(f"  Payload Size: {len(self.payload)} bytes")
        print(f"  Timestamp: {self.timestamp}")

    def to_bytes(self) -> bytes:
        payload_length = len(self.payload)
        return (
            f"VoicePacket|{self.src_ip}|{self.dest_ip}|{self.codec}|{self.timestamp}|{payload_length}|".encode() +
            self.payload
        )

    @classmethod
    def from_bytes(cls, data: bytes) -> 'VoicePacket':
        parts = data.decode().split('|')
        if len(parts) < 6:
            raise ValueError("Insufficient data to deserialize VoicePacket.")
        
        src_ip = parts[1]
        dest_ip = parts[2]
        codec = parts[3]
        timestamp = parts[4]
        payload_length = int(parts[5])
        
        # 페이로드 위치 계산
        payload_start = len('|'.join(parts[:6]).encode())
        payload = data[payload_start:payload_start + payload_length]

        return cls(src_ip, dest_ip, codec, payload, timestamp)


@dataclass
class InfoPacket(AbstractPacket):
    info_type: str
    data: str

    def __post_init__(self):
        if self.timestamp is None:
            from datetime import datetime
            self.timestamp = datetime.now().isoformat()

    def display_info(self):
        print(f"Info Packet:")
        print(f"  Source IP: {self.src_ip}")
        print(f"  Destination IP: {self.dest_ip}")
        print(f"  Info Type: {self.info_type}")
        print(f"  Data: {self.data}")
        print(f"  Timestamp: {self.timestamp}")

    def to_bytes(self) -> bytes:
        data_length = len(self.data.encode())
        return (
            f"InfoPacket|{self.src_ip}|{self.dest_ip}|{self.info_type}|{self.data}|{self.timestamp}|{data_length}|"
        ).encode()

    @classmethod
    def from_bytes(cls, data: bytes) -> 'InfoPacket':
        parts = data.decode().split('|')
        if len(parts) < 6:
            raise ValueError("Insufficient data to deserialize InfoPacket.")
        
        src_ip = parts[1]
        dest_ip = parts[2]
        info_type = parts[3]
        info_data = parts[4]
        timestamp = parts[5]
        
        # 가변 데이터의 길이를 결정
        data_length = int(parts[6])
        data_start = len('|'.join(parts[:7]).encode())
        info_data = data[data_start:data_start + data_length].decode()

        return cls(src_ip, dest_ip, info_type, info_data, timestamp)
    
def send_packets():
    client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client_socket.connect(('localhost', 65432))

    # VoicePacket 전송
    voice_packet = VoicePacket(
        src_ip="192.168.1.1",
        dest_ip="192.168.1.2",
        codec="Opus",
        payload=b'Voice data here'
    )
    client_socket.sendall(voice_packet.to_bytes())

    # InfoPacket 전송
    info_packet = InfoPacket(
        src_ip="192.168.1.3",
        dest_ip="192.168.1.4",
        info_type="Status",
        data="All systems operational"
    )
    client_socket.sendall(info_packet.to_bytes())

    client_socket.close()

if __name__ == "__main__":
    send_packets()