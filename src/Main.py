import eventlet
import eventlet.wsgi
import os

os.chdir(os.path.dirname(__file__))
eventlet.monkey_patch()

import modules

modules.controller_loop.sio.run(modules.app)