var path = require('path');
var express = require("express");
var compression = require('compression');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var PORT = Number(process.env.PORT) || 8080;

function run() {
    // Web config
    var app = express();
    var http = require('http').Server(app);

    // Set web options & middleware
    app.disable('x-powered-by');
    app.use(compression());

    app.use(express.static(path.join(appRoot, 'client')));
    app.use('/lib', express.static(path.join(appRoot, 'node_modules')));

    app.use(cookieParser());
    app.use(express.basicAuth('testUser', 'testPass'));

    // Setup routes (order matters)
    //
    //require(appRoot + '/app/web/api-validate')(app).setupRoutes();

    // Listen port
    //
    http.listen(PORT, function () {
        console.log(" [Web] Listening on %s...", PORT);
    });
}

module.exports = {
    run: run
};
