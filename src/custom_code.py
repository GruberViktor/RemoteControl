import RPi.GPIO as GPIO

water_counter = 0
def check_water_sensor():
    global water_counter
    # 1 wenn leer, 0 wenn er schwimmt
    full = True if GPIO.input(23) == 0 else False
    if not full:
        water_counter += 1
        if water_counter == 5:
            turn_device_on_off("osmosis_valve", True)
            water_counter = 0
    else:
        turn_device_on_off("osmosis_valve", False)
