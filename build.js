const fs = require('fs');
const config = require('./package');
config.devDependencies = {};
config.main = './index.js';
config.typings = './index.d.ts';
config.scripts = {};
config.private = false;

fs.writeFileSync('./build/package.json', JSON.stringify(config, null, 4));
