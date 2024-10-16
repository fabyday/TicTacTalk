import datetime
def get_current_timestamp():
    return int(datetime.datetime().now())

def restore_timestamp_to_object(timestamp : int ):
    return  datetime.fromtimestamp(timestamp)
