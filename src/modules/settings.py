import json
from dotmap import DotMap

from . import helper_functions

# This module stores the last used settings of the program,
# so that it can return to the last setting if the program
# is restarted, if there was a power outage etc.


# Load Settings
try:
    with open("settings.json", "r") as file:
        settings = json.load(file)
except FileNotFoundError:
    with open("settings.json", "w+") as file:
        settings = {}
        file.write(json.dumps(settings))


def update(setting_key, setting_value):
    settings[setting_key] = setting_value
    with open("settings.json", "w+") as file:
        file.write(json.dumps(settings))


class Settings(DotMap):
    def __setitem__(self, k, v):
        helper_functions.debounced(self.save_settings, 2)
        super(Settings, self).__setitem__(k, v)

    def save_settings(self):
        print("saving settings..")


class Setting:
    def __init__(
        self,
        display_name,
        _type,
        default_val,
        min_value=None,
        max_value=None,
        step=None,
        visible=True,
    ):
        self.display_name = display_name
        if _type not in [float, int, bool]:
            raise ValueError("User either float, int or bool")
        self._type = _type
        self.default_val = default_val
        self.val = self.default_val  # needs to overwritten with saved settings
        self.min_value = min_value
        self.max_value = max_value
        self.step = step
        self.visible = visible

    def __json__(self):
        if self._type in [float, int]:
            _type = "number"
        elif self._type == bool:
            _type = "checkbox"

        return {
            "id": self.__name__,
            "display_name": self.display_name,
            "visible": self.visible,
            "val": self.val,
            "min_value": self.min_value,
            "max_value": self.max_value,
            "step": self.step,
            "type": _type,
        }

    # def __repr__(self):
    #     return self.val
