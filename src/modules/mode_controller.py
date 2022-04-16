import time
import serial
import re
from decimal import Decimal as d
import datetime
import threading

import settings
import device_controller
import database
import socket_
from app import app


class ControllerLoop(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
        self.settings = {}

    def run(self):
        # initialize sensor values
        self.modes = ["off", "koji", "drying", "manual"]
        self.current_mode = settings.settings.get("current_mode")
        if self.current_mode == None:
            self.change_mode("off")

        # Start Loop
        self.controller_loop()

    def controller_loop(self):
        db_write_i = 0
        while True:
            # Gather data
            data = self.read_sensor_values()
            if data == None:
                time.sleep(1)
                continue
            data["heater"] = (
                100 if any([rc.machine_status["heater1"], rc.machine_status["heater2"]]) else 0
            )
            data["bed_vent"] = 100 if rc.machine_status["bed_vent"] else 0
            data["muro_vent"] = 100 if rc.machine_status["muro_vent"] else 0

            # Run Cycle
            if self.current_mode == "off":
                self.currently_cooling_muro = False
                self.bed_vent_just_stopped = False
                rc.turn_all_devices_off()
            elif self.current_mode == "koji":
                try:
                    self.koji_cycle()
                except KeyError:  # What was that for?
                    pass
            elif self.current_mode == "drying":
                try:
                    self.drying_cycle()
                except KeyError:  # Same
                    pass
            elif self.current_mode == "manual":
                pass

            # Emit data to clients
            socket_.emit_state(data)

            # Write data to database (every 3rd time)
            db_write_i += 1
            if db_write_i == 3:
                data.pop("koji_temp1", None)
                data.pop("koji_temp2", None)
                data = {k: float(v) for k, v in data.items()}
                database.write_to_db(data)
                db_write_i = 0

            time.sleep(1)

    def change_mode(self, mode):
        self.current_mode = mode
        settings.update("current_mode", mode)

    def read_sensor_values(self):
        try:
            ser_all = self.ser.read_all().decode()
            print(ser_all)
            raw = [x for x in ser_all.split("\r\n") if x][-1]
            ## .split() hängt einen leeren string in die liste, brauchen wir nicht.
            ## teilweise kommt es auch vor, dass zwei Werte ankommen. Da wird dann mit dem [-1] der letzte ausgewählt.
        except IndexError:
            return

        try:
            temps = eval(re.match(r"\[.*\]", raw).group())
            humi = eval(re.search(r"\(.*\)", raw).group())
            if self.temps == None or humi == None:
                return
        except Exception as e:
            print(e)
            print(f"{datetime.datetime.now().strftime('%H:%M:%S')} Failed reading sensors values")
            return
        # for i in range(len(temps)):
        #     if temps[i] == False:
        #         if i == 0:
        #             temps[i] = temps[1]
        #         elif i == 1:
        #             temps[i] = temps[0]
        #         elif i == 2:
        #             self.temps[i] = 22.0

        self.koji_temp1 = temps[0]
        self.koji_temp2 = temps[0]
        self.koji_temp = temps[0]
        self.room_temp = temps[2]
        self.muro_temp = temps[1]
        self.muro_humidity = humi[1]
        return {
            "koji_temp1": f"{round(self.koji_temp1, 1):.1f}",
            "koji_temp2": f"{round(self.koji_temp2, 1):.1f}",
            "koji_temp_avg": f"{round(self.koji_temp, 1):.1f}",
            "room_temp": f"{round(self.room_temp, 1):.1f}",
            "muro_temp": f"{round(self.muro_temp, 1):.1f}",
            "muro_humidity": f"{round(self.muro_humidity, 1):.1f}",
        }

