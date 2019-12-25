import { Base } from './../base/base';
import { Data, Config, UrlData } from './../model/dataModel';
import { log,dealUrl,join2, join } from './../utils/utils';
import { mockDirName } from './../utils/dict';
import { Describe } from './describe';
import { validParam } from './valid';
let express = require('express');
var bodyParser = require("body-parser");
let axios = require('axios');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
interface serverConfig {
    url: string,
    mockDir:string,
    type: string,
    typeContent: any,
    GlobalDefinitions: any
}
class Server extends Base{
    constructor(opts?: Config, data?: Data) {
        super(opts, data);
    }
    //启动服务
    startServer(cal: any): any   {
        app.listen(this.option.mockPort, () => {
            if (cal) cal(); //启动成功
            this.addStatic();
        });
    }
    // 托管静态页面，如接口描述页等
    addStatic() {
        app.use(express.static(join(__dirname, './../html')));
    }

    // 注入接口
    async addAPI(): Promise<any>  {
        let self = this;
        let desc = new Describe(this.option, this.data);
        let data=this.data;
        return await new Promise((resolve, reject) => {
            app.get('/desc/:id', function(req:any, res:any) {
                let id = req.params.id;
                res.send(desc.createHtml(id));
            })
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let realUrl = dealUrl(element.url);                
                app[element.type](realUrl,function(req:any, res:any){
                    res.header("Access-Control-Allow-Origin", req.headers.origin);
                    res.header('Access-Control-Allow-Credentials', true); //告诉客户端可以在HTTP请求中带上Cookie
                    res.header("Access-Control-Allow-Headers", "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, " +
                        "Last-Modified, Cache-Control, Expires, Content-Type, Content-Language, Cache-Control, X-E4M-With,X_FILENAME");
                    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
                    res.header("X-Powered-By", ' 3.2.1')
                    res.header("Content-Type", "application/json;charset=utf-8");
                    
                    //创建接口描述页面
                    let descUrl = desc.getDescribeHtmlUrl(element.id);
                    log('调用接口的文档链接：'+ descUrl);
                    if(self.isInclude(element.id, self.option.descInclude)) {
                        desc.openAPIDesc(descUrl);
                    }
                    let params = self.getParamByType(req);
                    let errMsg = validParam(params, element);
                    if(errMsg === '') {
                        let fileUrl = join2(process.cwd(), mockDirName, element.id+".json");
                        res.send(require(fileUrl))
                    }else {
                        res.send(`
    ${errMsg}
    接口描述参考：${descUrl}
                        `);
                    }
                })
            }
            resolve();
        });
        // return 1;
        //TODO: 注入SMock的接口服务
    }
    getParamByType(req: any) {
        let params = {};
        if(req.params) {
            params = Object.assign(params, req.params);
        }
        if(req.query) {
            params = Object.assign(params, req.query); 
        }
        if(req.body) {
            params = Object.assign(params, req.body); 
        }
        return params;
    }
    isInclude(urlId:any, includes:any):any {
        let exist = false;
        exist = includes.indexOf(urlId) > -1;
        return exist;
    } 
    //获取数据
    async fetchData(opts:UrlData): Promise<any> {
        let self = this;
        // let swaggerUtl = getHost(opts.url);
        return await new Promise((resolve, reject) => {
            let header:any = {};
            for(let prop in self.option.headers) {
                header(prop, self.option.headers[prop]);
            }
            axios({
                url: opts.url,
                headers: header
            })
            .then((data: any) => {
                resolve(data.data);
            })
        })
    }
}

export { Server };