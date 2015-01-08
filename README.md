# RefineSharedWorker
Fix &amp; Enhance SharedWorker

SharedWorker is promising, but it's weak and leaky, RefineSharedWorker comes here to rescue.
I hope it will be unnecessary soon :)

# Highly inspired by

[Chrome页面刷新后SharedWorker无法连接的问题](http://www.web-tinker.com/article/20722.html)

[SharedWorker缺少disconnect事件](http://www.web-tinker.com/article/20723.html)

[SharedWorker操作封装](http://www.web-tinker.com/article/20724.html)

[SharedWorker的使用场景与前景](http://www.web-tinker.com/article/20725.html)

# What & How

## workaround for a chrome's bug:

if only ONE chrome tab exists and  refresh it, chrome will occasionally fail when call `new SharedWorker(url)`

under the hood: RefineSharedWorker will retry util succeeded and pass the good worker to your callback.

## workaround for a spec's weakness:

SharedWorker has no "disconnect" event, so we have no change to listen on it.

how to fix: we enhanced self with `ports` attribute, indicates the connecting ports.

under the hood: when client window.beforeunload occurs, it posts a "refine:disconnect" message to server,
thus we can maintain connecting ports.

# Usage

test.html:

```html
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
    <script src="RefineSharedWorker.js"></script>
</head>
<body>
<script>
    // worker is the same as "new SharedWorker(url)", but now in the callback instead
    RefineSharedWorker(window, "test.js", function (worker) {
        worker.port.addEventListener("message", function (e) {
            console.info(e.data);
        }, false);

        worker.port.postMessage("hello");
    });
</script>
</body>
</html>
```

test.js:

```javascript
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
```

# License

Released under UNLICENSE.

This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.
