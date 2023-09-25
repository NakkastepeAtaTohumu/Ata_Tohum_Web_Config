class Logs {
    constructor() {
        this.logs = [];
    }

    addLog(source, level, message) {
        let log_ = {
            "source": source,
            "level": level,
            "message": message,
            "timestamp": new Date()
        }

        this.logs.push(log_);
    }

    clearLogs() {
        this.logs = [];
    }

    load(data) {
        this.logs = JSON.parse(data)
    }
}

var logs = new Logs()

logs.addLog("System", "ERROR", "This is a test!!")
logs.addLog("System", "WARN", "This is a test!")
logs.addLog("System", "INFO", "This is a test.")
logs.addLog("System", "DEBUG", "test")
logs.addLog("System", "DEBUG", "test2")
logs.addLog("System", "DEBUG", "test3")
logs.addLog("System", "DEBUG", "test4")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "DEBUG", "test5")
logs.addLog("System", "INFO", "This is a test.")
logs.addLog("System", "INFO", "This is a test.")
logs.addLog("System", "INFO", "This is a test.")
logs.addLog("System", "INFO", "This is a test.")
