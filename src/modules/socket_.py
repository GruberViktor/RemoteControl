from flask_socketio import SocketIO

from app import app
from device_controller import dc
import mode_controller

controller = mode_controller.ControllerLoop()
controller.start()

sio = SocketIO(
    app,
    cors_allowed_origins=[],
    async_mode="eventlet",
    ping_timeout=30,
    logger=False,
    engineio_logger=False,
)


@sio.on("connect")
def on_connect(data):
    return { # Dummy Data
        "sensors": [
            {"id": "sensor1",
            "unit": "°C",
            "display_name": "Muro"
            }
        ],
        "modes": [mode.__name__ for mode in controller.modes],
        "devices": dc.device_statuses,
        "settings":  []
    }


@sio.on("mode_change")
def mode_change(mode):
    controller.change_mode(mode)
    sio.emit("mode_change", mode, broadcast=True, include_self=False)
    return 200


@sio.on("setting_change")
def on_setting_change(setting_name, value):
    controller.settings[setting_name] = value
    sio.emit("setting_change", value, broadcast=True, include_self=False)
    return 200


@sio.on("device_toggled")
def on_device_toggled(device):
    status = relais_controller.toggle_device(device)
    data = {device: status}
    sio.emit("device_toggled_new_status", data, broadcast=True, include_self=False)
    return status


def emit_state(sensor_data):
    try:
        data = {
            "sensor_data": sensor_data,
            "device_data": dc.machine_status,
            # "settings": controller.koji_settings,
            "current_mode": controller.current_mode,
        }
        sio.emit("state_update", data)
    except AttributeError:
        print("could ned emit state")

