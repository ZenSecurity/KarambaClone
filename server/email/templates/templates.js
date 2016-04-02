/*global __dirname:true*/
var path = require('path');
var swig = require('swig');

function getTemplateFile(subdir) {
    return swig.compileFile(path.join(__dirname, subdir, 'body.html'));
}

function getTemplateStr(str) {
    return swig.compile(str, {autoescape: false});
}


module.exports = {
    'send-contact': {
        subj: getTemplateStr('[Landing Page] Sent contact from {{ from }}'),
        tpl: getTemplateFile('send-contact')
    }
};
