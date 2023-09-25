function save() {
    let request1 = new XMLHttpRequest();
    let request2 = new XMLHttpRequest();

    request1.open("GET", "http://ata_tohum_main/savefGMS", true);
    request2.open("GET", "http://ata_tohum_main/savefNET", true);
    request1.send();
    request2.send();
}

