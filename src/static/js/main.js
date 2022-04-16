var socket = io();

function renderTemplate(template_name, data) {
    var template = document.getElementById(template_name).innerHTML;
    var rendered = Mustache.render(template, data);
    return rendered;
}

socket.on("init", (data, callback) => {
    console.log(data['sensors']);
    // Render modes
    document.getElementById('mode_container').innerHTML = '';
    data['modes'].forEach(mode => {
        html = renderTemplate('mode_template', mode);
        document.getElementById('mode_container').innerHTML += html;
    })

    // Render sensors
    document.getElementById('sensor_data').innerHTML = '';
    data['sensors'].forEach(sensor => {
        html = renderTemplate('sensor_template', sensor)
        document.getElementById('sensor_data').innerHTML += html;
    });
})

socket.on("state_update", (data, callback) => {
    const focused = document.activeElement;
    for (const [sensor, value] of Object.entries(data["sensor_data"])) {
        const elem = document.getElementById(sensor);
        if (!elem) { continue; }
        elem.innerHTML = value;
    }

    for (const [machine, state] of Object.entries(data["machine_data"])) {
        const elem = document.getElementById(machine);
        if (!elem) { continue; }
        elem.checked = state;
    }

    for (const [setting, value] of Object.entries(data["koji_settings"])) {
        const elem = document.getElementById(setting);
        if (!elem || elem === focused) { continue; }
        elem.value = value;
    }

    for (const [setting, value] of Object.entries(data["misc"])) {
        const elem = document.getElementById(setting);
        if (!elem) { continue; }
        if (elem.type == "checkbox") {
            elem.checked = value;
        } else {
            elem.value = value;
        }

    }

    document.getElementById("mode_" + data["current_mode"]).checked = true;
    const machines = document.querySelectorAll(".machine input");
    if (data["current_mode"] != "manual") {
        for (var i = 0; i < machines.length; i++) {
            machines[i].disabled = true;
            machines[i].parentElement.classList.add("disabled");
        }
    } else {
        for (var i = 0; i < machines.length; i++) {
            machines[i].disabled = false;
            machines[i].parentElement.classList.remove("disabled");
        }
    }


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

function target_temp_change() {
    target_temp = parseFloat(document.getElementById('target_temp').value);
    socket.emit('target_temp_change', target_temp);

    // const koji_max_temp_input = document.getElementById("koji_max_temp");
    // koji_max_temp_input.min = target_temp
    // if (target_temp > koji_max_temp_input.value) {
    //     koji_max_temp_input.value = target_temp;
    //     koji_max_temp_change();
    // }

    // koji_min_temp_input = document.getElementById("koji_min_temp")
    // koji_min_temp_input.min = target_temp + 2
    // if (target_temp > koji_min_temp + 2) {
    //     koji_min_temp_input.value = target_temp + 2;
    //     koji_min_temp_change();
    // }

}

socket.on("target_temp_change", (target_temp) => {
    document.getElementById("target_temp").value = target_temp;
})

function target_hum_change() {
    target_hum = parseInt(document.getElementById('target_hum').value);
    socket.emit('target_hum_change', target_hum);
}

socket.on("target_hum_change", (target_hum) => {
    document.getElementById("target_hum").value = target_hum;
})

function koji_max_temp_change() {
    koji_max_temp = parseInt(document.getElementById('koji_max_temp').value);
    socket.emit('koji_max_temp_change', koji_max_temp);
}

socket.on("koji_max_temp_change", (koji_max_temp) => {
    document.getElementById("koji_max_temp").value = koji_max_temp;
})

function koji_min_temp_change() {
    koji_min_temp = parseInt(document.getElementById('koji_min_temp').value);
    socket.emit('koji_min_temp_change', koji_min_temp);

}

socket.on("koji_min_temp_change", (koji_min_temp) => {
    document.getElementById("koji_min_temp").value = koji_min_temp;
})

function heater_lock_change() {
    value = document.getElementById('heater_lock').checked;
    socket.emit('heater_lock_change', value);
}
