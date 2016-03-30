var jsonParser = require('body-parser').json();


function Api(app) {
    var U = {};

    function setupRoutes() {
        // Form submit on landing page
        app.post('/api/send-contact', jsonParser, sendHelloMessage);

        return U;
    }

    // Say Hello
    //
    function sendHelloMessage(req, res, next) {
        var data = req.body;
        console.log('[API] Contact received', JSON.stringify(data));

        // TODO - something more interesting

        return res.json({result: true});
    }

    U.setupRoutes = setupRoutes;
    return U;
}


module.exports = Api;
