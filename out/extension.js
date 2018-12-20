'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// import smockCore from 'smock-core';
let smockCore = require('smock-core');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "smock" is now active!');
    console.log(vscode);
    let initSmock = vscode.commands.registerCommand('extension.initSmock', () => {
        smockCore.init({
            "host": "10.182.30.155",
            "domain": "mvc.jd.com",
            "projectName": "svc"
        });
    });
    context.subscriptions.push(initSmock);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map