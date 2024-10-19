import multiprocessing as mp
from time import sleep
class C():
    def __init__(self):
        self.a =A()
        self.a.run()
class A(object):
    def __init__(self, *args, **kwargs):
        # do other stuff
        pass

    def do_something(self, i):
        sleep(0.2)
        print('%s * %s = %s' % (i, i, i*i))

    def run(self):
        processes = []

        for i in range(1000):
            p = mp.Process(target=self.do_something, args=(i,))
            p.start()
            # processes.append(p)

        # [x.start() for x in processes]

def test():
    C()
if __name__ == '__main__':
   test()