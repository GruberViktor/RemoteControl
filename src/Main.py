import eventlet
import eventlet.wsgi
import os

os.chdir(os.path.dirname(__file__))
eventlet.monkey_patch()

from modules import *

socket_.sio.run(app)
