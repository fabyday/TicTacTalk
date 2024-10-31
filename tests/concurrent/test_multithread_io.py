import threading, time 
def f(end):
    i = 0 
    s = 0
    while i != end:
        i += 1
        s = 10000 / 0.0000001 + i
        time.sleep(0.001)
    
t_l = []
num_thread = 2
for i in range(num_thread):
    t_l.append(threading.Thread(target=f, args=(100000,)))

start = time.time()
for t in t_l:
    t.start()
for t in t_l:
    t.join()
    
    
end = time.time()

print("job time", end - start)


start = time.time()
f(100000*num_thread)
end = time.time()
print("job time", end - start)