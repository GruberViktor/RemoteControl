import os
import glob
import re
from dotmap import DotMap

from .config import config


class SensorController:
    def __init__(self):
        sensor_config = config["TEMPERATURE_SENSORS"]
        sensor_list = []
        for key, value in sensor_config.items():
            value = eval(value)
            value['id'] = key
            sensor_list.append(value)
        self.sensor_list = sorted(sensor_list, key=lambda d: d['GPIO'], reverse=True)
        
        self.sensors = DotMap()
        for sensor in self.sensor_list:
            self.sensors[sensor['id']] = DotMap({"value": False, "unit": "°C"})

        
    def read_sensors(self):
        i = 1
        for sensor in self.sensor_list:
            path = f"/sys/bus/w1/devices/w1_bus_master{i}/28-*/w1_slave"
            sensor_paths = glob.glob(path)

            values = []
            for path in sensor_paths:
                with open(path) as f:
                    value = re.search(r'(?<=t\=)\d*', f.read()).group()
                    if value:
                        values.append(float(value)/1000)
            if len(values) > 0:
                avg = sum(values)/len(values)
            else:
                avg = False
            
            self.sensors[sensor['id']].value = avg
            i += 1

    def get_sensor_dict(self):
        return self.sensors.toDict()

sc = SensorController()