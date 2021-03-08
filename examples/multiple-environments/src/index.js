'use strict';

const encryptedENV = require('encrypted-env');

const config = encryptedENV.load();

console.dir(config, { depth: 0 });
