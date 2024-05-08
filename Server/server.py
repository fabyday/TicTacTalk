import socket,struct
import threading
from queue import Queue
import Commons.Audio.audio as audio
import numpy as np
server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 
SERVER_IP = socket.gethostbyname(socket.gethostname())
# CHUNK_SIZE = 1024*10
CHUNK_SIZE =  audio.CHUNK
# CHUNK_SIZE = 44100
def Send():
    global send_queue
    global group
    global server
    print('Thread Send Start')
    while True:
        try:
            # print("send queue send_queue : ", len(send_queue))
            #새롭게 추가된 클라이언트가 있을 경우 Send 쓰레드를 새롭게 만들기 위해 루프를 빠져나감
            recv = send_queue.get()
            
            # print("message, ", recv[0][:10])
            # if recv == 'Group Changed':
            #     print('Group Changed')
            #     break


            #for 문을 돌면서 모든 클라이언트에게 동일한 메시지를 보냄
            for conn in group:
                # message = str(recv[0])
                message = recv[0]
                if recv[1] != conn: 
                    #client 본인이 보낸 메시지는 받을 필요가 없기 때문에 제외시킴
                    # print(message)
                    # print("send")
                    # conn.send(bytes(message.encode()))
                    # conn.send(message)
                    
                    # struct.unpack("!L", )[0]
                    port_byte = recv[1][1].to_bytes(4,"big") # port number to byte
                    extended_message = socket.inet_aton(recv[1][0])+port_byte+message
                    server.sendto(extended_message, conn)
                    # server.sendto(message, conn)
                else:
                    pass
        except:
            pass



send_queue = Queue(100)


if __name__ == '__main__':

    # PORT 지정
    PORT = 6060

    # SERVER 설정
    # SERVER = socket.gethostbyname(socket.gethostname())
    # socket.gethostname() -> PC Name
    # socket.gethostbyname(PC Name) -> IP Adress

    # Final Server Aress
    # ADDR = ("192.168.0.9", PORT)
    # ADDR = (SERVER, PORT)
    ADDR = (SERVER_IP, PORT)
    # result : ('PC Adress(IPV4)', PORT(6060))

    print(f"※STARTING※\nserver is starting......\nserver adress : {SERVER_IP}:{PORT}\n")

    # server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    # server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 

    server.bind(ADDR)
    server.setblocking(False)

    # server.listen(3)
    print(f"※LISTENING※\nserver is listening on {SERVER_IP}\n")

    count = 0 
    group = set([])
    
    sendthread = threading.Thread(target=Send, args=())
    sendthread.daemon = True
    sendthread.start()
    
    while True:
        # count += 1
        # conn, addr = server.accept()  

        # group.append(conn)
        try : 
            message = server.recvfrom(CHUNK_SIZE*100)
            msg, addr = message
            # print(addr)
            send_queue.put([msg, addr,])
        except BlockingIOError:
            continue 
        except WindowsError as e: 
            # print(e)
            # print(e.args)
            pass
            
        
        if  addr in group:
            pass
        else:
            group.add(addr)
            print("new user connected : ", addr)
        
        # print(f"※NEW CONNECTION※\n{str(addr)} connected.")

        # if count > 1:
        #     send_queue.put('Group Changed')
        #     sendthread = threading.Thread(target=Send, args=(group, send_queue))
        #     sendthread.start()
        #     pass
        # else:
        #     sendthread = threading.Thread(target=Send, args=(group, send_queue))
        #     sendthread.start()

        # #소켓에 연결된 각각의 클라이언트의 메시지를 받을 쓰레드
        # recvthread = threading.Thread(target=Recv, args=(conn, count, send_queue))
        # recvthread.start()
