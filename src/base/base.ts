import {Data, Config} from './../model/dataModel';
class Base {
    // 配置
    option: Config;
    // 数据
    data: Data;
    constructor(opts: Config, data: Data) {
        this.option = opts;
        this.data = data;
    }
}
export { Base };