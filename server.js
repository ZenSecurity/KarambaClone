var path = require('path');
global.appRoot = path.resolve(__dirname); // global!

require('./server/app').run();
