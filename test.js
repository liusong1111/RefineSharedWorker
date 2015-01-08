// import it
importScripts("/RefineSharedWorkerServer.js");

// self is enhanced, and you can use self.addEventListener or something else freely.
var self = RefineSharedWorkerServer(self);

var es = new EventSource("/pull");

es.addEventListener("hello", function (event) {
    // if you open multiple chrome tabs(and the corresponding inspectors),
    // you will see the log only on the first console.
    self.ports[0].postMessage({eventName: "hello", eventData: event.data});
});
