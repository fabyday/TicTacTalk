import socket
import threading
import Commons.Audio.audio as audio



def Send(client):
    while True:
        # str = input()
        # if str != '':
            # message = "[" + NAME + "] " + str
            # 사용자 입력
            # client.send(bytes(message.encode()))
            # Client -> Server 데이터 송신 
            client.send(audio.get_input())

def Recv(client):
    while True:
        recv_data = client.recv(1024) 
        audio.write_output_queue(recv_data)
        # Server -> Client 데이터 수신
        # print(recv_data)

if __name__ == '__main__':
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    # client = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
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
    input_t.start()
    output_t = threading.Thread(target=audio.write_output)
    output_t.start()

    SERVER = socket.gethostbyname(socket.gethostname())

    PORT = 6060

    NAME = input("NAME:")

    ADDR = (SERVER, PORT)
    
    client.connect(ADDR)

    print(f'Connecting to {SERVER}:{PORT}')

    sendthread = threading.Thread(target=Send, args=(client, ))
    sendthread.start()

    recvthread = threading.Thread(target=Recv, args=(client, ))
    recvthread.start()
