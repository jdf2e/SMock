"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_1 = require("../base/base");
const utils_1 = require("./../utils/utils");
const fs_1 = require("fs");
const child_process_1 = require("child_process");
class Describe extends base_1.Base {
    constructor(opts, data) {
        super(opts, data);
    }
    getDescribeHtmlUrl(id) {
        this.createHtml(id);
        return `http://127.0.0.1:${this.option.mockPort}/desc/${id}`;
    }
    createHtml(id) {
        let result;
        let data = utils_1.getDataFromArrayById(this.data, id);
        let html = '';
        if (data.params) {
            html += `
            <h3>入参</h3>
            <table class="tb">
                <thead>
                    <th>参数名</th>
                    <th>类型</th>
                    <th>位置</th>
                    <th>是否必填</th>
                    <th>描述</th>
                </thead>
                <tbody>`;
            for (let inIndex = 0; inIndex < data.params.length; inIndex++) {
                let param = data.params[inIndex];
                html += `<tr>
                    <td>${param.value}</td>
                    <td>${param.type}</td>
                    <td>${param.in}</td>
                    <td>${param.required}</td>
                    <td>${param.desc}</td>
                </tr>`;
                if (param.child) {
                    for (let childIndex = 0; childIndex < param.child.length; childIndex++) {
                        let childParam = param.child[childIndex];
                        html += `<tr>
                            <td>${param.value}.${childParam.name}</td>
                            <td>${childParam.type}</td>
                            <td>${param.in}</td>
                            <td>${param.required}</td>
                            <td>${param.desc}</td>
                        </tr>`;
                    }
                }
            }
            html += `
                </tbody>    
            </table>`;
        }
        if (data.responseDesc && data.responseDesc.length > 0) {
            html += `
            <h3>出参</h3>
            <table class="tb">
                <thead>
                    <th>参数名</th>
                    <th>类型</th>
                    <th>描述</th>
                </thead>
                <tbody>`;
            for (let resIndex = 0; resIndex < data.responseDesc.length; resIndex++) {
                let desc = data.responseDesc[resIndex];
                html += `<tr>
                <td>${desc.key}</td>
                <td>${desc.type}</td>
                <td>${desc.desc}</td>
            </tr>
                `;
            }
            html += `
                </tbody>    
            </table>
            `;
        }
        let file = fs_1.readFileSync(utils_1.join(__dirname, './../html/temp.html'), 'utf8');
        result = file.replace('{{CODE}}', html);
        result = result.replace('{{API}}', data.url);
        result = result.replace('{{DESC}}', data.desc);
        return result;
    }
    openAPIDesc(descUrl) {
        let cmd = '';
        if (process.platform == 'win32') {
            cmd = 'start';
        }
        else if (process.platform == 'linux') {
            cmd = 'xdg-open';
        }
        else if (process.platform == 'darwin') {
            cmd = 'open';
        }
        child_process_1.exec(`${cmd} ${descUrl}`);
    }
}
exports.Describe = Describe;
