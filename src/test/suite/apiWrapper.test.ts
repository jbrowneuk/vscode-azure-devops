import * as assert from 'assert';
import * as proxyquire from 'proxyquire';
import * as vscode from 'vscode';
import { createSandbox, spy, stub, SinonSandbox, SinonStub } from 'sinon';

class MockPrProvider {
	initialiseConnection(): void {}
}

// Require file under test but mock out dependencies
const { ApiWrapper } = proxyquire.noCallThru().load('../../apiWrapper', {
	'./pullRequestsProvider': {
		PullRequestsProvider: MockPrProvider
	}
});

suite('VSCode Api Wrapper Layer', function() {
	let sandbox: SinonSandbox;
	let apiWrapper: any; // due to proxyquire, this cannot be typed correctly

	setup(function() {
		sandbox = createSandbox();

		apiWrapper = new ApiWrapper();
	});

	teardown(function() {
		sandbox.restore();
	});

	test('should initialize Pull Request provider', function() {
		assert.ok(apiWrapper.pullRequestProvider);
	});

	test('should initialise ADO connection on activate()', function() {
		const stubbedPrProvider = apiWrapper.pullRequestProvider;
		const initialiseConnectionSpy = spy(stubbedPrProvider, 'initialiseConnection');

		apiWrapper.activate();

		assert(initialiseConnectionSpy.called);
	});

	test('should add listener to VSCode onDidChangeConfiguration on activate()', function() {
		const changeConfigurationSpy = spy(vscode.workspace, 'onDidChangeConfiguration');

		apiWrapper.activate();

		assert(changeConfigurationSpy.called);

		changeConfigurationSpy.restore();
	});

	test('should dispose event listener handle on deactivate()', function() {
		const mockDisposable = {
			dispose: () => {}
		};
		const disposeSpy = spy(mockDisposable, 'dispose');

		// Must activate to get subscription handle
		const changeConfigurationStub = stub(vscode.workspace, 'onDidChangeConfiguration').returns(mockDisposable);
		apiWrapper.activate();

		apiWrapper.deactivate();
		assert(disposeSpy.calledOnce);

		changeConfigurationStub.restore();
	});
});
