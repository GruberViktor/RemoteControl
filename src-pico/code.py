import time
import board
import busio
from adafruit_ds18x20 import DS18X20
from adafruit_bus_device.i2c_device import I2CDevice
from adafruit_onewire.bus import OneWireBus
from micropython import const
import adafruit_scd4x

temp_sensor_info = {
    "koji": {"ow": OneWireBus(board.GP21), "name": "Koji", "unit": "°C"},
    "muro": {"ow": OneWireBus(board.GP20), "name": "Muro", "unit": "°C"},
}
temp_sensors = {}

i2c = busio.I2C(board.GP1, board.GP0)


def i2c_read_reg(i2cbus, addr, reg, result):
    while not i2cbus.try_lock():
        pass
    try:
        i2cbus.writeto_then_readfrom(addr, bytes([reg]), result)
        return result
    finally:
        i2cbus.unlock()
        return None


def i2c_write_reg(i2cbus, addr, reg, data):
    while not i2cbus.try_lock():
        pass
    try:
        buf = bytearray(1)
        buf[0] = reg
        buf.extend(data)
        i2cbus.writeto(addr, buf)
    finally:
        i2cbus.unlock()


co2_sensor = adafruit_scd4x.SCD4X(i2c)
co2_sensor.start_periodic_measurement()


def get_humidity_measurements(results):
    try:
        i2c_write_reg(i2c, 68, 0x24, bytearray([0x00]))
        time.sleep(0.05)
        data = bytearray(16)
        i2c_read_reg(i2c, 68, 0x24, data)
        t_data = data[0] << 8 | data[1]
        h_data = data[3] << 8 | data[4]
        temp = -45.0 + 175.0 * t_data / (2**16 - 1.0)
        relh = 100.0 * h_data / (2**16 - 1.0)
    except Exception as e:
        temp = False
        relh = False

    results["temp_hum"] = {
        "name": "Muro Temperatur (LF Sensor)",
        "val": temp,
        "unit": "°C",
    }
    results["humidity"] = {"name": "Muro Luftfeuchtigkeit", "val": relh, "unit": "%"}


def init_sensors():
    for name, data in temp_sensor_info.items():
        devices = data["ow"].scan()
        temp_sensors[name] = []
        for dev in devices:
            try:
                sensor = DS18X20(data["ow"], dev)
            except ValueError:
                continue
            sensor.resolution = 12
            temp_sensors[name].append(sensor)


def get_temps(results):
    for name, sensor_list in temp_sensors.items():
        temps = []
        if len(sensor_list) == 0:
            init_sensors()
        for sensor in sensor_list:
            try:
                temp = sensor.temperature
            except RuntimeError:
                init_sensors()
                temp = False
            if temp in [85.0, -127.0]:
                temp = False
            else:
                temps.append(temp)
        if len(temps) > 0:
            avg = sum(temps) / len(temps)
        else:
            avg = False
        results[name] = {
            "val": avg,
            "name": temp_sensor_info[name]["name"],
            "unit": temp_sensor_info[name]["unit"],
        }


init_sensors()
while True:
    t1 = time.monotonic()
    results = {}
    try:
        get_temps(results)
        get_humidity_measurements(results)
        results["co2"] = {"val": co2_sensor.CO2, "name": "CO2", "unit": "ppm"}
        print(results)
    except:
        pass
    t2 = time.monotonic()
    time_to_sleep = 1 - (t2 - t1)
    time.sleep(0 if time_to_sleep < 0 else time_to_sleep)
