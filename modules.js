class Module {
    constructor(data) {
        this.id = data.id;
        this.mac = data.mac;
        this.name = data.name;
        this.ping = data.ping;
        this.online = data.online;
        this.config = data.config;

        this.type = data.config.ModuleType;
    }

    restart() {
        let request = new XMLHttpRequest();

        request.open("GET", "http://192.168.5.71/restartModule?module=" + this.id, true);
        request.send();
    }
}

class Modules {
    constructor() {
        this.modules = [];
    }

    load(data) {
        this.modules = []
        for (let d_id in data.module_statistics) {
            let module = data.module_statistics[d_id];

            let d_obj = new Module(module);
            this.modules.push(d_obj);
        }
    }

    getModule(mac) {
        for (let mdl_id in this.modules) {
            let mdl = this.modules[mdl_id];

            if (mdl.mac == mac)
                return mdl;
        }
    }
}

var modules = new Modules();