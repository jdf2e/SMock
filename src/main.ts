import { Swagger } from './model/swagger/swagger';
import { Config, Data } from './model/dataModel';
import { File } from './file/file';
import { Server } from './server/server';
import { log, isNew } from './utils/utils';
import { docPathError } from './model/log';
class Core {
	// 缓存参数
	options: Config;
	// 缓存数据
	data: Data;
	//数据Promise
	dataPromise: Promise<Object>;
	constructor(opts: Object) {
		// let config = Config;
		this.options = Object.assign(
			{
				type: 'swagger',
				docPath: '', //swagger文档访问路径
				docPort: 80, //swagger文档端口号
				path: '/v2/api-docs', //swagger模式路径
				method: 'GET', //文档数据请求方式
				realHostName: '', // 项目上线后访问的真实域名
				mockPort: 3000, //启动服务的端口号
				customProtocol: 'http', //指定协议
				headers: {},
				jsPath: '', //指定生成的URL文件创建路径
				descInclude: [],
				override: false
			},
			opts
		);
		//确保地址存在
		if(this.options.docPath == "") {
			log(docPathError);
			return;
		}
		//不同类型跳转到不同数据层
		switch (this.options.type) {
			case 'swagger':
				let swagger = new Swagger(this.options);
				this.dataPromise = swagger.getData();
				break;
		}
		this.workflow();
		process.on('unhandledRejection', (error) => {
			console.error('unhandledRejection', error);
			process.exit(1); // To exit with a 'failure' code
		});
	}
	// SMock主流程
	workflow() {
		this.dataPromise.then((data: any) => {
			let process = [];
			this.data = data;
			//声明变量
			var server = new Server(this.options, this.data);
			if(!isNew() && !this.options.override) {

			}else {
				let file = new File(this.options, this.data);
				//创建文件
				let filePromise = file.createJSONFile();
				process.push(filePromise);
				//创建URL
				let urlPromise = file.createUrlFile();
				process.push(urlPromise);
			}
			//插入接口
			let apiPromise = server.addAPI();
			process.push(apiPromise);

			//全部过程执行完毕，执行启动服务
			Promise.all(process).then(() => {
				server.startServer(() => {
					log(`【${new Date()}】服务器启动!`);
					// log(`http://127.0.0.1:${this.options.mockPort}`);
				});
			});
		});
	}
}
export { Core };
