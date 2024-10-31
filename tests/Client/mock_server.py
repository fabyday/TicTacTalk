import tests 

from src.Commons import Network as net 
import threading 
import wave
from src.Commons import Network
from src.Commons import path_finder 
import os.path as osp 
from src.Commons.Audio import *



# opus_encoder = opuslib.Encoder(fs = RATE, channels=1, application=opuslib.APPLICATION_VOIP)
# opus_decoder = opuslib.Decoder(fs = RATE, channels=1)
# def opus_decode(data :bytes):
#     return opus_decoder.decode(data, CHUNK)
     


# def opus_encode(data):
#     return opus_encoder.encode(data, CHUNK)

class MockServer:
    def __init__(self):
        self.__m_client_num = 2
        self.__m_network_manager = net.connection.AsyncServerConnectionManager(server_ip="localhost", tcp_server_port=12345, upd_server_port=12346)
        # self.__m_network_manager.initialize()
        # self.test = net.connection.UDPWorker()
        # self.test.init()
        self.w1 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "1.wav"), "r")
        self.w2 = wave.open(osp.join(path_finder.get_project_root_path(), "data", "2.wav"), "r")
        
        
        
    def run(self):
        import time 
        # self.__m_network_manager.initialize()
        w1frames = self.w1.getnframes()
        w2frames = self.w2.getnframes()
        frame_rate = self.w1.getframerate()
        
        print(w1frames)
        byte_size = 0
        start = time.time()
        ct = 0
        from src.Commons.Audio import audio_manager as ad
        o_info = ad.AudioManager().enumerate_output_device()[1]
        audiv = ad.AudioManager().create_output_device(o_info)
        from src.Commons.Audio import audio_helper
        encode_voice1, decode_voice1 = audio_helper.audio_init("both")
        encode_voice2, decode_voice2 = audio_helper.audio_init("both")
        
        while True : 
            # voice_packet = Network.packet.VoicePacket()
            # print( self.w1.getnchannels(), self.w1.getsampwidth())
            # print( self.w2.getnchannels(), self.w2.getsampwidth())
            # CHUNKSIZE= CHUNK*2
            chunk1 = self.w1.readframes(CHUNK)
            chunk2 = self.w2.readframes(CHUNK)

            chunk1 = audio_helper.stereo2mono(chunk1, self.w1.getnchannels(), self.w1.getsampwidth())
            chunk2 = audio_helper.stereo2mono(chunk2, self.w2.getnchannels(), self.w2.getsampwidth())
            if len(chunk1) != len(chunk2):
                self.w2.rewind()
                self.w1.rewind()
                print("rewidnd")
                continue
            # chunk2s= []
            # for i in range(1):
            #     chunk2 = audio_helper.stereo2mono(chunk2[CHUNKSIZE*i:CHUNKSIZE*(i+1)], self.w2.getnchannels(), self.w2.getsampwidth())
            #     print("fsize " , len(chunk2))
            #     chunk2 = audio_helper.opus_encode(chunk2)
            #     p2 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 9090), time_stamp=100, codec="opus",user_name="2", voice_data=chunk2)
            #     # chunk2s.append(chunk2)
            #     self.__m_network_manager.send_udp_message(chunk2)
            # chunk2 = audio_helper.stereo2mono(chunk2, self.w2.getnchannels(), self.w2.getsampwidth())
            
            # print(len(chunk1))
            tmp = chunk1
            # chunk1 = audio_helper.opus_encode(chunk1)
            chunk1 = encode_voice1(chunk1)
            # tmp = audio_helper.opus_decode(chunk1)
            # tmp = decode_voice(chunk1)
            # audiv.get_ad().write(tmp)
            # audiv.put_audio(tmp)
            chunk2 = encode_voice2(chunk2)
            # chunk2 = audio_helper.opus_encode(chunk2)
            p1 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 13441), time_stamp=100, codec="opus",user_name="1", voice_data=chunk1)
            p2 = Network.packet.VoicePacket(("localhost", 8080),("localhost", 13441), time_stamp=100, codec="opus",user_name="2", voice_data=chunk2)
            byte_size += len(p1.voice_data)
            self.__m_network_manager.send_udp_message(p1)
            self.__m_network_manager.send_udp_message(p2)
            
            end = time.time()
            if (end - start) > 1.0:
                print(" {}  MB/s ".format(byte_size/(1024*1024))  )
                start = end 
                byte_size = 0
                


if __name__ == "__main__":
    print("server is running")
    MockServer().run()
    
    
    