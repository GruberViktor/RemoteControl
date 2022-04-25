import serial

from modules.device_controller import dc
from modules.sensor_controller import sc
from modules.settings import Settings, Setting
from modules.emails import send_email

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
    s = Settings()

    def cycle(self):
        dc.turn_off_all_devices()


class Manual(Mode):
    display_name = "Manuell"
    priority = 100


class Koji(Mode):
    display_name = "Koji"
    priority = 30

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
            "visible": False,
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
    }

    bed_vent_just_stopped = False
    currently_cooling_muro = False
    sensor_read_error_count = 0

    def cycle(self):
        s = self.settings
        sensors = sc.sensors

        try:
            muro_temp = sensors["muro"]["val"]
            muro_target_temp = s["muro_target_temp"]["val"]
            muro_target_temp_hys = s["muro_target_temp_hys"]["val"]
            heater_lock = s["heater_lock"]["val"]
            koji_target_temp = s["koji_target_temp"]["val"]
            koji_temp = sensors["koji"]["val"]
            koji_max_temp = s["koji_max_temp"]["val"]
            muro_humidity = sensors["humidity"]["val"]
            muro_target_humidity = s["muro_target_hum"]["val"]
            muro_target_humidity_hys = s["muro_target_hum_hys"]["val"]
        except KeyError as e:
            self.sensor_read_error_count += 1
            return
        finally:
            self.sensor_read_error_count = 0

        if False in [muro_temp, koji_temp, muro_humidity]:
            self.sensor_read_error_count += 1
            return

        if self.sensor_read_error_count == 10:
            send_email(
                "office@luvifermente.eu",
                "office@luvifermente.eu",
                "Muro: Sensor Read Error",
                "",
            )

        ####################
        ### Muro Heizung ###

        ## Über Idealbande ###

        if muro_temp >= muro_target_temp + muro_target_temp_hys:
            dc.heater.turn_off()
            dc.muro_vent.turn_on()
        ## Im Ideal ###
        elif (
            muro_target_temp + muro_target_temp_hys
            > muro_temp
            > muro_target_temp - muro_target_temp_hys
        ):
            pass
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
