var liveServer = require("live-server");

var params = {
    //port: 8181, // Set the server port. Defaults to 8080.
    //host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0.
    root: "./client", // Set root directory that's being server. Defaults to cwd.
    //open: false, // When false, it won't load your browser by default.
    //ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    //file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    //wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/lib', './node_modules']] // Mount a directory to a route.
};
liveServer.start(params);