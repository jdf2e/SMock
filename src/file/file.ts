import { Base } from './../base/base';
import { mockDirName, urlsRealName } from './../utils/dict';
import { Config, Data } from './../model/dataModel';
import { makeFileSync, join, join2, toStr, createDir, existsSync, error } from './../utils/utils';
import { jsPathError } from './../model/log';

class File extends Base {
	constructor(opts: Config, data: Data) {
		super(opts, data);
	}
	//创建JSON文件
	async createJSONFile() {
		let filePromise = [];
		let customFileDir = join(process.cwd(), mockDirName); //默认mock相关文件目录名
		createDir(customFileDir);
		for(let fileIndex = 0; fileIndex < this.data.length; fileIndex++) {
			let item = this.data[fileIndex];
			let data = JSON.stringify(item.data);
			let fileUrl = join2(process.cwd(), mockDirName, item.id+".json");
			filePromise.push(makeFileSync(fileUrl, data));
		}
		Promise.all(filePromise).then((data) => {
			return;
		});
	}
	// 创建URL文件
	async createUrlFile() {
		return await new Promise((resolve, reject) => {
			let option = this.option,
				urlDatas = this.data;
			let jsContent = this.customJsTpl(urlDatas);
			let customFileDir = join(process.cwd(), mockDirName); //默认mock相关文件目录名
			let jsFilePath = join2(process.cwd(), mockDirName, `${urlsRealName}.js`); //默认生成位置，如果用户配置则生成至用户配置的位置
			if (option.jsPath) {
				//用户如果有自定义文件目录，则需要生成至用户自定义目录
				customFileDir = join(process.cwd(), option.jsPath);
				if(!existsSync(customFileDir)) return error(jsPathError);
				jsFilePath = join(customFileDir, `${urlsRealName}.js`);
			}
			createDir(customFileDir);
			makeFileSync(jsFilePath, jsContent); //生成一个js文件

			let jsonFilePath = join2(process.cwd(), mockDirName, `${urlsRealName}.json`); //生成一个json文件，只有全部url
			let jsonContent = toStr(this.jsonDeal(urlDatas)); //将要写入文件的内容串
			makeFileSync(jsonFilePath, jsonContent); //生成一个json文件只有url
			resolve();
		});
	}
	//根据用户定义的参数，生成指定格式的url聚合文件
	customJsTpl(data: any) {
		let tpl = require('./urlTpl'),
			option = this.option,
			host = option.realHostName;
		return tpl.getTpl(data, option.mockPort, host);
	}

	//处理json数据
	jsonDeal(urls: any) {
		let pathKey = '',
			obj: any = {};
		for (let key in urls) {
			let item = urls[key];
			pathKey = item.id;
			obj[pathKey] = {
				url: item.url,
				type: item.type
			};
		}
		return obj;
	}
}

export { File };
