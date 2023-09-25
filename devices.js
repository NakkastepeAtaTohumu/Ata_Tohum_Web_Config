var test_device_data = {
    "devices": [
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:00",
            "data": {}
        },
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:01",
            "data": {}
        },
        {
            "name": "test_0",
            "type": "test",
            "mac": "00:00:00:00:00:02",
            "data": {}
        },
    ]
}

class Device {
    constructor(d, id) {
        this.name = d.n;
        this.type = d.t;
        this.mac = d.m;
        this.id = id
        this.data = d.d;
        this.ok = d.o;
        this.type_id = d.i;
    }

    load(d) {
        if (new Date().getTime() < this.timeout)
            return;

        this.ok = d.o;
        this.data = d.d;
    }

    display(s) {
        s.fill("#ff0000");
        s.textSize(config.device_display_textsizes[2]);
        s.text("UNKNOWN DEVICE", 0, config.device_display_textsizes[2]);

        s.fill(255);
        s.textSize(config.device_display_textsizes[0]);
        s.text("Name: " + this.name + ", type: " + this.type + "\nMAC:" + this.mac, 0, config.device_display_textsizes[2] + config.device_display_textsizes[0] + 10);
    }

    getModule() {
        return modules.getModule(this.mac);
    }
}

class HygrometerModule extends Device {
    getChannels() {
        return this.data.channels;
    }

    getValue(n) {
        return Math.floor(this.data.values[n] * 100) / 100
    }
}

class SensorModule extends Device {
    display(s) {
        s.fill(this.ok ? "#207fff" : "#FFFF00");
        s.textSize(config.device_display_textsizes[2]);
        s.text("SENSOR: " + this.name, 0, config.device_display_textsizes[2]);

        /*if (!this.ok) {
            s.textSize(config.device_display_textsizes[3]);
            s.text("ERROR", 0, config.device_display_textsizes[2] + config.device_display_textsizes[3] + 10);
            return;
        }*/

        s.fill(255);
        s.textSize(config.device_display_textsizes[1]);
        s.text("CO2: " + this.data.CO2 + "\nTemperature: " + Math.floor(this.data.temp * 10) / 10.0 + "°" + "\nHumidity:" + Math.floor(this.data.humidity * 10) / 10.0 + "%", 0, config.device_display_textsizes[2] + config.device_display_textsizes[1] + 10);
    }

    setFan(on) {
        let request = new XMLHttpRequest();

        request.open("GET", "http://192.168.5.71/setFan?module=" + this.type_id + "&state=" + on, true);
        request.send()
    }
}

class ValveModule extends Device {
    setValve(valve, state) {
        let request = new XMLHttpRequest();

        request.onload = () => {
            if (request.status == 200) {
                this.data.state = this.data.state ^ (Math.pow(2, valve))
            }
        }

        this.timeout = new Date().getTime() + 5000;

        request.open("GET", "http://192.168.5.71/toggleValve?module=" + this.type_id + "&valve=" + valve + "&state=" + (state ? 1 : 0), true);
        request.send();
    }

    getValve(valve) {
        return (this.data.state & Math.pow(2, valve)) ? true : false
    }

    display(s) {
        s.fill(this.ok ? "#207fff" : "#FFFF00");
        s.textSize(config.device_display_textsizes[2]);
        s.text("VALVE: " + this.name, 0, config.device_display_textsizes[2]);

        /*if (!this.ok) {
            s.textSize(config.device_display_textsizes[3]);
            s.text("ERROR", 0, config.device_display_textsizes[2] + config.device_display_textsizes[3] + 10);
            return;
        }*/

        s.fill(255);
        s.textSize(config.device_display_textsizes[2]);

        let str = "";
        str += this.data.state & 1 ? "ON" : "OFF";
        str += this.data.state & 2 ? " ON" : " OFF";
        str += this.data.state & 4 ? " ON" : " OFF";
        str += this.data.state & 8 ? " ON" : " OFF";

        s.text(str, 0, config.device_display_textsizes[2] + config.device_display_textsizes[2] + 10);

        s.fill(255, 192, 0);
        s.rect(12, config.device_display_textsizes[2] * 3, 64, 32);

        s.stroke(0);
        s.fill(0);
        s.textSize(config.device_display_textsizes[0]);
        s.text("S", 40, config.device_display_textsizes[2] * 3 + 24)
    }
}

class Devices {
    constructor() {
        this.devices = [];
    }

    load(data) {
        this.devices = []
        for (let d_id in data.devices) {
            let device = data.devices[d_id];

            let d_obj;

            if (device.t == "hygro")
                d_obj = new HygrometerModule(device, d_id);
            else if (device.t == "valve")
                d_obj = new ValveModule(device, d_id);
            else if (device.t == "sensor")
                d_obj = new SensorModule(device, d_id);
            else
                d_obj = new Device(device, d_id);

            this.devices.push(d_obj);
        }
    }

    update(data) {
        for (let d_id in data.devices) {
            let device_obj = data.devices[d_id];
            let device = this.devices[d_id];

            device.load(device_obj);
        }
    }

    getDeviceByName(name) {
        for (let d_id in this.devices) {
            if (this.devices[d_id].name == name)
                return this.devices[d_id];
        }
    }

    getDeviceByMAC(mac) {
        for (let d_id in this.devices) {
            if (this.devices[d_id].mac == mac)
                return this.devices[d_id];
        }
    }
}

var devices = new Devices();

//devices.load(test_device_data)