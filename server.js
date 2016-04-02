var path = require('path');
global.appRoot = path.resolve(__dirname); // global!

require('dotenv').config();
require('./server/app').run();
