import os 

def get_project_root_path():
    return os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))