

import logging
import logging.handlers
import sys , os 
import os.path as osp 

project_root = osp.abspath(osp.join(osp.dirname(osp.abspath(__file__)) ,".."))






def make_logger(file_path, max_byte = 30000, backupCount=20):
    logger = logging.getLogger()
    stream_handler = logging.StreamHandler(sys.stdout)
    stream_handler.setLevel(logging.INFO)
    logger.addHandler(stream_handler)

    log_file_root_pth =  osp.join(project_root, "logs", osp.splitext(osp.basename(file_path))[0])
    if not osp.exists(log_file_root_pth):
        os.makedirs(log_file_root_pth)

    file_handler = logging.handlers.RotatingFileHandler(osp.join(log_file_root_pth, "log.txt"), mode="a",encoding="utf-8", maxBytes=max_byte, backupCount=20)
    file_handler.setLevel(logging.DEBUG)
    logger.addHandler(file_handler)
    logger.setLevel(logging.DEBUG)
    return logger