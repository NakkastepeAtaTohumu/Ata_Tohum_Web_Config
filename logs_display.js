let logsScrollPos = 0;

function drawStatusBar(s) {
    s.push();

    s.noStroke();
    s.fill(128);
    s.rect(0, 0, s.width, config.status_bar_size);

    s.fill(16);
    s.rect(0, config.status_bar_handle_size, s.width, config.status_bar_size);

    s.stroke(128);
    s.textSize(config.logs_text_size);

    let entryAmount = Math.floor((config.status_bar_size - config.status_bar_handle_size) / config.logs_text_size)

    let displayed = 0;
    for (let index = logs.logs.length - 1; index >= logsScrollPos && displayed < entryAmount; index--) {
        let log_id = index - logsScrollPos;
        let log = logs.logs[log_id]

        if (settings.display_debug_logs || log.level != "DEBUG")
            displayed++;
        else
            continue;

        let color = log.level == "ERROR" ? "#ff0000" : (log.level == "WARN" ? "#ffff00" : (log.level == "DEBUG" ? "#7f7f7f" : "#ffffff"))

        let date = ((new Date() - log.timestamp) / (1000 * 60 * 60 * 24)) > (60 * 60 * 24 * 1000) ? log.timestamp.toLocaleString() : log.timestamp.toLocaleTimeString();

        let text = date + " > [" + log.source + ", " + log.level + "]: " + log.message;

        s.noStroke();
        s.textFont("Courier New")
        s.fill(color);

        s.text(text, 5, config.status_bar_size - displayed * config.logs_text_size);
    }

    s.pop();
}

function setupLogsDisplay(s) {
    let element = document.getElementById("logs_display");
    s.canvas = s.createCanvas(element.offsetWidth, element.offsetHeight);

    config.status_bar_size = element.offsetHeight;

    s.canvas.parent("logs_display");

    s.frameRate(10);
}

function drawLogsDisplay(s) {
    s.background(0);
    drawStatusBar(s);
}

var logsDisplay = function (sketch) {
    sketch.setup = () => setupLogsDisplay(sketch)
    sketch.draw = () => drawLogsDisplay(sketch)
};

new p5(logsDisplay)