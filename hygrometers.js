let test_data = {
    "hygrometers": [
        {
            "pos": { "x": 1, "y": 1 }
        },
        {
            "pos": { "x": 1, "y": 2 }
        },
        {
            "pos": { "x": 1, "y": 3 }
        },
        {
            "pos": { "x": 1, "y": 4 }
        },
        {
            "pos": { "x": 2, "y": 1 }
        },
        {
            "pos": { "x": 2, "y": 2 }
        },
        {
            "pos": { "x": 2, "y": 3 }
        },
        {
            "pos": { "x": 2, "y": 4 }
        },
        {
            "pos": { "x": 3, "y": 1 }
        },
        {
            "pos": { "x": 3, "y": 2 }
        },
        {
            "pos": { "x": 3, "y": 3 }
        },
        {
            "pos": { "x": 3, "y": 4 }
        },
        {
            "pos": { "x": 4, "y": 1 }
        },
        {
            "pos": { "x": 4, "y": 2 }
        },
        {
            "pos": { "x": 4, "y": 3 }
        },
        {
            "pos": { "x": 4, "y": 4 }
        },
    ],

    "groups": [
        {
            "ids":
                [
                    0, 1, 2, 3
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    4, 5, 6, 7
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    8, 9, 10, 11
                ],
            "color": "#00ffffff"
        },
        {
            "ids":
                [
                    12, 13, 14, 15
                ],
            "color": "#00ffffff"
        },
    ],

    "hygrometerGridSize": { "x": 2, "y": 4 }
}


class Hygrometers {
    constructor(data) {
        this.groups = [];
        this.meters = [];
        this.size = { x: 0, y: 0 }

        for (let hygrometer_id in data.hygrometers) {
            let meter_data = data.hygrometers[hygrometer_id];

            let hygrometer = new Hygrometer(meter_data, hygrometer_id);

            this.meters[hygrometer_id] = hygrometer;
        }

        for (let g in data.groups) {
            let group = new HygrometerGroup(g);
            this.groups.push(group);

            let hygrometer_ids = data.groups[g].ids;

            for (let hygrometer_id in hygrometer_ids)
                group.addHygrometer(this.meters[hygrometer_ids[hygrometer_id]])

            group.color = data.groups[g].color
        }

        this.size = data.hygrometerGridSize;

    }

    getMeter(id) {
        for (let meter_id in this.meters) {
            let meter = this.meters[meter_id];

            if (meter.id == id)
                return meter;
        }
    }

    getGroup(id) {
        for (let group_id in this.groups) {
            let group = this.groups[group_id];

            if (group.id == id)
                return group;
        }
    }

    updateData(data) {
        for (let data_id in data.h_val) {
            let hygrometer_data = data.h_val[data_id];

            let meter = this.getMeter(hygrometer_data.id);
            meter.data = hygrometer_data.v;
            meter.volts = hygrometer_data.r;
        }

        for (let data_id in data.g) {
            let group_data = data.g[data_id];

            let group = this.getGroup(group_data.id);
            group.average = group_data.average;
            group.irrigating = group_data.watering;
        }

        this.automatic = data["auto"];
        this.period = data["period"];
        this.activeDuration = data["active"];

        this.timeUntilWatering = data["until"];
        this.timeToWater = data["left"];

        this.irrigating = data["wtr"];
    }

    setGreenhouseSize(x, y) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    location.reload();
                }
                else {
                    console.error("request failed")
                }
            }
        }
    
        request.open("GET", "http://192.168.5.71/setGreenhouseSize?x=" + x + "&y=" + y, true);
        request.send();
    }
    
    setHygrometer(moduleID, channel, x, y, min, max, hygrometerID) {
        let request = new XMLHttpRequest();
    
        request.open("GET", "http://192.168.5.71/configHygrometer?module=" + moduleID + "&channel=" + channel + "&x=" + x + "&y=" + y + "&min=" + min + "&max=" + max + "&hygrometer=" + hygrometerID, true);
        request.send();
    }
}

class HygrometerGroup {
    constructor(groupID) {
        this.groupID = groupID;

        this.hygrometers = [];
        this.color = "#00000000";

        this.irrigating = false;
        this.average = 0;
    }

    addHygrometer(hygrometer) {
        this.hygrometers.push(hygrometer);

        hygrometer.group = this;
    }
}

class Hygrometer {
    constructor(data, id) {
        this.id = id;

        this.pos = {};
        this.pos.x = data.x
        this.pos.y = data.y

        this.module = data.m;
        this.channel = data.c;

        this.map = {}
        this.map.min = data.l;
        this.map.max = data.u;

        this.data = -1;
        this.wasOK = false;
    }

    isOK() {
        if (this.data == -1)
            return false;

        return true;
    }

    remove() {
        let request = new XMLHttpRequest();
    
        request.open("GET", "http://192.168.5.71/removeHygrometer?hygrometer=" + this.id, true);
        request.send();
    }
}
var hygrometers = null;
