import numpy as np 
from .constants import * 
from typing import Literal


import opuslib
import scipy.signal

# opus_encoder = opuslib.Encoder(fs = RATE, channels=1, application="voip")
# opus_decoder = opuslib.Decoder(fs = RATE, channels=1)

def audio_init(init_compnent_option = Literal["encoder", "decoder", "both"], rate : int = RATE, channel_num : int = 1, app_type : int = opuslib.APPLICATION_VOIP):
    """audio_init 
    
    This function creates a new encoder and decoder, and returns encode and decode functions from the new encoder and decoder.
    If you are using multiprocessing, you should initialize the encoder and decoder in each new process that uses this function.
    
    --note-- 10/28/24
    When creating a new process, you need to initialize it in the correct position. 
    Audio encoders or decoders created before you fork or spawn a process are invalid. 
    I'm not entirely sure why, but I assume this is due to the way Python handles forked processes. 
    The main reason seems to be that the subprocess does not inherit objects from the parent process. 
    Inside the Process class in the multiprocessing module, subprocess-related objects are serialized with pickle. 
    This process ignores many global objects unrelated to the subprocess's specific function.

    To fix this, I explicitly declared the encoder and decoder objects inside the function related to the subprocess.
    
    
    -- note 10/29/24
    this cracking sound is fucking bug.(I spent a week.)
    see also https://stackoverflow.com/questions/17728706/python-portaudio-opus-encoding-decoding
    
    --additional
    this problem is encoder_state and decoder_state    
    
    see https://opus-codec.org/docs/opus_api-1.5/group__opus__encoder.html#gaa89264fd93c9da70362a0c9b96b9ca88
    Detailed Description
    
    This page describes the process and functions used to encode Opus.

    Since Opus is a stateful codec, the encoding process starts with creating an encoder state. This can be done with:

    int error;
    OpusEncoder *enc;
    enc = opus_encoder_create(Fs, channels, application, &error);
    opus_encoder_create
    OpusEncoder * opus_encoder_create(opus_int32 Fs, int channels, int application, int *error)
    Allocates and initializes an encoder state.
    OpusEncoder
    struct OpusEncoder OpusEncoder
    Opus encoder state.
    Definition: opus.h:164
    From this point, enc can be used for encoding an audio stream. An encoder state must not be used for more than one stream at the same time. Similarly, the encoder state must not be re-initialized for each frame.

    While opus_encoder_create() allocates memory for the state, it's also possible to initialize pre-allocated memory:
    
    
    
    2880
    Args:
        init_compnent_option (str, optional): _description_. choose "encoder", "decoder", "both"].
        rate (int, optional): _description_. Defaults to RATE. 44800
        channel_num (int, optional): _description_. Defaults to 1. 
        app_type (int, optional): _description_. Defaults to opuslib.APPLICATION_VOIP.
    """
    def encode_f_wrapper(encoder):
        if encoder is None :
            return lambda x : b''
        print(encoder)
        def encode(data):
            return encoder.encode(data, CHUNK)
        return encode 
    
    def decode_f_wrapper(decoder):
        if decoder is None :
            return lambda x : b''
        def decode(data):
            return decoder.decode(data, CHUNK)
        return decode
    
    decoder = None 
    encoder = None
    if init_compnent_option == "encoder" or init_compnent_option == "both" : 
        # encoder = opuslib.Encoder(fs = rate, channels= channel_num, application=app_type)
        encoder = opuslib.Encoder(fs = RATE, channels=1, application=opuslib.APPLICATION_VOIP)
    
    if init_compnent_option == "decoder" or init_compnent_option == "both" : 
        decoder = opuslib.Decoder(fs = RATE, channels= channel_num)
        # decoder = opuslib.Decoder(fs = rate, channels= channel_num)
        
    
   

    
    return encode_f_wrapper(encoder), decode_f_wrapper(decoder)
    




""" 
below function was deprecated.
"""
opus_encoder = opuslib.Encoder(fs = RATE, channels=1, application=opuslib.APPLICATION_VOIP)
opus_decoder = opuslib.Decoder(fs = RATE, channels=1)
def opus_decode(data :bytes):
    return opus_decoder.decode(data, CHUNK)
     


def opus_encode(data):
    return opus_encoder.encode(data, CHUNK)





def __sample_width2numpy_type(sample_width : int | np.dtype, signed : bool = True):
    """_summary_

    Args:
    
        sample_width (int | np.dtype): _description_
        signed (bool, optional): if True, type use signed value. 
                                but, sample width is np.dtype then it's variable will be ignored.

    Raises:
        NotImplementedError: _description_

    Returns:
        _type_: _description_
    """
    if isinstance(sample_width, type) and issubclass(sample_width, np.generic):
        dtype = sample_width
    else : 
        if sample_width == 1 : 
            dtype = np.int8 if signed else np.uint8
        elif sample_width == 2 : 
            dtype = np.int16 if signed else np.uint16
        elif sample_width == 4 : 
            dtype = np.int32 if signed else np.uint32
        elif sample_width == 8 : 
            dtype = np.int64 if signed else np.uint64
        else : 
            raise NotImplementedError("Not Supported width") 
    return dtype


def resample(x : bytes, freq : int, sample_width : int | np.dtype):
    """
        scipy resample wrapper.
    """
    dtype = __sample_width2numpy_type(sample_width)

    np_buffer = np.frombuffer(x, dtype=dtype)
    return scipy.signal.resample(np_buffer, freq).tobytes()
    
def stereo2mono(data : bytes, channel_num : int , sample_width : int | np.dtype, signed = True)->bytes:
    """_summary_

    Args:
        data (bytes): byte data  1,2, 4, 8
        channel_num (int): total channel 
        sample_width (int): each sample size. default size is 16bit(2 byte)
        signed : if True, assign signed type 
        
        
    return :
        return mereged mono audio bytes.
        
    """
       
    dtype = __sample_width2numpy_type(sample_width)
    npdata = np.frombuffer(data, dtype=dtype).reshape(-1, channel_num)
    data = np.mean(npdata, axis = -1).astype(dtype=dtype)
    
    return data.tobytes()



def merge_mono_audio_chunks(sample_width : int | np.dtype, *audio_chunks):
    """_summary_

    Args:
        sample_width (int | np.dtype): _description_
    """
    
    dtype = __sample_width2numpy_type(sample_width)
    audio_arr = [np.frombuffer(chunk, dtype=dtype).reshape(-1) for chunk in audio_chunks]
    length_list =sorted(set([ arr.shape[-1] for arr in audio_arr ]))
    
    """
    Audio_chunk 1(A1)      |=============|
    Audio_chunk 2(A2)      |==============++++++++++++++++++++|
    Audio_chunk 3(A3)      |==============++++++++++++++++++++|
    Audio_chunk 4(A4)      |===================================--------------------|
    --------------------------------------------------------------------------------------------
    
    
    expand audio chunk     |   ZeroByte |     A2+A3+A4       |      A4            |
    """
    
    
    
    max_length = length_list[-1]
    expansion_chunk = np.zeros(max_length, dtype=dtype)
    size_t = len(length_list[1:])
    for chunk in audio_arr:
        chunk_size = len(chunk)
        index = length_list.index(chunk_size)
        if index - 1 < 0 : #  if minimum size chunk.
            continue # do nothing 
        else : 
            min_size, max_size = length_list[index-1 : index + 1]
        
        expansion_chunk[ min_size : max_size ] += chunk[min_size : max_size]
            
    audio_arr = [np.concatenate([arr, expansion_chunk[len(arr):]], axis=-1, dtype=dtype) if arr.shape[-1] < max_length else arr for arr in audio_arr]
    
    merged_audio = np.mean(audio_arr, axis=0, dtype=dtype)
    return merged_audio.tobytes()



def stretching_frames(frame_data : bytes, desired_freq : int ):
    """_summary_
    for only Mono audio frame
    Args:
        frame_data (bytes): _description_
        desired_freq (int): _description_
    """
    pass

