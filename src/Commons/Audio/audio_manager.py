import pyaudio

from dataclasses import dataclass
from ..Data.shared_objects import SharedQueueBuffer
from typing  import Literal
@dataclass
class DeviceInfo:
    """
        DeviceInfo
        warapper PAudio library DeviceInfo structure.
    """
    index : int
    structVersion: int 	
    name : str 
    hostApi : int
    maxInputChannels : int
    maxOutputChannels : int 
    defaultLowInputLatency : float
    defaultLowOutputLatency : float
    defaultHighInputLatency : float
    defaultHighOutputLatency : float
    defaultSampleRate : float
    
# predefined audio data
CHUNK = 2880 # 0.25sec
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 48000   

import numpy as np 

zero = np.ones((CHUNK*RATE), dtype=np.int16)
zero_byte = zero.tobytes()
import queue
class AudioDevice():
    def __init__(self):
        self.__m_input_queue = queue.Queue()
        self.__m_output_queue = queue.Queue()
        
    
    def init(self, stream : pyaudio.Stream):
        self.__m_stream = stream
    
    
    def get_ad(self):
        return self.__m_stream
    
    
    
    def get_output_audio_callback(self):
        def callback(in_data, frame_count, time_info, status):
            data = self.__m_input_queue.get()
            return (data, pyaudio.paContinue)
        return callback

    
    def get_input_audio_callback(self):
        global zero_byte
        def callback(in_data, frame_count, time_info, status):
            self.__m_input_queue.put(in_data)
            return (None, pyaudio.paContinue)
        return callback
        
    
    def put_audio(self, audio_chunk : bytes):
        self.__m_input_queue.put(audio_chunk)
        # with self.__m_input_queue as q : 
            # q.put(audio_chunk)
        
    def get_audio(self) -> bytes:
        with self.__m_output_queue as q : 
            item = q.get() 
        return item 
    
    
    def get_chunk_size(self):
        pass
    
    
    def get_sample_size(self):
        pass 
    
    def get_frame_size(self):
        pass 
        
    def get_channel_num(self):
        pass
    



        
class AudioManager:
    
    """
        Audio Manager
            this class is singleton class
    """
    def __init__(self):
        self.__m_audio_manager  = pyaudio.PyAudio()
        
    def __get_device_num(self) -> int:
        
        info = self.__m_audio_manager.get_host_api_info_by_index(0)
        dev_num = info.get("deviceCount")
        return dev_num
    
    
    def enumerate_input_device(self) :
        """
        enumerate_input_device

        Returns:
            DeviceInfo : device info see also Class DeviceInfo
        """
        dev_num = self.__get_device_num()

        dev_list = []
        for i in range(dev_num):
            dev_info = self.__m_audio_manager.get_device_info_by_host_api_device_index(0, i)
            dev_info = DeviceInfo(**dev_info)
            if dev_info.maxInputChannels > 0:
                dev_list.append(dev_info)
        return dev_list
    
    
    def enumerate_output_device(self):
        """
        enumerate_input_device

        Returns:
            DeviceInfo : device info see also Class DeviceInfo
        """
        dev_num = self.__get_device_num()
        dev_list = []
        for i in range(dev_num):
            dev_info = self.__m_audio_manager.get_device_info_by_host_api_device_index(0, i)
            dev_info = DeviceInfo(**dev_info)
            if dev_info.maxOutputChannels > 0:
                dev_list.append(dev_info)
        return dev_list

    def create_input_device(self, in_dev_info : DeviceInfo):
        device = AudioDevice()

        stream = self.__m_audio_manager.open(format=FORMAT,
                        channels=1,
                        rate=RATE,
                        input_device_index = in_dev_info.index,
                        input = True,
                        frames_per_buffer = CHUNK,
                        stream_callback= device.get_input_audio_callback()
                        )
        device.init(stream)
        return device
    def create_output_device(self, out_dev_info : DeviceInfo):
        device = AudioDevice()
        stream = self.__m_audio_manager.open(format=FORMAT,
                        channels=1,
                        rate=RATE,
                        output_device_index = out_dev_info.index,
                        output = True,
                        frames_per_buffer = CHUNK,
                        stream_callback= device.get_output_audio_callback()
                        )
        device.init(stream)
        return device
         
    def create_device(self, in_dev_info : DeviceInfo, out_dev_info : DeviceInfo):
        """
        create audio device
        

        Args:
            in_dev_info (DeviceInfo): selected device info from enumerate_input_device method
            out_dev_info (DeviceInfo): selected device info from enumerate_output_device method

        Returns:
            AudioDevice: AudioDevice
        """
        device = AudioDevice()
        print("fai")
        print(in_dev_info)
        print(out_dev_info)
        # stream = self.__m_audio_manager.open(for/mat=8,
        stream = self.__m_audio_manager.open(format=FORMAT,
                        channels=1,
                        rate=RATE,
                        input_device_index= in_dev_info.index,
                        output_device_index = out_dev_info.index,
                        input = True,
                        output = True,
                        frames_per_buffer = CHUNK,
                        stream_callback= device.get_input_audio_callback()
                        )
        
        device.init(stream)
        
        return device
        
  
    def __new__(cls):
        if not hasattr(cls, "__instance"):
            cls.__instance = super(AudioManager, cls).__new__(cls)
        return cls.__instance

    
    