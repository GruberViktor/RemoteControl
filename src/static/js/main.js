var socket = io();

function renderTemplate(template_name, data) {
    var template = document.getElementById(template_name).innerHTML;
    var rendered = Mustache.render(template, data);
    return rendered;
}

function render_settings(settings) {
    const setting_container = document.getElementById("setting_container");
    setting_container.innerHTML = "";
    for (const [id, setting] of Object.entries(settings)) {
        if (setting.visible == false) continue;
        setting['id'] = id;
        html = renderTemplate('setting_template', setting);
        setting_container.innerHTML += html;
    }
}

socket.on("init", (data, callback) => {
    // Render modes
    document.getElementById('mode_container').innerHTML = '';
    data['modes'].forEach(mode => {
        html = renderTemplate('mode_template', mode);
        document.getElementById('mode_container').innerHTML += html;
    });

    // Render sensors
    document.getElementById('sensor_container').innerHTML = '';
    // data['sensors'].forEach(sensor => {
    for (const [sensor, sensor_info] of Object.entries(data["sensors"])) {
        sensor_info["id"] = sensor;
        html = renderTemplate('sensor_template', sensor_info);
        document.getElementById('sensor_container').innerHTML += html;
    };

    // Render devices
    document.getElementById('device_container').innerHTML = '';
    data['devices'].forEach(device => {
        html = renderTemplate('device_template', device)
        document.getElementById('device_container').innerHTML += html;
    });

    render_settings(data["settings"]);
})

socket.on("mode_changed", (data, callback) => {
    render_settings(data["settings"]);
})


socket.on("state_update", (state, callback) => {
    const focused = document.activeElement;
    var val;
    for (const [sensor, data] of Object.entries(state["sensor_data"])) {
        const elem = document.getElementById(sensor + '_val');
        if (!elem) { continue; }
        if (data['val'] == false || data['unit'] == 'ppm') {
            val = data['val']
        } else {
            val = data['val'].toFixed(2);
        }
        elem.innerHTML = val;
    }

    for (const [machine, status] of Object.entries(state["device_data"])) {
        const elem = document.getElementById(machine);
        if (!elem) { continue; }
        elem.checked = status;
    }

    for (const [setting, value] of Object.entries(state["settings"])) {
        const elem = document.getElementById(setting);
        if (!elem) { continue; }
        const type = elem.getAttribute('type');
        if (!elem || elem === focused) { continue; }
        if (type == "number") { elem.value = value; }
        else if (type == "checkbox") { elem.checked = value; }
    }

    // for (const [setting, value] of Object.entries(data["misc"])) {
    //     const elem = document.getElementById(setting);
    //     if (!elem) { continue; }
    //     if (elem.type == "checkbox") {
    //         elem.checked = value;
    //     } else {
    //         elem.value = value;
    //     }

    // }

    document.getElementById("mode_" + state["current_mode"]).checked = true;
    const devices = document.querySelectorAll(".device input");
    if (state["current_mode"] != "Manual") {
        for (var i = 0; i < devices.length; i++) {
            devices[i].disabled = true;
            devices[i].parentElement.classList.add("disabled");
        }
    } else {
        for (var i = 0; i < devices.length; i++) {
            devices[i].disabled = false;
            devices[i].parentElement.classList.remove("disabled");
        }
    }


})

socket.on("notification", (data, callback) => {
    show_notification(data["headline"], data["body"]);
})

function mode_change(mode) {
    socket.emit('mode_change', mode, (success) => {
        if (success) {
            console.log("Successfully changed mode");
        }
    });
}



function toggle_device(device) {
    socket.emit('device_toggled', device, (status) => {
        document.getElementById(device).checked = status;
    });
}

function on_setting_changed(setting) {
    var value;
    const elem = document.getElementById(setting);
    const type = elem.getAttribute('type');
    if (type == "number") {
        value = elem.value;
    }
    else if (type == "checkbox") {
        value = elem.checked;
    }
    data = { "setting": setting, "value": value };
    socket.emit('setting_changed', data);
}

const debounceEvent = (callback, time = 250, interval) =>
    (...args) =>
        clearTimeout(interval, interval = setTimeout(() => callback(...args), time));
function alarm() {
    alarm_audio.play();
}
const alarm_debounced = debounceEvent(alarm, 15000);