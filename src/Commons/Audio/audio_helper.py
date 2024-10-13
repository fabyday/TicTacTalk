import numpy as np 



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
    return np.mean(npdata, axis = -1).astype(dtype=dtype).tobytes()



def merge_mono_audio_chunks(sample_width : int | np.dtype, *audio_chunks):
    """_summary_

    Args:
        sample_width (int | np.dtype): _description_
    """
    
    dtype = __sample_width2numpy_type(sample_width)
    audio_arr = [np.frombuffer(chunk, dtype=dtype).reshape(-1) for chunk in audio_chunks]
    length_list =sorted(set([ arr.shape[-1] for arr in audio_arr ]))
    
    """
    Audio_chunk 1(A1)      |             |
    Audio_chunk 2(A2)      |                                  |
    Audio_chunk 3(A3)      |                                  |
    Audio_chunk 4(A4)      |                                                       |
    ===============================================================
    
    
    expand audio chunk     |   zero      | a2+a3+a4           |      A4            |
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
