function displayDevice(s, device, index) {
    s.push();
    let x_index = Math.floor(index / config.device_display_grid_size.h)
    let y_index = index % config.device_display_grid_size.h

    //console.log(x_index, y_index)

    let x_pos = x_index * (config.device_display_size.w + config.device_display_padding)
    let y_pos = y_index * (config.device_display_size.h + config.device_display_padding)

    
    s.fill(48)
    s.rect(x_pos, y_pos, config.device_display_size.w, config.device_display_size.h, 0);

    s.translate(x_pos, y_pos)
    s.push()

    s.translate(config.device_display_inside_padding, config.device_display_inside_padding);
    
    device.display(s);

    s.pop()
    s.pop()
}

function setupDeviceDisplay(s) {
    let w = Math.ceil(devices.devices.length / config.device_display_grid_size.h) * (config.device_display_size.w + config.device_display_padding) + config.device_display_padding;
    let h = config.device_display_grid_size.h * (config.device_display_size.h + config.device_display_padding) + config.device_display_padding;

    s.canvas = s.createCanvas(w, h);
    s.canvas.parent("device_display");

    devices_sketch = s;
}

function drawDeviceDisplay(s) {
    s.background(0);

    if (devices.devices.length == 0) {
        s.push();
        s.stroke(255);
        s.fill(255);
        s.textSize(64);

        let text = "Waiting for data...";
        let len = s.textWidth(text);
        s.text(text, s.width / 2 - len / 2, s.height / 2)
        s.pop();
        return;
    }

    s.push()
    s.translate(config.device_display_padding, config.device_display_padding)
    for (let d_id in devices.devices) {
        let d = devices.devices[d_id]
        displayDevice(s, d, d_id);
    }
    s.pop()
}

let devices_sketch;

function ReloadDeviceDisplay() {
    let w = Math.ceil(devices.devices.length / config.device_display_grid_size.h) * (config.device_display_size.w + config.device_display_padding) + config.device_display_padding;
    let h = config.device_display_grid_size.h * (config.device_display_size.h + config.device_display_padding) + config.device_display_padding;

    devices_sketch.resizeCanvas(w, h);
}

var deviceDisplay = function (sketch) {
    sketch.setup = () => setupDeviceDisplay(sketch)
    sketch.draw = () => drawDeviceDisplay(sketch)
};

new p5(deviceDisplay)