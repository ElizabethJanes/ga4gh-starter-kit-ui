const yaml = require('js-yaml');
const fs = require('fs');
const { program } = require('commander');

program.version('0.0.1');

console.log('command line interface');

const defaultConfiguration = null;
try {
    defaultConfiguration = yaml.load(fs.readFileSync('../../configuration.yml', 'utf8'));
    console.log(defaultConfiguration);
} catch (e) {
    console.log(e);
}

program.option('-c, --configure', 'Configure Starter Kit API Endpoints', defaultConfiguration);
const options = program.opts();
if(options.configure) {
    console.log('Please enter the path of your .yml configuration file to set the correct Starter Kit API endpoints.');
}