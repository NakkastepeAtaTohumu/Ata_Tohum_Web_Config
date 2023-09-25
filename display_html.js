function field(name, value, id) {
    let parent = document.createElement("div");
    parent.className = "panel-value ui-container";
    parent.style = "margin: 5px; justify-content: space-between;";

    let name_element = document.createElement("div");
    name_element.style = "margin-inline:5px;  white-space: nowrap;";
    name_element.appendChild(document.createTextNode(name));

    let value_element = document.createElement("div");
    value_element.style = "font-weight: 900; color:beige; margin-inline:5px; white-space: nowrap;";
    value_element.appendChild(document.createTextNode(value));

    value_element.id = id;

    parent.appendChild(name_element);
    parent.appendChild(value_element);

    return parent;
}

function fieldAction(name, onclick) {
    let parent = document.createElement("div");
    parent.className = "panel-value ui-container";
    parent.style = "margin: 5px; justify-content: space-between;";

    let name_element = document.createElement("div");
    name_element.style = "margin-inline:5px;  white-space: nowrap;";
    name_element.appendChild(document.createTextNode(name));

    let value_element = document.createElement("div");
    value_element.style = "font-weight: 900; color:beige; margin-inline:5px; white-space: nowrap;";
    value_element.appendChild(document.createTextNode(value));

    parent.appendChild(name_element);
    parent.appendChild(value_element);

    return parent;
}

function moduleItem(name, values, mdl) {
    let container = document.createElement("div");
    container.className = "panel-container";

    let item = document.createElement("div");
    item.className = "panel";

    let name_d = document.createElement("div");
    name_d.style = "text-align: center; font-size: 60px;";
    name_d.appendChild(document.createTextNode(name));

    container.appendChild(name_d);
    container.appendChild(item);

    let values_d = document.createElement("div");
    values_d.className = "ui-container-vertical"

    for (let key in values)
        values_d.appendChild(field(key, values[key]));

    item.appendChild(values_d);

    let buttons_d = document.createElement("div");
    buttons_d.className = "panel-value ui-container";
    buttons_d.style = "margin: 5px; justify-content: space-between;";

    let restart_btn = document.createElement("button");
    //name_element.style = "margin-inline:5px;  white-space: nowrap;";
    restart_btn.className = "input-button";
    restart_btn.appendChild(document.createTextNode("Restart"));

    let remove_btn = document.createElement("button");
    //name_element.style = "margin-inline:5px;  white-space: nowrap;";
    remove_btn.className = "input-button";
    remove_btn.appendChild(document.createTextNode("Remove"));

    restart_btn.onclick = (e) => mdl.restart();

    buttons_d.appendChild(restart_btn);
    //buttons_d.appendChild(remove_btn);
    item.appendChild(buttons_d);


    return container;
}

function ModulesDisplay(parentID) {
    this.displayObjs = []
    this.parentID = parentID

    this.refresh = function () {
        this.parent = document.getElementById(this.parentID);

        for (let n in this.displayObjs)
            this.displayObjs[n].remove()

        for (let module_id in modules.modules) {
            $("#wait_data").hide(0);
            let mdl = modules.modules[module_id];

            let item_d = {
                "Chip ID:": mdl.mac,
                "Online:": mdl.online ? "YES" : "NO",
                "Type:": mdl.type,
                "Ping:": Math.floor(mdl.ping / 1000) + " ms",
            }

            let item = moduleItem(mdl.name, item_d, mdl);
            this.parent.appendChild(item);

            this.displayObjs.push(item)
        }
    }
}

let device_items = {}

function valveModuleItem(mdl) {
    let container = document.createElement("div");
    container.className = "panel-container";

    container.id = "dev_" + mdl.mac;

    let item = document.createElement("div");
    item.className = "panel";

    let name_d = document.createElement("div");
    name_d.style = "text-align: center;";
    name_d.appendChild(document.createTextNode(mdl.name));

    container.appendChild(name_d);
    container.appendChild(item);

    if (!mdl.ok) {
        let display_d = document.createElement("div");
        display_d.style = "text-align: center; font-size: 30px;";
        display_d.appendChild(document.createTextNode("Disconnected!"));

        item.appendChild(display_d);
        return container;
    }

    let values_d = document.createElement("div");
    values_d.className = "ui-container-vertical"

    let keys = { "State: ": [mdl.data.state, "state"] }

    for (let key in keys)
        values_d.appendChild(field(key, keys[key][0], "dev_" + mdl.mac + "_" + keys[key][1]));

    item.appendChild(values_d);

    let valve_buttons_container = document.createElement("div");
    valve_buttons_container.className = "panel-value";
    valve_buttons_container.style = "margin: 5px;";

    let label_element = document.createElement("div");
    label_element.style = "margin-inline:5px;  white-space: nowrap;";
    label_element.appendChild(document.createTextNode("Set valves:"));
    valve_buttons_container.appendChild(label_element);

    let valve_buttons_d = document.createElement("div");
    valve_buttons_d.className = "panel-value ui-container-grid";
    valve_buttons_d.style = "margin: 5px; justify-content: space-between; grid-template-columns: max-content max-content";

    for (let i = 0; i < 4; i++) {
        let valve_btn = document.createElement("button");
        //name_element.style = "margin-inline:5px;  white-space: nowrap;";
        valve_btn.className = "input-button";
        valve_btn.appendChild(document.createTextNode("Toggle " + i));
        valve_btn.onclick = (e) => mdl.setValve(i, !mdl.getValve(i));

        valve_btn.id = "dev_" + mdl.mac + "_valve_" + i + "_btn";

        if (mdl.getValve(i))
            valve_btn.style = "background-color: #AEAFA0";
        else
            valve_btn.style = "background-color: #6E6F70";

        valve_buttons_d.appendChild(valve_btn);
    }

    valve_buttons_container.appendChild(valve_buttons_d);
    item.appendChild(valve_buttons_container);

    return container;
}

function hygrometerModuleItem(mdl) {
    let container = document.createElement("div");
    container.className = "panel-container";

    container.id = "dev_" + mdl.mac;

    let item = document.createElement("div");
    item.className = "panel";
    item.id

    let name_d = document.createElement("div");
    name_d.style = "text-align: center;";
    name_d.appendChild(document.createTextNode(mdl.name));

    container.appendChild(name_d);
    container.appendChild(item);

    if (!mdl.ok) {
        let display_d = document.createElement("div");
        display_d.style = "text-align: center; font-size: 30px;";
        display_d.appendChild(document.createTextNode("Disconnected!"));

        item.appendChild(display_d);
        return container;
    }

    let values_d = document.createElement("div");
    values_d.className = "ui-container-vertical"
    values_d.id = "dev_" + mdl.mac + "_values";


    let keys = { "Channels: ": [mdl.getChannels() > 0 ? mdl.getChannels() : "None!", "channels"] }

    for (let i = 0; i < mdl.getChannels(); i += 4)
        keys[i + "-" + (i + 4)] = [(mdl.getValue(i) + ", " + mdl.getValue(i + 1) + ", " + mdl.getValue(i + 2) + ", " + mdl.getValue(i + 3)), "values-" + i];

    for (let key in keys)
        values_d.appendChild(field(key, keys[key][0], "dev_" + mdl.mac + "_" + keys[key][1]));

    item.appendChild(values_d);

    return container;
}

function UpdateHygroModule(mdl) {
    let keys = { "Channels: ": [mdl.getChannels() > 0 ? mdl.getChannels() : "None!", "channels"] }

    for (let i = 0; i < mdl.getChannels(); i += 4)
        keys[i + "-" + (i + 4)] = [(mdl.getValue(i) + ", " + mdl.getValue(i + 1) + ", " + mdl.getValue(i + 2) + ", " + mdl.getValue(i + 3)), "values-" + i];

    for (let key in keys) {
        $("#dev_" + mdl.mac + "_" + keys[key][1]).text(keys[key][0]);
        //$("#dev_" + mdl.mac + "_" + keys[key][1])[0].style += " font-size: 5px;";
    }
}

function UpdateValveModule(mdl) {
    for (let i = 0; i < 4; i++) {
        let style = "";
        if (mdl.getValve(i))
            style = "background-color: #AEAFA0";
        else
            style = "background-color: #6E6F70";

        $("#dev_" + mdl.mac + "_valve_" + i + "_btn")[0].style = style;
        $("#dev_" + mdl.mac + "_valve_" + i + "_btn").text(i + ": " + (mdl.getValve(i) ? "ON" : "OFF"));
        $("#dev_" + mdl.mac + "_valve_" + i + "_btn")[0].onclick = (e) => mdl.setValve(i, !mdl.getValve(i));
    }

    let keys = { "State: ": [mdl.data.state, "state"] }

    for (let key in keys)
        $("#dev_" + mdl.mac + "_" + keys[key][1]).text(keys[key][0])
}

function DevicesDisplay(parentID) {
    this.displayObjs = []
    this.parentID = parentID
    this.filter = [];

    this.refresh = function () {
        this.parent = document.getElementById(this.parentID);

        for (let device_id in devices.devices) {
            $("#wait_data").hide(0);

            let device = devices.devices[device_id];
            
            if (device_items[device.mac] == undefined || !device.ok) {
                let item = null;

                if (device_items[device.mac] != undefined) {
                    device_items[device.mac].remove();
                    delete device_items[device.mac];
                }

                if (this.filter.length != 0 && !this.filter.includes(device.type))
                    continue;
                
                if (device.type == "hygro")
                    item = hygrometerModuleItem(device);
                else if (device.type == "valve")
                    item = valveModuleItem(device);

                if (item != null) {
                    this.parent.appendChild(item);

                    this.displayObjs.push(item)
                    device_items[device.mac] = item;
                }
            }
            else {
                if (device.type == "hygro")
                    UpdateHygroModule(device)
                else if (device.type == "valve")
                    UpdateValveModule(device);
            }
        }
    }
}