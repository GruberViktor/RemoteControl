import RPi.GPIO as GPIO
from modules.device_controller import dc

water_counter = 0


def check_water_sensor():
    global water_counter
    # 1 wenn leer, 0 wenn er schwimmt
    full = True if GPIO.input(23) == 0 else False
    if not full:
        water_counter += 1
        if water_counter == 5:
            dc.osmosis_valve.turn_on()
            water_counter = 0
    else:
        dc.osmosis_valve.turn_off()
