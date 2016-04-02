var jsonParser = require('body-parser').json();
var mailer = require(appRoot + '/server/email/mailer');
var swig = require('swig');

var CONTACT_EMAIL = 'contact@karambasecurity.com';

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
        var email = data.email;

        console.log('[API] Sending contact of [%s]: %s', email, JSON.stringify(data));

        var from = getFullEmail(data.email, data.name);
        var to = CONTACT_EMAIL;
        var tpl = 'send-contact';
        var locals = {
            from: from,
            to: to,
            name: data.name,
            email: email,
            phone: data.phone,
            company: data.company,
            message: data.message
        };

        console.log('[API] Sending [%s] email from [%s]', tpl, from);

        mailer.send(tpl, locals, function () {
            return res.json({
                result: true,
                email: email
            });
        });
    }

    ///////

    function getFullEmail(email, name) {
        var locals = {
            name: name,
            email: email
        };
        return swig.render('{{ name }} <{{ email }}>', {locals: locals});
    }


    U.setupRoutes = setupRoutes;
    return U;
}


module.exports = Api;
