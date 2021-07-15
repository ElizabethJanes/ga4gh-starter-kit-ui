const yaml = require('js-yaml');
const fs = require('fs');
const { program } = require('commander');
var path = require('path');
const readline = require('readline');

program.version('0.0.1');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter the path of your configuration file.' , (configPath) => {
    try {
        console.log(`The following file path will be used for configuration: ${configPath}.`);
        let configData = yaml.load(fs.readFileSync(configPath, 'utf8'));
        console.log(configData); 
    } catch (e) {
        console.log(e);
        console.log(`The default configuration will be used.`);
        let configData = yaml.load(fs.readFileSync(path.join(__dirname, '../../configuration.yml'), 'utf8'));
        console.log(configData); 
    }
    rl.close();
});

/* program.option('-c, --config <path>', 'Configure Starter Kit API Endpoints', path.join(__dirname, '../../configuration.yml'));
program.parse();

console.log(program.opts());
if(program.opts().config) {
    configPath = program.opts().config;
}

try {
    console.log(`The following file path will be used for configuration: ${configPath}`);
    let configData = yaml.load(fs.readFileSync(configPath, 'utf8'));
    console.log(configData); 
} catch (e) {
    console.log(e);
} */

