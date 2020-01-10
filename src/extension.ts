// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { PullRequestsProvider } from './pullRequestsProvider';

const configurationNamespace = 'prMonitor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const configuration = vscode.workspace.getConfiguration(configurationNamespace);

	const pullRequestProvider = new PullRequestsProvider(configuration);
	vscode.window.registerTreeDataProvider('pullRequests', pullRequestProvider);
	vscode.commands.registerCommand('pullRequests.refresh', () => pullRequestProvider.refresh());
}

// this method is called when your extension is deactivated
export function deactivate() {}
