// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { PullRequestsProvider } from './pullRequestsProvider';
import { ConnectionParams } from './model/connectionParams';

const configurationNamespace = 'prMonitor';

class ApiWrapper {
	private settingsSubscription: vscode.Disposable;
	private _pullRequestProvider: PullRequestsProvider;

	constructor() {
		this._pullRequestProvider = new PullRequestsProvider();
	}

	get pullRequestProvider(): PullRequestsProvider {
		return this._pullRequestProvider;
	}

	activate(): void {
		this.settingsSubscription = vscode.workspace.onDidChangeConfiguration(this.onConfigurationChanged);
		this._pullRequestProvider.initialiseConnection(this.getConnectionParams());
	}

	deactivate(): void {
		this.settingsSubscription.dispose();
	}

	private onConfigurationChanged(e: vscode.ConfigurationChangeEvent): void {
		if (!e.affectsConfiguration(configurationNamespace)) {
			return;
		}
	
		this.pullRequestProvider.initialiseConnection(this.getConnectionParams());
	}

	private getConnectionParams(): ConnectionParams {
		const configuration = vscode.workspace.getConfiguration(configurationNamespace);

		return {
			organizationUrl: configuration.get('organizationUrl'),
			projectName: configuration.get('projectName'),
			token: configuration.get('token')
		};
	}
}

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
