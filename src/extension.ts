import * as vscode from 'vscode';
import { ApiWrapper } from './apiWrapper';

const apiWrapper = new ApiWrapper();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	apiWrapper.activate();

	vscode.window.registerTreeDataProvider('pullRequests', apiWrapper.pullRequestProvider);
	vscode.commands.registerCommand('pullRequests.refresh', () => apiWrapper.pullRequestProvider.refresh());
}

// this method is called when your extension is deactivated
export function deactivate() {
	apiWrapper.deactivate();
}
