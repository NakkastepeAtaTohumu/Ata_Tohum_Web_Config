function System() {
    this.uptime = 0;
    this.heap = 0;
    this.heapLargestBlock = 0;

    this.load = function(data) {
        this.uptime = data.uptime        
        this.heap = data.heap        
        this.heapLargestBlock = data.block        
    }
}

var system = new System();