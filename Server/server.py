import socket
import threading
from queue import Queue

def Send(group, send_queue):
    print('Thread Send Start')
    while True:
        try:
            #새롭게 추가된 클라이언트가 있을 경우 Send 쓰레드를 새롭게 만들기 위해 루프를 빠져나감
            recv = send_queue.get()
            if recv == 'Group Changed':
                print('Group Changed')
                break


            #for 문을 돌면서 모든 클라이언트에게 동일한 메시지를 보냄
            for conn in group:
                # message = str(recv[0])
                message = recv[0]
                if recv[1] != conn: 
                    #client 본인이 보낸 메시지는 받을 필요가 없기 때문에 제외시킴
                    # print(message)
                    # print("send")
                    # conn.send(bytes(message.encode()))
                    conn.send(message)
                else:
                    pass
        except:
            pass

def Recv(conn, count, send_queue):
    print('Thread Recv(' + str(count) + ') Start\n')
    while True:
        message = conn.recv(1024)
        
        # print(f"RECEIVE([{SERVER}:6060][Thread:{str(count)}]{message})")
        # print(f"RECEIVE([{SERVER}:6060][Thread:{str(count)}]{message})")
        send_queue.put([message, conn, count]) 
        #각각의 클라이언트의 메시지, 소켓정보, 쓰레드 번호를 send로 보냄

if __name__ == '__main__':
    send_queue = Queue()

    # PORT 지정
    PORT = 6060

    # SERVER 설정
    SERVER = socket.gethostbyname(socket.gethostname())
    # socket.gethostname() -> PC Name
    # socket.gethostbyname(PC Name) -> IP Adress

    # Final Server Aress
    ADDR = (SERVER, PORT)
    # result : ('PC Adress(IPV4)', PORT(6060))

    print(f"※STARTING※\nserver is starting......\nserver adress : {SERVER}:{PORT}\n")

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
    # server = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) 

    server.bind(ADDR)

    server.listen(3)
    print(f"※LISTENING※\nserver is listening on {SERVER}\n")

    count = 0 
    group = [] 
    
    while True:
        count += 1
        conn, addr = server.accept()  

        group.append(conn) 
        print(f"※NEW CONNECTION※\n{str(addr)} connected.")

        if count > 1:
            send_queue.put('Group Changed')
            sendthread = threading.Thread(target=Send, args=(group, send_queue))
            sendthread.start()
            pass
        else:
            sendthread = threading.Thread(target=Send, args=(group, send_queue))
            sendthread.start()

        #소켓에 연결된 각각의 클라이언트의 메시지를 받을 쓰레드
        recvthread = threading.Thread(target=Recv, args=(conn, count, send_queue))
        recvthread.start()
