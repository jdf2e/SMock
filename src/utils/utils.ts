let fs = require('fs');
let path = require('path');
import { mockDirName } from './dict';
export function dealConfig(c: any) {
	if(c.docPath) {
        c.docPath = parseURL(c.docPath);
    }
	if (c.domain) {
		c.headers = {
			host: c.domain
		};
	}
	if (c.customProtocol == 'https') {
		c.port = 443;
	}
	//mock文件夹名
	// c.mockDirName = `${c.projectName?c.projectName:defaultConfig.projectName}mock`;
	return c; // Object.assign(defaultConfig, c);
}
function parseURL(url: any) {
	var a = url.replace("http://","").replace("https://","");
	return a.substring(0,a.indexOf("/")>0?a.indexOf("/"):a.length);
}
exports.parseURL = parseURL;
export function log(msg: any) {
	console.log(msg);
}
//警告打印
export function warn(msg: any) {
	console.log(`warn:${msg}`);
}

export function error(msg: any) {
	console.log(`error:${msg}`);
}

//将buffer或者字符串转换成json串
export function toJson(str: any) {
	return JSON.parse(str);
}

//将对象变成格式化串
export function toStr(json: any) {
	return JSON.stringify(json, null, 2);
}

//将含有花括号的url，替换成对应的数据
export function dealUrl(url: any) {
	return url.replace(/\{.*?\}/g, function(d: any) {
		let key = d.substring(1, d.length - 1);
		return `:${key}`;
	}); //此正则很重要
}

export function getParamByType(type: string, req: any) {
	let params = {};
	type = type.toLowerCase();
	switch (type) {
		case 'get':
			params = req.query;
			break;
		case 'post':
			params = req.body;
			break;
		default:
			break;
	}
	return params;
}

// Data中获取对应ID的数据
export function getDataFromArrayById(arr: any, id: any) {
	for (let i = 0; i < arr.length; i++) {
		let item = arr[i];
		if (item.id === id) {
			return item;
		}
	}
	return null;
}

//文件操作
export function existsSync(url: string) {
	return fs.existsSync(url);
}

//读文件
export function readFileSync(url: string) {
	return fs.readFileSync(url);
}

//创建目录
export function createDir(dir: string) {
	var stat = fs.existsSync(dir);
	if (!stat) {
		//为true的话那么存在，如果为false不存在
		fs.mkdirSync(dir);
	}
}

//创建文件并写入内容（异步）
export function makeFile(filePath: string, content: any) {
	return new Promise((resolve, reject) => {
		var stat = existsSync(filePath);
		if (stat) {
			//为true的话那么存在，如果为false不存在
			// utils.log(`${filePath} 已存在，内容已覆盖`);
		}
		fs.writeFile(filePath, content, (err: any) => {
			if (!err) {
				resolve(filePath);
			} else {
				reject(err);
			}
		});
	});
}

//创建文件并写入内容（同步无回调）
export function makeFileSync(filePath: string, content: any) {
	var stat = existsSync(filePath);
	if (stat) {
		//为true的话那么存在，如果为false不存在
		log(`${filePath} 已存在，内容已覆盖`);
	}
	// else {
	fs.writeFileSync(filePath, content);
}
////判断是否存在json文件
export function isNew() {
    return !existsSync(join(process.cwd(), mockDirName));
}

//合并
export function join(a: any, b: any) {
	return path.resolve(a, b);
}

export function join2(a: any, b: any, c: any) {
	return path.join(a, b, c);
}

// 判断对象中是否存在值
export function keyInData(id: string, arr: any) {
	let result = false;
	for(let i=0; i<arr.length; i++) {
		let item = arr[i];
		if(item.id == id) {
			result = true;
		}
	}
	return result;
}

export function getHost(url:string) {
}
