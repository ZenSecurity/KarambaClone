var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var templates = require(__dirname + '/templates/templates.js');

var config = {
    auth: {
        api_user: process.env.MAIL_USER,
        api_key: process.env.MAIL_KEY
    }
};
var enabled = config.auth.api_user && config.auth.api_key;
var client = nodemailer.createTransport(sgTransport(config), {debug: true});

console.log(' [Email] enabled: %s', enabled && 'SendGrid');


// Usage: mailer.send('welcome', locals, cb)
//  {locals} must contain at least to & from fields.
//
function send(tpl_name, locals, cb) {
    cb = cb || function () {}; // optional
    var tpl = templates[tpl_name];
    var to = locals.to;
    var from = locals.from;
    var subj = tpl.subj;
    if (typeof subj === 'function') {
        subj = subj(locals);
    }

    var email = {
        from: from, // Displayed in email by SendGrid
        to: to,
        subject: subj,
        html: tpl.tpl(locals),
        generateTextFromHTML: true,
        "x-smtpapi": { "category": tpl_name } // TODO: fix
    };

    console.log('[EMAIL] Sending [%s]: [%s] -> [%s]', tpl_name, from, to);

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log('[EMAIL] Error sending [%s]: [%s] -> [%s]: ', tpl_name, from, to, err);
            return cb(err);
        }
        var resp = info.response || 'OK';

        console.log('[EMAIL] Message [%s] sent: [%s] -> [%s], response: [%s]', tpl_name, from, to, resp);
        cb(null, resp);
    });
}

function dummySend(tpl_name, locals) {
    console.log('[EMAIL] SKIPPED sending [%s]: [%s] -> [%s]: disabled by config', tpl_name, locals.from, locals.to);
}

module.exports = {
    send: enabled ? send : dummySend
};
