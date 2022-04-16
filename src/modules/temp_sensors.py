import os
import glob
import re

import config

sensor_config = config.config["TEMPERATURE_SENSORS"]
sensor_list = []
for key, value in sensor_config.items():
    value = eval(value)
    value['id'] = key
    sensor_list.append(value)
sensor_list = sorted(sensor_list, key=lambda d: d['GPIO'], reverse=True)

for i in range(len(sensor_list)):
    path = f"/sys/bus/w1/devices/w1_bus_master{i+1}/28-*/w1_slave"
    sensor_paths = glob.glob(path)
    values = []
    for path in sensor_paths:
        with open(path) as f:
            value = re.search(r'(?<=t\=)\d*', f.read()).group()
            if value:
                values.append(float(value)/1000)
    if len(values) > 0:
        sensor_list[i]["value"] = sum(values)/len(values)
    else:
        sensor_list[i]["value"] = False

print(sensor_list)
    