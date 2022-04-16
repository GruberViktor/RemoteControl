import json

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
