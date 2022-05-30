import RPi.GPIO as GPIO
import json

from .config import config

GPIO.setmode(GPIO.BCM)


class Device:
    """
    Defines every device with methods to turn the device on or off.

    :param _id: Shorthand name for the device, will be used in frontend id tags, do not use spaces here.
    :param gpio_pin: the physical pin the relais for the device is connected to.
    :param name: The display name for the device, spaces allowed.
    """

    def __init__(self, _id: str, gpio_pin: int, name: str):
        self.id = _id
        if type(gpio_pin) == list:
            self.gpio_pin = gpio_pin
        elif type(gpio_pin) == int:
            self.gpio_pin = [gpio_pin]
        for pin in self.gpio_pin:
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.HIGH)
        self.name = str(name)
        self.status = False

    def turn_device_on_off(self, on: bool):
        """Turn device on or off

        Args:
            on (bool): True to turn on, False to turn off
        """
        if on == True:
            for pin in self.gpio_pin:
                GPIO.output(pin, GPIO.LOW)
            self.status = True
        elif on == False:
            for pin in self.gpio_pin:
                GPIO.output(pin, GPIO.HIGH)
            self.status = False

    def turn_on(self):
        self.turn_device_on_off(True)

    def turn_off(self):
        self.turn_device_on_off(False)


class DeviceController:
    """All devices are collected and accessible through this class
    ie to turn on a device: `DeviceController_instance.heater.turn_on()`
    To turn off all devices: `DeviceController_instance.turn_off_all_devices()`
    """

    def __init__(self):
        devices = []
        for _id, device in config.items("DEVICES"):
            d = json.loads(device[:-1])
            d["id"] = _id
            devices.append(d)

        self.devices = []
        for d in devices:
            device = Device(d["id"], d["pin"], d["name"])
            setattr(self, d["id"], device)
            self.devices.append(device)

    def turn_off_all_devices(self):
        for d in self.devices:
            d.turn_off()

    def toggle_device(self, device_name):
        device = getattr(self, device_name)
        if device.status == True:
            device.turn_off()
        else:
            device.turn_on()

    def turn_off_device(self, device_name):
        getattr(self, device_name).turn_off()

    def turn_on_device(self, device_name):
        getattr(self, device_name).turn_on()

    @property
    def device_statuses(self):
        return {dev.id: dev.status for dev in self.devices}

    @property
    def device_list(self):
        return [{"id": dev.id, "name": dev.name} for dev in self.devices]


dc = DeviceController()
