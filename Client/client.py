import socket
import threading
from queue import Queue

import Commons.Audio.audio as audio
HEADER_SIZE = 8 # 4 byte(ip) + 4byte(port)
CHUNK_SIZE = audio.CHUNK
packet_size = 3
PACKET_SIZE = HEADER_SIZE + CHUNK_SIZE
print(socket.gethostname())
import numpy as np 
THIS_COMPUTER = socket.gethostbyname(socket.gethostname())
SERVER = THIS_COMPUTER

print(THIS_COMPUTER, SERVER)
PORT = 6060
ADDR = (SERVER, PORT)
THIS_PORT = 22234


users = {}
Queue(20)
    


def Send(client):
    while True:
            encoded_packet = audio.opus_encoder.encode(audio.get_input(), audio.CHUNK)
            client.sendto(encoded_packet, ADDR)


def Recv(client):
    
    
    print(client)
    while True:
        prev_header = None 
        prev_packet = None 
        overlay_num = 0
        while True : 
            recv_data, addr = client.recvfrom((PACKET_SIZE)*20) 
            # audio.audio_stream_compressor.decode(recv_data)
            header = recv_data[:HEADER_SIZE]
            ip = header[:4]
            ip = socket.inet_ntoa(ip)
            port = header[4:]
            port
            print("{} : {}".format(ip, int.from_bytes(port, "big")))
            
            body_packet = recv_data[HEADER_SIZE:]
            if header == prev_header:
                flag = False
                prev_header = header
            else : 
                prev_header = header
            
            
            packet = audio.opus_decoder.decode(body_packet, frame_size=audio.CHUNK*3)
            packet = np.frombuffer(packet, dtype=np.int16)
            print(packet)
            if not flag :
                prev_packet = packet 
                break
            
            if prev_packet == None :
                prev_packet = packet
            else :
                prev_packet += packet 
            overlay_num += 1
            print("test", overlay_num)
        overlay_denom = float(1.0/overlay_num)
        print(overlay_denom)
        result_packet = prev_packet
        overlay_num = 1
        audio.write_output_queue(result_packet.tobytes())
        # audio.write_output_queue(recv_data)
        # Server -> Client 데이터 수신
        # print(recv_data)

if __name__ == '__main__':
    # client = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
    client.bind((THIS_COMPUTER, 0))
    # client.setblocking(False)

    audio.init()
    for i in audio.enumerate_input_device():
        print("index : {}, name : {} max input channels : {}".format(i.get("index"), i.get("name"), i.get("maxInputChannels")))
    input_index = input("select index : ")
    try:
        input_index = int(input_index)
    except:
        input_index = 0
        print("except")

    finally:
        print(audio.get_device_nums(), input_index)
        print(0<input_index)
        print(input_index >= audio.get_device_nums())
        if 0>input_index or input_index >= audio.get_device_nums():
            input_index = 0
     
    for i in audio.enumerate_output_device():
        print("index : {}, name : {} maxInput channels : {} maxOutput channels : {}".format(i.get("index"), i.get("name"), i.get("maxInputChannels"), i.get("maxOutputChannels")))
    output_index = input("select index : ")
    try:
        output_index = int(output_index)
    except:
        output_index = 0
        print("except")
    finally:
        if 0>output_index or output_index >= audio.get_device_nums():
            output_index = 0
    print(input_index)
    print(output_index)
    audio.select_input_output_device(input_index, output_index)
    
    
    input_t = threading.Thread(target=audio.read_input)
    input_t.daemon = True
    input_t.start()
    output_t = threading.Thread(target=audio.write_output)
    output_t.daemon = True
    output_t.start()


    # NAME = input("NAME:")
    NAME = "test"

    
    # client.connect(ADDR)

    print(f'Connecting to {SERVER}:{PORT}')

    sendthread = threading.Thread(target=Send, args=(client, ))
    sendthread.daemon = True
    sendthread.start()

    recvthread = threading.Thread(target=Recv, args=(client, ))
    recvthread.daemon = True
    recvthread.start()
