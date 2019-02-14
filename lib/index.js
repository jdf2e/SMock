let program = require('commander');
let package = require('../package.json');
let file = require('../common/file');
let utils = require('../common/utils');
let names = require('../common/namespace');
let pathDeal = require('../common/path');
program
    .version(package.version)
    .option('-v, --version', 'output the version number')
    .description('init, init config \nrun, start server\nrun -o, start server and override data')
    .action((cmd, env) => {
        //接收命令，派发任务
        action({ cmd, env });
    })
    
    .parse(process.argv);

//接收命令，派发任务
function action(opt) {
    console.log(opt.env);
    if(!opt.env) {
        console.log(
            `
    -v or --version : show the version number
    init : init config file - SMock.json
    run : run the Smock server
    run -o : override the mock data file
----------------------------------------------
If you use the smock first time, you can see the document on the https://smock.jd.com.

First , you must exec  'smock init' to create the smock config file.
Second, you should exec 'smock run' to start the smock server. 
Finally, you should exec 'smock run -o' to start the smock server,when you want to update the mock json.
            `
        )
        return;
    }
    let env = opt.env.rawArgs;
    switch (opt.cmd) {
        case 'init': // smock init
            createSMockJson();
            break;
        case 'run': // smock run            
            if(env.length > 3 && env[3]=='-o') {
                openServer(true)
            } else {
                openServer();
            }            
        default:
            break;
    }
}

//创建SMock.json
function createSMockJson() {
    require('./createSMock.js');
}

//调用swagger分析程序并启动服务,override是否启动服务时覆盖数据
function openServer(override) {
    let config = getConfig();
    if(override) {
        config = Object.assign(config,{override:true});
    }
    let Core = require('smock-core').Core;
    new Core(config);
}

//获取SMock.json参数
function getConfig() {
    //获取参数，将参数和解析分开，方便后期制作webpack插件
    let config = {};
    let configFileName = names.configName; //配置文件名
    let url = pathDeal.join(process.cwd(), configFileName); //拼接配置文件路径
    if (file.existsSync(url)) { //文件存在
        let buffer = file.readFileSync(url);
        config = utils.toJson(buffer);
    } else { //文件不存在
        utils.warn('您还没有在当前目录中创建配置文件SMock.json，可以通过smock init命令创建，或者手动新建SMock.json');
    }
    return config;
}