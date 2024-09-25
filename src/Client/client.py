import socket
import threading
from queue import Queue
import asyncio

import Commons.Audio.audio as audio
import Commons.Data.room as room 
import Commons.Data.user as user

import logging 
import yaml 


HEADER_SIZE = 8 # 4 byte(ip) + 4byte(port)
CHUNK_SIZE = audio.CHUNK
packet_size = 3
PACKET_SIZE = HEADER_SIZE + CHUNK_SIZE
print(socket.gethostname())
import numpy as np 
THIS_COMPUTER = socket.gethostbyname(socket.gethostname())
SERVER = THIS_COMPUTER

PORT = 6060
ADDR = (SERVER, PORT)
THIS_PORT = 22234


users_Queue = {}

user_queue_Lock = threading.Lock()   
loop = asyncio.get_event_loop()

Room = room.Room()

def Send(client):
    while True:
            encoded_packet = audio.opus_encoder.encode(audio.get_input(), CHUNK_SIZE)
            client.sendto(encoded_packet, ADDR)


import time 
merge_recreate = False
def Merge():
    global Room
    while True:
        audio.write_output_queue(Room.get_voice_all())



async def decode_corutine(header, message):
    packet = audio.opus_decoder.decode(message, frame_size=audio.CHUNK)
    Room.recv(header, packet)

def decode_corutine2(header, message):
    packet = audio.opus_decoder.decode(message, frame_size=audio.CHUNK)
    Room.recv(header, packet)

def Recv(client):
    global user_queue_Lock, mergethread, merge_recreate
    
    # loop = asyncio.new_event_loop()

    print(client)
    # loop.run_in_executor(None, client.recvfrom, (PACKET_SIZE*20))

    # queue = Queue(100)
    # async def recv_data():
    #     while True:
    #         try : 
    #             recv_data, addr = client.recvfrom((PACKET_SIZE)*20) 
    #             print("test")
    #             queue.put(recv_data)
    #         except BlockingIOError:
    #             time.sleep(0.001)
    # a = loop.run_in_executor(None, recv_data, ())
    # print("test :", a)

    while True:
        prev_header = None 
        prev_packet = None 
        overlay_num = 0
        while True : 
            try:
                recv_data, addr = client.recvfrom((PACKET_SIZE)*20) 
            except BlockingIOError:
                recv_data = None
            
            if(recv_data):
            # audio.audio_stream_compressor.decode(recv_data)
                header = recv_data[:HEADER_SIZE]
                # ip = header[:4]
                # ip = socket.inet_ntoa(ip)
                # port = header[4:]
                body_packet = recv_data[HEADER_SIZE:]
                # asyncio.run(decode_corutine(header, body_packet))
                decode_corutine2(header, body_packet)
                # packet = audio.opus_decoder.decode(body_packet, frame_size=audio.CHUNK)
                # Room.recv(header, packet)
            
            
        audio.write_output_queue(result_packet.tobytes())
        # audio.write_output_queue(recv_data)
        # Server -> C  lient 데이터 수신
        # print(recv_data)

if __name__ == '__main__':
    # client = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
    client.bind((THIS_COMPUTER, 0))
    client.setblocking(False)

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

    
    audio.select_input_output_device(input_index, output_index, audio.callback_factory(Room))
    
    
    # input_t = threading.Thread(target=audio.read_input)
    # input_t.daemon = True
    # input_t.start()
    # output_t = threading.Thread(target=audio.write_output)
    # output_t.daemon = True
    # output_t.start()


    # NAME = input("NAME:")
    NAME = "test"

    
    # client.connect(ADDR)

    print(f'Connecting to {SERVER}:{PORT}')

    sendthread = threading.Thread(target=Send, args=(client, ))
    sendthread.daemon = True
    sendthread.start()
    # mergethread = threading.Thread(target=Merge, args=())
    # mergethread.daemon = True
    # mergethread.start()

    recvthread = threading.Thread(target=Recv, args=(client, ))
    recvthread.daemon = True
    recvthread.start()


    while True: 
        pass
        
