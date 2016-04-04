var path = require('path');
var express = require("express");
var compression = require('compression');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var auth = require('http-auth');

var PORT = Number(process.env.PORT) || 8080;
var USERNAME = 'KarambaSecurityPress';
var PASSWORD = 'UnderEmbargo';

var basicAuth = auth.basic({ realm: "Karamba"}, function (username, password, callback) {
        callback(username === USERNAME && password === PASSWORD);
    }
);


function run() {
    // Web config
    var app = express();
    app.use(auth.connect(basicAuth)); // TODO: temporary

    var http = require('http').Server(app);

    // Set web options & middleware
    app.disable('x-powered-by');
    app.use(compression());

    app.use(express.static(path.join(appRoot, 'client'), { extensions: ['html'] }));
    app.use('/lib', express.static(path.join(appRoot, 'node_modules')));

    app.use(cookieParser());

    // Setup routes (order matters)
    //
    require(appRoot + '/server/web/api-public')(app).setupRoutes();

    // Listen port
    //
    http.listen(PORT, function () {
        console.log(" [Web] Listening on %s...", PORT);
    });
}

module.exports = {
    run: run
};
