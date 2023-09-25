function displayGroup(s, group) {
    s.push();
    let x_index = Math.floor(group.groupID / config.group_display_grid_size.h)
    let y_index = group.groupID % config.group_display_grid_size.h

    //console.log(x_index, y_index)

    let x_pos = x_index * (config.group_display_size.w + config.group_display_padding)
    let y_pos = y_index * (config.group_display_size.h + config.group_display_padding)

    let fill = group.irrigating ? "#007fff" : 256

    let avg_val = 0;
    group.hygrometers.forEach(s => { if(s.data != -1) avg_val += s.data });
    
    avg_val /= group.hygrometers.length

    s.stroke(128);
    s.strokeWeight(5)
    s.fill(fill)
    s.rect(x_pos, y_pos, config.group_display_size.w, config.group_display_size.h, 0);

    s.translate(x_pos, y_pos)
    s.push()

    s.translate(config.group_display_inside_padding, config.group_display_inside_padding);
    
    s.noStroke();
    s.fill(0);

    s.textSize(30)
    s.text("Group " + (parseInt(group.groupID) + 1), 0, 30);

    s.textSize(40);
    s.text(Math.floor(avg_val) + "%", 120, 35);
    
    let text = group.irrigating ? (hygrometers.irrigating ? "WATERING" : "WAITING") : "NOT WATERING";
    s.textSize(20);
    s.text(text, 0, 60);

    s.pop()
    s.pop()
}

function setupGroupDisplay(s) {
    //let w = Math.ceil(hygrometers.groups.length / config.group_display_grid_size.h) * (config.group_display_size.w + config.group_display_padding) + config.group_display_padding;
    //let h = Math.min(config.group_display_grid_size.h, hygrometers.groups.length) * (config.group_display_size.h + config.group_display_padding) + config.group_display_padding;

    s.canvas = s.createCanvas(500, 500);
    s.canvas.parent("group_display");

    groups_sketch = s;
}

function drawGroupDisplay(s) {
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
    s.translate(config.group_display_padding, config.group_display_padding)
    for (let g_id in hygrometers.groups) {
        let g = hygrometers.groups[g_id]
        displayGroup(s, g);
    }
    s.pop()
}

let groups_sketch

function ReloadGroupDisplay() {
    let w = Math.ceil(hygrometers.groups.length / config.group_display_grid_size.h) * (config.group_display_size.w + config.group_display_padding) + config.group_display_padding;
    let h = Math.min(config.group_display_grid_size.h, hygrometers.groups.length) * (config.group_display_size.h + config.group_display_padding) + config.group_display_padding;

    groups_sketch.resizeCanvas(w, h);
}

var groupDisplay = function (sketch) {
    sketch.setup = () => setupGroupDisplay(sketch)
    sketch.draw = () => drawGroupDisplay(sketch)
};

new p5(groupDisplay)