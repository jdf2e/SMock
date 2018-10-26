#!/usr/bin/env node

const smock = module.exports;
const package = require('../package.json');
smock.init = function(argv) {
    let cmd2 = argv[2];
    if (argv.length > 2 && cmd2 == 'init') {
        require('createSMock');
    } else if (argv.length > 2 && cmd2 == 'run') {
        smock.getConfig(function(config) {
            const swaggerMock = require('jdcfe-smock/swagger/main');
            new swaggerMock(config);
        })
    } else if (argv.length > 2 && cmd2 == '-v') {
        console.log(package.version);
    }
}
smock.getConfig = function(callback) {
    var fs = require('fs');
    var currentDir = fs.realpathSync('.');
    var res = null;
    var url = currentDir + '/SMock.json';
    if (fs.existsSync(url)) {
        try {
            var data = fs.readFileSync(url);
            if (data) {
                data = JSON.parse(data);
                res = data;
                if (callback) callback(res);
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        console.log('请先用创建SMock.json配置文件，并保证文件的配置正确')
    }
}