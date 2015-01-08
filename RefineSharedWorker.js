var RefineSharedWorker = function (window, url, fn) {
    (function callee() {
        var itv = setTimeout(function () {
            console.log("new SharedWorker timeout, will retry in 1 second!");
            callee();
        }, 1000);

        var worker = new SharedWorker(url);
        var port = worker.port;
        port.start();

        window.addEventListener("beforeunload", function () {
            port.postMessage('refine:close');
        });

        port.addEventListener("message", function (e) {
            if (e.data === "refine:connect") {
                console.log("new SharedWorker succeeded");
                clearTimeout(itv);
                e.stopPropagation();
                fn(worker);
            }
        }, true);
        console.log("new SharedWorker connecting...");
    })();
};