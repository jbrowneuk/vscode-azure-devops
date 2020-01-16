import * as assert from 'assert';
import * as azdev from 'azure-devops-node-api';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';

// Require file under test but mock out dependencies
const { PullRequestsProvider } = proxyquire.noCallThru().load('../../pullRequestsProvider', {
	'azure-devops-node-api': {
        getPersonalAccessTokenHandler: () => {},
        WebApi: { /* some kind of mock that pokes global statics */ }
	}
});

// Defines a Mocha test suite to group tests of similar kind together
suite('Pull Requests Provider', function() {
    let sandbox: sinon.SinonSandbox;
    let getPatStub: sinon.SinonStub;

    setup(function() {
        sandbox = sinon.createSandbox();

        getPatStub = sandbox.stub(azdev, 'getPersonalAccessTokenHandler');
    });

    teardown(function() {
        // Reset sinon sandbox to prevent memory leaks
        // https://sinonjs.org/releases/v8.0.4/general-setup/
        sandbox.restore();
    });

    test('should initialize connection', function() {
        const mockConnectionParams = {
            organizationUrl: 'https://mock',
            projectName: 'mock-project',
            token: 'mock-token'
        };

        const pullRequestsProvider = new PullRequestsProvider();
        pullRequestsProvider.initialiseConnection(mockConnectionParams);

        assert(getPatStub.called);
        assert.equal(webApiMock.serverUrl, mockConnectionParams.organizationUrl);
    });
});
