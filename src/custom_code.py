import RPi.GPIO as GPIO
from modules.device_controller import dc

water_counter = 0
GPIO.setup(25, GPIO.IN, pull_up_down=GPIO.PUD_UP)


def check_water_sensor():
    global water_counter
    # 1 wenn leer, 0 wenn er schwimmt
    full = True if GPIO.input(25) == 0 else False
    if not full:
        water_counter += 1
        if water_counter == 30:
            dc.osmosis_valve.turn_on()
            water_counter = 0
    else:
        dc.osmosis_valve.turn_off()
