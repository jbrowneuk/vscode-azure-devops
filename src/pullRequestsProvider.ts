import * as vscode from 'vscode';
import * as path from 'path';
import * as azdev from "azure-devops-node-api";
import * as GitApi from "azure-devops-node-api/GitApi";
import * as GitInterfaces from "azure-devops-node-api/interfaces/GitInterfaces";
import { ConnectionParams } from './model/connectionParams';

export class PullRequestsProvider implements vscode.TreeDataProvider<PullRequest> {

	private _onDidChangeTreeData: vscode.EventEmitter<PullRequest | undefined> = new vscode.EventEmitter<PullRequest | undefined>();
	readonly onDidChangeTreeData: vscode.Event<PullRequest | undefined> = this._onDidChangeTreeData.event;

	private configuration: ConnectionParams;
	private connection: azdev.WebApi;

	initialiseConnection(configuration: ConnectionParams): void {
		this.configuration = configuration;

		let authHandler = azdev.getPersonalAccessTokenHandler(configuration.token);
		this.connection = new azdev.WebApi(configuration.organizationUrl, authHandler);
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: PullRequest): vscode.TreeItem {
		return element;
	}

	getChildren(element?: PullRequest): Thenable<PullRequest[]> {
		if (element) {
			return Promise.resolve([]);
		}

		return this.getPullRequests();
	}

	/**
	 * Given the Azure Devops project get all the approved active pull requests.
	 */
	private async getPullRequests() {
		var prs: PullRequest[] = [];
		let gitApiObject: GitApi.IGitApi = await this.connection.getGitApi();
		const pullRequests = await gitApiObject.getPullRequestsByProject(this.configuration.projectName, undefined);
		for (var pullRequest of pullRequests) {
			const approved = this.isApproved(pullRequest);
			if (!approved && pullRequest.status === GitInterfaces.PullRequestStatus.Active) {
				prs.push(new PullRequest(pullRequest.pullRequestId.toString(), pullRequest.repository.name, pullRequest.title, pullRequest.url, vscode.TreeItemCollapsibleState.Collapsed));
			}
		}
		return prs;
	}

	private isApproved(pullRequest: GitInterfaces.GitPullRequest): boolean {
		let approved = false;
		for (var reviewer of pullRequest.reviewers) {
			if (reviewer.vote > 0) {
				approved = true;
				break;
			} 
		}
		return approved;
	}
}

export class PullRequest extends vscode.TreeItem {

	private uri: vscode.Uri;

	constructor(
		public readonly pullRequestId: string,
		public readonly repository: string,
		public readonly title: string,
		public readonly url: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(pullRequestId, collapsibleState);
		this.uri = vscode.Uri.parse(url);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

	get description(): string {
		return `${this.title}`;
	}

	get resourceUri(): vscode.Uri {
		return this.uri;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'pr.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'pr.svg')
	};

	contextValue = 'pull-request';
}
