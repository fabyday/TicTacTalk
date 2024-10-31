import multiprocessing as mt 
import numpy as np 

import log_h 





#######################
##

# simple data init

test_size = 2048
dtype= np.int16
byte_data = np.zeros(test_size, dtype=dtype).tobytes()
assert len(byte_data) == 2*test_size, "size is different What I expected." + len(byte_data)
    


def socket_send_function(queue : mt.Queue):
    def average_all(byte_sended_per_sec, queue_time, send_time):
        print(byte_sended_per_sec)
        print(len(byte_sended_per_sec))
        mean_byte_send_per_sec = sum(byte_sended_per_sec)/ (1 if  len(byte_sended_per_sec)  <= 0 else len(byte_sended_per_sec))
        queue_time_mean = sum(queue_time) / (1 if len(queue_time) <= 0 else len(queue_time))
        trans_time_mean = sum(send_time) / (1 if len(send_time) <= 0 else len(send_time))
        return mean_byte_send_per_sec, queue_time_mean, trans_time_mean
    import socket 
    import time 
    logger = log_h.make_logger(__file__)

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM) # udp 
    global_time = start = time.time() 
    sended_bytes = 0
    byte_sended_per_sec = []
    queue_time = []
    send_time = []
    print("start")
    while True : 
        queue_start = time.time()
        bdata = queue.get()
        queue_end = time.time()
        spt =  queue_end - queue_start
        queue_time.append(spt)
        # logger.debug("%s spent time : %f", "get()",)
        
        sended_bytes += len(bdata)

        send_start = time.time()
        # sock.sendto(bdata, ("localhost", 9080))
        send_end = time.time()
        send_t = send_end - send_start
        send_time.append(send_t)
        # logger.debug("%s spent time : %f", "get()", )
        
        total_spent_time = send_end - start
        if  total_spent_time >= 1.0: 
            byte_sended_per_sec.append(sended_bytes)
            # logger.debug("%f mb/s", sended_bytes/1024/1024)
            start = send_end
            sended_bytes = 0
            
        if send_end - global_time >= 60:
            global_time = send_end
            avg_b, avg_q, avg_t = average_all(byte_sended_per_sec, queue_time, send_time)
            logger.debug("%f mb/s,  avg_get_queue :  %f, avg_transmit time : %f", avg_b/1024/1024, avg_q, avg_t)
            byte_sended_per_sec = []
            queue_time = []
            send_time = []
            
            
            
    
    



if __name__ == "__main__":
    queue_mt = mt.Queue(100)
    
    process = mt.Process(target=socket_send_function, args=(queue_mt, ))
    process.daemon = True
    process.start()
    
    
    while True : 
        queue_mt.put(byte_data)
        
