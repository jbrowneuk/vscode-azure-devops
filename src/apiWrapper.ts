import * as vscode from 'vscode';
import { PullRequestsProvider } from './pullRequestsProvider';
import { ConnectionParams } from './model/connectionParams';

const configurationNamespace = 'prMonitor';

export class ApiWrapper {
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