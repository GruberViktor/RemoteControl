###################################################
### Register your controller logic here ###
###################################################

from modules.device_controller import dc
from modules.sensor_controller import sc

class Off:
    display_name = "Off"
    priority = 10

    def cycle():
        pass

class KojiMode:
    display_name = "Koji"
    priority = 30

    def cycle(self):
        ####################
        ### Muro Heizung ###
        
        ## Über Idealbande ###
        if self.muro_temp >= self.target_temp + self.hys_temp:
            self.turn_heater_on_off(False)
            rc.turn_device_on_off("muro_vent", True)
        ## Im Ideal ###
        elif self.target_temp + self.hys_temp > self.muro_temp > self.target_temp - self.hys_temp:
            if any([rc.machine_status["heater1"], rc.machine_status["heater2"]]):
                # Heizung läuft
                self.turn_heater_on_off(True)
            else:  # Heizung läuft nicht
                self.turn_heater_on_off(False)
        ### Unter Idealbande ###
        elif self.muro_temp <= self.target_temp - self.hys_temp:
            self.turn_heater_on_off(True)
            rc.turn_device_on_off("muro_vent", False)

        #######################
        ### Koji Temperatur ###
        
        # Koji ist über der maximalen Temperatur
        if self.koji_temp >= self.koji_max_temp:
            rc.turn_device_on_off("bed_vent", True)
        elif self.koji_min_temp < self.koji_temp < self.koji_max_temp:
            pass
        elif self.koji_temp <= self.koji_min_temp:
            rc.turn_device_on_off("bed_vent", False)
            self.bed_vent_just_stopped = True

        ########################
        ### Luftfeuchtigkeit ###
        
        rc.check_water_sensor()
        if not self.currently_cooling_muro:
            if not self.muro_humidity == 0:
                # Damit das Relais nicht unnötig schaltet bei einem Lesefehler.

                if self.muro_humidity >= self.target_hum:
                    rc.turn_humidifier_on_off(False)
                elif self.target_hum > self.muro_humidity > self.target_hum - self.hys_hum:
                    pass
                elif self.muro_humidity < self.target_hum - self.hys_hum:
                    rc.turn_humidifier_on_off(True)
        else:
            rc.turn_humidifier_on_off(False)

    def turn_heater_on_off(self, on_off):
        if on_off == True:
            if not self.heater_lock:
                rc.turn_heater_on_off(True)
        elif on_off == False:
            rc.turn_heater_on_off(False)

class DryingMode:
    display_name = "Drying"
    priority = 60

    def cycle(self):
        unwanted_machines = [
            "heater1",
            "heater2",
            "osmosis_valve",
            "ultrasonic_membranes",
            "humidifier_vent",
        ]
        if any([rc.machine_status[m] for m in unwanted_machines]):
            for m in unwanted_machines:
                rc.turn_device_on_off(m, False)

        humidity_cut_off = 42
        rc.turn_device_on_off("bed_vent", True)
        if self.muro_humidity > humidity_cut_off or self.muro_temp > 29:
            if self.muro_temp > 29:
                self.currently_cooling_muro = True
            rc.turn_device_on_off("dehumidifier", False)
            rc.turn_device_on_off("muro_vent", True)
        elif (
            self.muro_humidity < humidity_cut_off
            and not self.currently_cooling_muro
            or self.muro_temp < 26
        ):
            self.currently_cooling_muro = False
            rc.turn_device_on_off("muro_vent", False)
            rc.turn_device_on_off("dehumidifier", True)
        elif self.muro_humidity < 26:
            rc.turn_device_on_off("dehumidifier", False)
            rc.turn_device_on_off("muro_vent", False)
            rc.turn_device_on_off("bed_vent", False)

class Manual:
    display_name = "Manual"
    priority = 100

    def cycle():
        pass
