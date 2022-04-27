import os
import glob
import re
import time
import serial
import traceback
import datetime
from dotmap import DotMap

from .config import config


class SensorController:
    def __init__(self):
        self.sensor_config = config["TEMPERATURE_SENSORS"]
        self.serial_config = config["SERIAL"]

        # self.init_ds18b20_sensors()
        self.init_serial()

        self.sensors = {}

    def init_ds18b20_sensors(self):
        sensor_list = []
        for key, value in self.sensor_config.items():
            value = eval(value)
            value["id"] = key
            value["unit"] = "°C"
            sensor_list.append(value)
        self.ds18b20_sensor_list = sorted(
            sensor_list, key=lambda d: d["GPIO"], reverse=True
        )

        self.sensors = DotMap()
        for sensor in self.ds18b20_sensor_list:
            self.sensors[sensor["id"]] = {"val": False, "unit": "°C"}

    def init_serial(self):
        try:
            self.ser = serial.Serial(
                port=self.serial_config["port"],
                baudrate=self.serial_config["baudrate"],
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                bytesize=serial.EIGHTBITS,
                timeout=int(self.serial_config["timeout"]),
            )
        except serial.serialutil.SerialException:
            self.ser = serial.Serial(
                port=self.serial_config["port"].replace("0", "1"),
                baudrate=self.serial_config["baudrate"],
                parity=serial.PARITY_NONE,
                stopbits=serial.STOPBITS_ONE,
                bytesize=serial.EIGHTBITS,
                timeout=int(self.serial_config["timeout"]),
            )

    def read_sensors(self):
        ## DS18B20 Sensors
        i = 1
        # for sensor in self.ds18b20_sensor_list:
        #     path = f"/sys/bus/w1/devices/w1_bus_master{i}/28-*/w1_slave"
        #     sensor_paths = glob.glob(path)

        #     values = []
        #     for path in sensor_paths:
        #         with open(path) as f:
        #             content = f.read()
        #             # This is too slow. Two things could be improved: have the resolution of
        #             # the sensor decreased, and reading the sensors in threads. Async file
        #             # reading in python uses threads anyway as far as I remember.
        #             value = re.search(r"(?<=t\=)\d*", content)
        #             if value:
        #                 values.append(float(value.group()) / 1000)
        #     if len(values) > 0:
        #         avg = round(sum(values) / len(values), 2)
        #     else:
        #         avg = False

        #     self.sensors[sensor["id"]].value = avg
        #     i += 1

        ## Serial - Pico
        try:
            ser_all = self.ser.read_all().decode().replace("\n", "")
        except OSError:
            print("no serial device found")
        print(ser_all)
        if len(ser_all) > 0:
            try:
                # sensor_data = DotMap(eval(ser_all))
                self.sensors = eval(ser_all)
                if self.sensors["muro"]["val"] == False:
                    self.sensors["muro"]["val"] = self.sensors["temp_hum"]["val"]
            except Exception as e:
                print(datetime.datetime.now(), e)

    @property
    def sensor_data(self):
        return self.sensors


sc = SensorController()
sc.read_sensors()
