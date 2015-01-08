var RefineSharedWorkerServer = function (self) {
    var ports = self.ports = [];

    self.addEventListener("connect", function (e) {
        var port = e.ports[0];
        port.start();

        port.postMessage('refine:connect');

        ports.push(port);

        port.addEventListener("message", function (e) {
            if (e.data === "refine:close") {
                for (var i in ports) {
                    if (ports[i] === port) {
                        ports.splice(i, 1);
                    }
                }
                e.stopPropagation();
                //var event = new CustomEvent("disconnect");
                //event.data = {port: port};
                //self.dispatchEvent(event);
            }
        }, true);
    }, false);

    return self;
};