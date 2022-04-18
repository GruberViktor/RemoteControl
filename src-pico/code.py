import time
import board
import busio
from adafruit_ds18x20 import DS18X20
from adafruit_bus_device.i2c_device import I2CDevice
from adafruit_onewire.bus import OneWireBus
from micropython import const
import adafruit_scd4x

temp_sensor_pins = {
    "koji": OneWireBus(board.GP21),
    "muro": OneWireBus(board.GP20)
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


def get_humidity_measurements():
    try:
        i2c_write_reg(i2c, 68, 0x24, bytearray([0x00]))
        time.sleep(0.05)
        data = bytearray(16)
        i2c_read_reg(i2c, 68, 0x24, data)
        t_data = data[0] << 8 | data[1]
        h_data = data[3] << 8 | data[4]
        temp = -45.0 + 175.0 * t_data / (2 ** 16 - 1.0)
        relh = 100.0 * h_data / (2 ** 16 - 1.0)
    except Exception as e:
        return [{"temp_hum": False}, {"humidity": False}]
    # return "{:.2f}".format(round(temp, 2)), "{:.2f}".format(round(relh, 2))
    return [{"temp_hum": temp}, {"humidity": relh}]

def init_sensors():
    for name, ow in temp_sensor_pins.items():
        devices = ow.scan()
        temp_sensors[name] = []
        for dev in devices:
            try:
                sensor = DS18X20(ow, dev)
            except ValueError:
                continue
            sensor.resolution = 12
            temp_sensors[name].append(sensor)

def get_temps():
    all_temps = []
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
            avg = sum(temps)/len(temps)
        else:
            avg = False
        all_temps.append({name: avg})
    return all_temps

init_sensors()
while True:
    t1 = time.monotonic()
    result = []
    result.extend(get_temps())
    result.extend(get_humidity_measurements())
    result.append({"co2": co2_sensor.CO2})
    print(result)
    t2 = time.monotonic()
    time_to_sleep = 1-(t2-t1)
    time.sleep(0 if time_to_sleep < 0 else time_to_sleep)