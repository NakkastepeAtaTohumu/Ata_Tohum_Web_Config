let greenhousePos = {}

let greenhouse_height = 500;//(hygrometers.size.x * config.cell_size.h) + ((hygrometers.size.x - 1) * config.cell_padding) + config.greenhouse_soil_padding + config.greenhouse_padding;
let greenhouse_width = 500; //(hygrometers.size.y * config.cell_size.w) + ((hygrometers.size.y - 1) * config.cell_padding) + config.greenhouse_soil_padding + config.greenhouse_padding;

let selectedHygrometer = null;

function drawGreenhouseBG(s) {
    s.push();

    s.stroke(0);

    s.fill(config.greenhouse_color);
    s.rect(-greenhouse_width / 2, -greenhouse_height / 2, greenhouse_width, greenhouse_height)

    let width = greenhouse_width - config.greenhouse_soil_padding;
    let height = greenhouse_height - config.greenhouse_soil_padding;

    s.fill(config.greenhouse_soil_color);
    //s.fill(120, 50, 0)
    s.rect(-width / 2, -height / 2, width, height)

    s.pop();
}

function drawHygrometerCell(s, cell) {
    s.push();

    s.stroke(0);

    let fill = cell.isOK() ? 200 : "#ff7f00";

    let text = cell.isOK() ? Math.floor(cell.data) + "%" : "!";

    if (selectedHygrometer && selectedHygrometer.id == cell.id)
        fill = "#40ff40";

    s.fill(fill);

    s.rect(cell.screenpos.x - config.cell_size.w / 2, cell.screenpos.y - config.cell_size.h / 2, config.cell_size.w, config.cell_size.h);

    s.stroke(0);
    s.fill(0);

    s.textSize(config.cell_data_fontsize);

    let len = s.textWidth(text);

    s.noStroke(0);
    if (cell.isOK() && cell.group && cell.group.irrigating) {
        s.text(text, cell.screenpos.x - len / 2, cell.screenpos.y + config.cell_data_fontsize / 2 - 25);

        s.push();

        let text2 = "WTR";
        s.textSize(config.cell_data_fontsize - 5);

        let len2 = s.textWidth(text2);

        s.text(text2, cell.screenpos.x - len2 / 2, cell.screenpos.y + config.cell_data_fontsize / 2 + 25);

        s.pop()
    }
    else
        s.text(text, cell.screenpos.x - len / 2, cell.screenpos.y + config.cell_data_fontsize / 2);

    s.pop()
}

function areHygrometersAdjacent(c1, c2) {
    let x_diff = c1.pos.x - c2.pos.x;
    let y_diff = c1.pos.y - c2.pos.y;

    if (Math.abs(x_diff) <= 1.01 && Math.abs(y_diff) <= 0.01)
        return true;

    if (Math.abs(y_diff) <= 1.01 && Math.abs(x_diff) <= 0.01)
        return true;

    return false;
}

function drawHygrometerSelection(s, hygrometers_, color, padding) {
    s.push()
    s.fill(color)
    s.noStroke();

    for (let h_id in hygrometers_) {
        let found = false;
        let h1 = hygrometers_[h_id];

        for (let h2_id in hygrometers_) {
            let h2 = hygrometers_[h2_id];

            if (h1.id == h2.id)
                continue;

            if (areHygrometersAdjacent(h1, h2)) {
                drawLinkBetweenHygrometers(s, h1, h2, color, padding)

                found = true;
            }
        }

        if (!found)
            s.rect(h1.corners.tl.x, h1.corners.tl.y, config.cell_size.w + padding * 2, config.cell_size.h + padding * 2);
    }

    s.pop();
}

function drawHygrometerGroup(s, group, color) {
    if (!color) {
        if (!group.irrigating || s.millis() % 5000 < 2500)
            color = group.color;
        else
            color = "#007fff";
    }

    drawHygrometerSelection(s, group.hygrometers, color, config.cell_group_padding)
}

function drawLinkBetweenHygrometers(s, c1, c2, color, padding) {
    s.push()

    let avg_pos = { "x": (c1.screenpos.x + c2.screenpos.x) / 2, "y": (c1.screenpos.y + c2.screenpos.y) / 2 }

    let size_x = Math.abs(c1.screenpos.x - c2.screenpos.x) + config.cell_size.w + padding * 2;
    let size_y = Math.abs(c1.screenpos.y - c2.screenpos.y) + config.cell_size.h + padding * 2;

    s.fill(color)
    s.rect(avg_pos.x - size_x / 2, avg_pos.y - size_y / 2, size_x, size_y);

    s.pop();
}

function setHygrometerPositions() {
    for (let h_id in hygrometers.meters) {
        let cell = hygrometers.meters[h_id]
        let pos_x = config.cell_size.w + ((cell.pos.x - 1) * (config.cell_size.w + config.cell_padding)) - (hygrometers.size.x * config.cell_size.w + (hygrometers.size.x - 1) * config.cell_padding) / 2;
        let pos_y = config.cell_size.h + ((cell.pos.y - 1) * (config.cell_size.h + config.cell_padding)) - (hygrometers.size.y * config.cell_size.h + (hygrometers.size.y - 1) * config.cell_padding) / 2;

        cell.screenpos = { "x": pos_x, "y": pos_y }
    }
}

function setHygrometerCorners() {
    for (let h_id in hygrometers.meters) {
        let cell = hygrometers.meters[h_id]

        let sx = config.cell_size.w / 2 + config.cell_group_padding;
        let sy = config.cell_size.h / 2 + config.cell_group_padding;

        let tr = { "x": cell.screenpos.x + sx, "y": cell.screenpos.y - sy }
        let tl = { "x": cell.screenpos.x - sx, "y": cell.screenpos.y - sy }
        let br = { "x": cell.screenpos.x + sx, "y": cell.screenpos.y + sy }
        let bl = { "x": cell.screenpos.x - sx, "y": cell.screenpos.y + sy }

        cell.corners = { "tr": tr, "tl": tl, "br": br, "bl": bl }
    }
}

function getHoveredCell(s) {
    for (let h_id in hygrometers.meters) {
        let meter = hygrometers.meters[h_id];
        let a = meter.corners.tl;
        let b = meter.corners.br;

        let mX = s.mouseX - greenhousePos.x;
        let mY = s.mouseY - greenhousePos.y;

        if (mX > a.x && mY > a.y && mX < b.x && mY < b.y)
            return meter;
    }

    return null;
}

function drawGroups(s) {
    for (let g_id in hygrometers.groups)
        drawHygrometerGroup(s, hygrometers.groups[g_id]);
}

function setupGreenhouseDisplay(s) {
    /*
    greenhousePos.x = greenhouse_width / 2;
    greenhousePos.y = greenhouse_height / 2;

    s.canvas = s.createCanvas(greenhouse_width, greenhouse_height);
    s.canvas.parent("greenhouse_display");

    setHygrometerPositions();
    setHygrometerCorners();*/

    s.canvas = s.createCanvas(greenhouse_width, greenhouse_height);
    s.canvas.parent("greenhouse_display");
}

function drawGreenhouseDisplay(s) {
    s.background(0);

    if (!hygrometers) {
        s.stroke(255);
        s.fill(255);
        s.textSize(64);

        let text = "Waiting for data...";
        let len = s.textWidth(text);
        s.text(text, s.width / 2 - len / 2, s.height / 2)

        return;
    }

    s.push()
    s.translate(greenhousePos.x, greenhousePos.y)
    drawGreenhouseBG(s);
    drawGroups(s);

    if (s.mouseIsPressed && s.mouseX > 0 && s.mouseX < greenhouse_width && s.mouseY > 0 && s.mouseY < greenhouse_height)
        selectedHygrometer = getHoveredCell(s);
    
    for (let h_id in hygrometers.meters)
        drawHygrometerCell(s, hygrometers.meters[h_id]);

    s.pop()
}

let gdisplay_sketch;
var hygrometersSketch = function (sketch) {
    sketch.setup = () => setupGreenhouseDisplay(sketch)
    sketch.draw = () => drawGreenhouseDisplay(sketch)

    gdisplay_sketch = sketch;
};

function ReloadGreenhouseDisplay() {
    greenhousePos = {}

    greenhouse_width = (hygrometers.size.x * config.cell_size.h) + ((hygrometers.size.x - 1) * config.cell_padding) + config.greenhouse_soil_padding + config.greenhouse_padding;
    greenhouse_height = (hygrometers.size.y * config.cell_size.w) + ((hygrometers.size.y - 1) * config.cell_padding) + config.greenhouse_soil_padding + config.greenhouse_padding;

    greenhousePos.x = greenhouse_width / 2;
    greenhousePos.y = greenhouse_height / 2;

    setHygrometerPositions();
    setHygrometerCorners();

    gdisplay_sketch.resizeCanvas(greenhouse_width, greenhouse_height);
}

new p5(hygrometersSketch)