var evtSource = new EventSource("http://192.168.5.71/events", { withCredentials: false });

evtSource.addEventListener("update", (event) => {
    console.log(event.data)
    let evtObj = JSON.parse(event.data);
    hygrometers.updateData(evtObj);

    devices.update(evtObj);

    if (typeof devices_sketch !== typeof undefined)
        ReloadDeviceDisplay();
});


evtSource.addEventListener("config", (event) => {
    console.log("Config got data: " + event.data)

    let evtObj = JSON.parse(event.data);

    hygrometers = new Hygrometers(evtObj);

    devices.load(evtObj);

    if (typeof gdisplay_sketch !== typeof undefined)
        ReloadGreenhouseDisplay();
    if (typeof groups_sketch !== typeof undefined)
        ReloadGroupDisplay();
    if (typeof devices_sketch !== typeof undefined)
        ReloadDeviceDisplay();
});



evtSource.addEventListener("update_system", (event) => {
    console.log("Update system: " + event.data)
    let evtObj = JSON.parse(event.data);

    system.load(evtObj)
    modules.load(evtObj)
});



evtSource.onopen = () => {
    console.log("Events connected!");
}

evtSource.onerror = () => {
    console.log("Events disconnected!");
}