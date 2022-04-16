import eventlet
import eventlet.wsgi
import os

os.chdir(os.path.dirname(__file__))
eventlet.monkey_patch()

import modules

socket_.sio.run(modules.app)
