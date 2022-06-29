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
    logger=False,
    engineio_logger=False,
)


@sio.event
def connect(sid):
    data = {
        "sensors": sc.sensors,
        "modes": cl.modes_repr,
        "devices": dc.device_list,
        "settings": cl.current_mode.settings,
    }
    sio.emit("init", data, room=sid)


@sio.on("mode_change")
def mode_change(mode):
    cl.change_mode(mode)
    data = {"settings": cl.current_mode.settings}
    sio.emit("mode_changed", data)
    return 200


@sio.on("setting_changed")
def on_setting_changed(data):
    if data["value"] not in [True, False]:
        data["value"] = float(data["value"])
    cl.current_mode.settings[data["setting"]]["val"] = data["value"]
    settings.save_current_settings(
        cl.current_mode.__class__.__name__, cl.current_mode.settings
    )
    # sio.emit("setting_changed", data, broadcast=True, include_self=False)
    return 200


@sio.on("device_toggled")
def on_device_toggled(device):
    status = dc.toggle_device(device)
    # data = {device: status}
    # sio.emit("device_toggled_new_status", data, broadcast=True, include_self=False)
    return 200


def emit_state():
    settings_condensed = {}
    for name, setting in cl.current_mode.settings.items():
        if setting["visible"]:
            settings_condensed[name] = setting["val"]
    data = {
        "sensor_data": sc.sensors,
        "device_data": dc.device_statuses,
        "settings": settings_condensed,
        "current_mode": cl.current_mode.__class__.__name__,
    }
    sio.emit("state_update", data)


class ControllerLoop(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.settings = {}
        self.modes = modes.Mode.__subclasses__()
        self.modes_repr = [
            {"id": mode.__name__, "name": mode.display_name, "priority": mode.priority}
            for mode in self.modes
        ]
        self.modes_repr = sorted(self.modes_repr, key=lambda d: d["priority"])

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
        webpush_i = 0
        while True:
            t1 = time.time()
            # Gather data
            sc.read_sensors()

            # Run Cycle
            self.current_mode.cycle()

            # Emit data to clients
            emit_state()

            # Write data to database (every 3rd time)
            db_write_i += 1
            if db_write_i > 3:
                try:
                    koji_1_temp = sc.sensors["koji_1"]["val"]
                    # koji_2_temp = sc.sensors["koji_2"]["val"]
                    # koji_temp = (koji_1_temp + koji_2_temp) / 2
                    data = {
                        "koji_temp_avg": koji_1_temp,
                        # "room_temp": f"{round(, 1):.1f}",
                        "muro_temp": sc.sensors["muro_pt"]["val"],
                        # "muro_humidity": sc.sensors["humidity"]["val"],
                        "muro_vent": 100 if dc.muro_vent.status else 0,
                        "bed_vent": 100 if dc.bed_vent.status else 0,
                        "heater": 100 if dc.heater.status else 0,
                    }
                    database.write_to_db(data)
                    db_write_i = 0
                except KeyError:
                    pass

            # emit_notification("Test", "jawoi")
            time_to_sleep = 1 - (time.time() - t1)
            # print(time_to_sleep, flush=True)
            time.sleep(time_to_sleep if time_to_sleep > 0 else 0)

    def change_mode(self, mode):
        if type(mode) == str:
            self.current_mode = getattr(sys.modules["modes"], mode)()
        else:
            self.current_mode = mode()
        settings.update("current_mode", self.current_mode.__class__.__name__)

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


cl = ControllerLoop()
cl.start()
