from datetime import datetime
import serial
import logging

from modules.device_controller import dc
from modules.sensor_controller import sc
from modules.emails import send_email
from modules import settings

try:
    import custom_modes
except ImportError:
    pass
try:
    import custom_code
except ImportError:
    pass


class Mode:
    settings = {}

    def __init__(self):
        pass

    def cycle(self):
        pass


class Off(Mode):
    display_name = "Off"
    priority = 10
    settings = {}

    def cycle(self):
        dc.turn_off_all_devices()


class Koji(Mode):
    display_name = "Koji"
    priority = 30

    if settings.settings.get(display_name):
        settings = settings.settings[display_name]
    else:
        settings = {
            "muro_target_temp": {
                "display_name": "Muro Temperatur (°C)",
                "visible": True,
                "val": 30,
                "min_value": 20,
                "max_value": 40,
                "step": 0.5,
                "type": "number",
            },
            "muro_target_temp_hys": {
                "display_name": "Muro Temperatur Hysterese (°C)",
                "visible": True,
                "val": 2,
                "min_value": 1,
                "max_value": 5,
                "step": 0.5,
                "type": "number",
            },
            "koji_target_temp": {
                "display_name": "Ziel Koji Temperatur (°C)",
                "visible": True,
                "val": 32,
                "min": 20,
                "max": 44,
                "step": 0.5,
                "type": "number",
            },
            "koji_max_temp": {
                "display_name": "Max. Koji Temperatur (°C)",
                "visible": True,
                "val": 34,
                "min_value": 20,
                "max_value": 44,
                "step": 0.5,
                "type": "number",
            },
            "muro_target_hum": {
                "display_name": "Muro Luftfeuchtigkeit (%)",
                "visible": True,
                "val": 90,
                "min": 0,
                "max": 100,
                "step": 1,
                "type": "number",
            },
            "muro_target_hum_hys": {
                "display_name": "Muro Luftfeuchtigkeit Hysterese (%)",
                "visible": False,
                "val": 3,
                "min": 1,
                "max": 8,
                "step": 0.5,
                "type": "number",
            },
            "heater_lock": {
                "display_name": "Heizung Sperre",
                "visible": True,
                "val": False,
                "min": None,
                "max": None,
                "step": None,
                "type": "checkbox",
            },
            "muro_vent_lock": {
                "display_name": "Muro Ventilator Sperre",
                "visible": True,
                "val": False,
                "min": None,
                "max": None,
                "step": None,
                "type": "checkbox",
            },
        }

    bed_vent_just_stopped = False
    currently_cooling_muro = False
    muro_vent_just_stopped = False
    humidifier_cycle_count = 0
    sensor_read_error_count = 0

    def cycle(self):
        s = self.settings
        sensors = sc.sensors

        if self.sensor_read_error_count == 30:
            # send_email(
            #     "office@luvifermente.eu",
            #     "office@luvifermente.eu",
            #     "Muro: Sensor Read Error",
            #     "",
            # )
            self.sensor_read_error_count = 0
            dc.turn_off_all_devices()

        try:
            muro_temp = sensors["muro_pt"]["val"]
            koji_temp = sensors["koji_1"]["val"]
            # koji_1_temp = sensors["koji_1"]["val"]
            # koji_2_temp = sensors["koji_2"]["val"]
            # koji_temp = (koji_1_temp + koji_2_temp) / 2
            muro_humidity = sensors["muro_humidity"]["val"]
            # muro_temp_hum = sensors["temp_hum"]["val"]

            muro_target_temp = s["muro_target_temp"]["val"]
            muro_target_temp_hys = s["muro_target_temp_hys"]["val"]
            heater_lock = s["heater_lock"]["val"]
            muro_vent_lock = s["muro_vent_lock"]["val"]
            koji_target_temp = s["koji_target_temp"]["val"]
            koji_max_temp = s["koji_max_temp"]["val"]
            muro_target_humidity = s["muro_target_hum"]["val"]
            muro_target_humidity_hys = s["muro_target_hum_hys"]["val"]
        except KeyError as e:
            print(e.args, flush=True)
            self.sensor_read_error_count += 1
            return

        if False in [muro_temp, koji_temp]:
            self.sensor_read_error_count += 1
            return

        dc.humidity_sensor_vent.turn_on()

        ####################
        ### Muro Heizung ###

        ## Über Idealbande ###

        if muro_temp >= muro_target_temp + muro_target_temp_hys:
            dc.heater.turn_off()
            if not muro_vent_lock:
                dc.muro_vent.turn_on()
        ## Im Ideal ###
        elif (
            muro_target_temp - muro_target_temp_hys
            < muro_temp
            < muro_target_temp + muro_target_temp_hys
        ):
            if muro_temp > muro_target_temp:
                dc.heater.turn_off()
            elif muro_temp < muro_target_temp:
                if dc.muro_vent.status:
                    dc.muro_vent.turn_off()
                    self.muro_vent_just_stopped = True
        ### Unter Idealbande ###
        elif muro_temp <= muro_target_temp - muro_target_temp_hys:
            if not heater_lock:
                dc.heater.turn_on()
            dc.muro_vent.turn_off()

        #######################
        ### Koji Temperatur ###

        # Koji ist über der maximalen Temperatur
        if koji_temp >= koji_max_temp:
            dc.bed_vent.turn_on()
        elif koji_target_temp < koji_temp < koji_max_temp:
            pass
        elif koji_temp <= koji_target_temp:
            dc.bed_vent.turn_off()
            self.bed_vent_just_stopped = True

        ########################
        ### Luftfeuchtigkeit ###

        # if self.muro_vent_just_stopped:
        #     self.muro_vent_just_stopped = False
        #     dc.humidifier.turn_on()
        # if dc.humidifier.status:
        #     self.humidifier_cycle_count += 1
        #     if self.humidifier_cycle_count == 30:
        #         dc.humidifier.turn_off()
        #         self.humidifier_cycle_count = 0

        custom_code.check_water_sensor()
        if not self.currently_cooling_muro:
            if not muro_humidity == 0:
                # Damit das Relais nicht unnötig schaltet bei einem Lesefehler.

                if muro_humidity >= muro_target_humidity:
                    dc.humidifier.turn_off()
                elif (
                    muro_target_humidity
                    > muro_humidity
                    > muro_target_humidity - muro_target_humidity_hys
                ):
                    pass
                elif muro_humidity < muro_target_humidity - muro_target_humidity_hys:
                    dc.humidifier.turn_on()
        else:
            dc.humidifier.turn_off()


class Drying(Mode):
    display_name = "Trocknen"
    priority = 90

    if settings.settings.get(display_name):
        settings = settings.settings[display_name]
    else:
        settings = {
            "muro_target_temp": {
                "display_name": "Muro Temperatur (°C)",
                "visible": True,
                "val": 30,
                "min_value": 20,
                "max_value": 40,
                "step": 0.5,
                "type": "number",
            },
            "muro_target_temp_hys": {
                "display_name": "Muro Temperatur Hysterese (°C)",
                "visible": True,
                "val": 2,
                "min_value": 1,
                "max_value": 5,
                "step": 0.5,
                "type": "number",
            },
            "saturation_time": {
                "display_name": "Sättigungszeit (min)",
                "visible": True,
                "val": 10,
                "min_value": 1,
                "max_value": 60,
                "step": 0.5,
                "type": "number",
            },
            "ventilation_time": {
                "display_name": "Lüftungszeit (min)",
                "visible": True,
                "val": 2,
                "min_value": 1,
                "max_value": 60,
                "step": 0.5,
                "type": "number",
            },
            "sleeping_time": {
                "display_name": "Pausenzeit (min)",
                "visible": True,
                "val": 10,
                "min_value": 1,
                "max_value": 60,
                "step": 0.5,
                "type": "number",
            },
        }

    saturation_counter = 0
    currently_saturating = False
    ventilation_counter = 0
    currently_ventilating = False
    sleeping_counter = 0
    currenty_sleeping = True

    def cycle(self):
        s = self.settings
        sensors = sc.sensors

        try:
            muro_temp = sensors["muro_pt"]["val"]
            koji_temp = sensors["koji_1"]["val"]
            # koji_1_temp = sensors["koji_1"]["val"]
            # koji_2_temp = sensors["koji_2"]["val"]
            # koji_temp = (koji_1_temp + koji_2_temp) / 2
            # muro_humidity = sensors["humidity"]["val"]
            # muro_temp_hum = sensors["temp_hum"]["val"]

            muro_target_temp = s["muro_target_temp"]["val"]
            muro_target_temp_hys = s["muro_target_temp_hys"]["val"]
            saturation_time = s["saturation_time"]["val"]
            ventilation_time = s["ventilation_time"]["val"]
            sleeping_time = s["sleeping_time"]["val"]
        except KeyError as e:
            print(e.args, flush=True)
            self.sensor_read_error_count += 1
            return

        if False in [muro_temp, koji_temp]:
            self.sensor_read_error_count += 1
            return

        dc.humidifier.turn_off()
        dc.osmosis_valve.turn_off()
        dc.dehumidifier.turn_on()
        dc.humidity_sensor_vent.turn_on()

        if muro_temp >= muro_target_temp + muro_target_temp_hys:
            dc.heater.turn_off()
        elif (
            muro_target_temp - muro_target_temp_hys
            < muro_temp
            < muro_target_temp + muro_target_temp_hys
        ):
            if muro_temp > muro_target_temp:
                dc.heater.turn_off()
            elif muro_temp < muro_target_temp:
                pass
        ### Unter Idealbande ###
        elif muro_temp <= muro_target_temp - muro_target_temp_hys:
            dc.heater.turn_on()

        if self.saturation_counter > saturation_time * 60:
            self.currently_saturating = False
            self.currently_ventilating = True
            self.currenty_sleeping = False
            self.saturation_counter = 0

        if self.ventilation_counter > ventilation_time * 60:
            self.currently_saturating = False
            self.currently_ventilating = False
            self.currenty_sleeping = True
            self.ventilation_counter = 0

        if self.sleeping_counter > sleeping_time * 60:
            self.currently_saturating = True
            self.currently_ventilating = False
            self.currenty_sleeping = False
            self.sleeping_counter = 0

        if self.currently_saturating:
            dc.bed_vent.turn_on()
            dc.muro_vent.turn_off()
            self.saturation_counter += 1

        if self.currently_ventilating:
            dc.bed_vent.turn_on()
            dc.muro_vent.turn_on()
            self.ventilation_counter += 1

        if self.currenty_sleeping:
            dc.muro_vent.turn_off()
            dc.bed_vent.turn_off()
            self.sleeping_counter += 1


class Manual(Mode):
    display_name = "Manuell"
    priority = 100

    def cycle(self):
        dc.humidity_sensor_vent.turn_on()


# class Drying(Mode):
#     display_name = "Trocknungsmodus"
#     priority = 60
#     s = Settings()

#     def cycle(self):
#         unwanted_machines = [
#             "heater1",
#             "heater2",
#             "osmosis_valve",
#             "ultrasonic_membranes",
#             "humidifier_vent",
#         ]
#         if any([rc.machine_status[m] for m in unwanted_machines]):
#             for m in unwanted_machines:
#                 rc.turn_device_on_off(m, False)

#         humidity_cut_off = 42
#         rc.turn_device_on_off("bed_vent", True)
#         if muro_humidity > humidity_cut_off or muro_temp > 29:
#             if muro_temp > 29:
#                 self.currently_cooling_muro = True
#             rc.turn_device_on_off("dehumidifier", False)
#             rc.turn_device_on_off("muro_vent", True)
#         elif (
#             muro_humidity < humidity_cut_off
#             and not self.currently_cooling_muro
#             or muro_temp < 26
#         ):
#             self.currently_cooling_muro = False
#             rc.turn_device_on_off("muro_vent", False)
#             rc.turn_device_on_off("dehumidifier", True)
#         elif muro_humidity < 26:
#             rc.turn_device_on_off("dehumidifier", False)
#             rc.turn_device_on_off("muro_vent", False)
#             rc.turn_device_on_off("bed_vent", False)
