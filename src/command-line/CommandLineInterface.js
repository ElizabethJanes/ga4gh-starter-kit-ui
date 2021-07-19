const yaml = require('js-yaml');
const fs = require('fs');
var path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let configPath = null;
let configData = null;

rl.question('Enter the path of your configuration file or type "default" to choose the default configuration: ', (userEntry) => {
    try {
        if(userEntry == "default") {
            configPath = path.join(__dirname, '../../configuration.yml');
            console.log(`The default configuration will be used.`)
        }
        else {
            configPath = userEntry;
            console.log(`The following file path will be used for configuration: ${configPath}.`);
        }
        configData = yaml.load(fs.readFileSync(configPath, 'utf8'));
        console.log(configData); 
    } catch (e) {
        console.log(e);
        console.log(`The path you provided is invalid. The default configuration will be used instead.`);
        configData = yaml.load(fs.readFileSync(path.join(__dirname, '../../configuration.yml'), 'utf8'));
        console.log(configData); 
    }
    rl.close();
});

exports.configuration = configData;