import time
import serial
import re
from decimal import Decimal as d
import datetime
import threading
import inspect
import sys
from flask_socketio import SocketIO

from . import settings
from .device_controller import dc
from .sensor_controller import sc
from . import database
from .app import app
import modes


sio = SocketIO(
    app,
    cors_allowed_origins=[],
    async_mode="eventlet",
    ping_timeout=30,
    logger=True,
    engineio_logger=True,
)

@sio.event
def connect(sid):
    data = { # Dummy Data
        "sensors": sc.sensor_list,
        "modes": cl.modes_repr,
        "devices": dc.device_statuses,
        "settings":  []
    }
    sio.emit('init', data, room=sid)

@sio.on("mode_change")
def mode_change(mode):
    cl.change_mode(mode)
    sio.emit("mode_change", mode, broadcast=True, include_self=False)
    return 200

@sio.on("setting_change")
def on_setting_change(setting_name, value):
    cl.settings[setting_name] = value
    sio.emit("setting_change", value, broadcast=True, include_self=False)
    return 200

@sio.on("device_toggled")
def on_device_toggled(device):
    status = dc.toggle_device(device)
    data = {device: status}
    sio.emit("device_toggled_new_status", data, broadcast=True, include_self=False)
    return status


class ControllerLoop(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.settings = {}
        self.modes = [obj for name, obj in inspect.getmembers(modes) if inspect.isclass(obj)]
        self.modes_repr = [{'id': mode.__name__, 'name': mode.display_name, 'priority': mode.priority} for mode in self.modes]
        self.modes_repr = sorted(self.modes_repr, key=lambda d: d['priority'])

    def run(self):
        self.current_mode = settings.settings.get("current_mode")
        if self.current_mode == None:
            self.change_mode("Off")
        else:
            self.change_mode(self.current_mode)
            
        # Start Loop
        self.controller_loop()

    def controller_loop(self):
        db_write_i = 0
        while True:
            # Gather data
            t1 = time.time()
            sc.read_sensors()
            print(f"reading sensors took {time.time()-t1} seconds")

            # Run Cycle
            self.current_mode.cycle()

            # Emit data to clients
            emit_state()

            # Write data to database (every 3rd time)
            # db_write_i += 1
            # if db_write_i == 3:
            #     data.pop("koji_temp1", None)
            #     data.pop("koji_temp2", None)
            #     data = {k: float(v) for k, v in data.items()}
            #     database.write_to_db(data)
            #     db_write_i = 0

            time.sleep(1)

    def change_mode(self, mode):
        if type(mode) == str:
            self.current_mode = getattr(sys.modules['modes'], mode)
        else:
            self.current_mode = mode
        settings.update("current_mode", self.current_mode.__name__)

    # def read_sensor_values(self):
    #     try:
    #         ser_all = self.ser.read_all().decode()
    #         print(ser_all)
    #         raw = [x for x in ser_all.split("\r\n") if x][-1]
    #         ## .split() hängt einen leeren string in die liste, brauchen wir nicht.
    #         ## teilweise kommt es auch vor, dass zwei Werte ankommen. Da wird dann mit dem [-1] der letzte ausgewählt.
    #     except IndexError:
    #         return

    #     try:
    #         temps = eval(re.match(r"\[.*\]", raw).group())
    #         humi = eval(re.search(r"\(.*\)", raw).group())
    #         if self.temps == None or humi == None:
    #             return
    #     except Exception as e:
    #         print(e)
    #         print(f"{datetime.datetime.now().strftime('%H:%M:%S')} Failed reading sensors values")
    #         return
    #     # for i in range(len(temps)):
    #     #     if temps[i] == False:
    #     #         if i == 0:
    #     #             temps[i] = temps[1]
    #     #         elif i == 1:
    #     #             temps[i] = temps[0]
    #     #         elif i == 2:
    #     #             self.temps[i] = 22.0

    #     self.koji_temp1 = temps[0]
    #     self.koji_temp2 = temps[0]
    #     self.koji_temp = temps[0]
    #     self.room_temp = temps[2]
    #     self.muro_temp = temps[1]
    #     self.muro_humidity = humi[1]
    #     return {
    #         "koji_temp1": f"{round(self.koji_temp1, 1):.1f}",
    #         "koji_temp2": f"{round(self.koji_temp2, 1):.1f}",
    #         "koji_temp_avg": f"{round(self.koji_temp, 1):.1f}",
    #         "room_temp": f"{round(self.room_temp, 1):.1f}",
    #         "muro_temp": f"{round(self.muro_temp, 1):.1f}",
    #         "muro_humidity": f"{round(self.muro_humidity, 1):.1f}",
    #     }

def emit_state():
    data = {
        "sensor_data": sc.sensor_data,
        "device_data": dc.device_statuses,
        # "settings": controller.koji_settings,
        "current_mode": cl.current_mode.__name__,
    }
    sio.emit("state_update", data)


cl = ControllerLoop()
cl.start()