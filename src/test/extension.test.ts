//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import * as sinon from 'sinon';
import * as azdev from 'azure-devops-node-api';
import { PullRequestsProvider } from '../pullRequestsProvider';

// Defines a Mocha test suite to group tests of similar kind together
describe('Pull Requests Provider', function() {
    let sandbox: sinon.SinonSandbox;
    let getPatStub: sinon.SinonStub;
    let webApiMock: sinon.SinonStubbedInstance<azdev.WebApi>;

    beforeEach(function() {
        sandbox = sinon.createSandbox();

        getPatStub = sandbox.stub(azdev, 'getPersonalAccessTokenHandler');
        webApiMock = sandbox.createStubInstance(azdev.WebApi, {});
    });

    afterEach(function() {
        // Reset sinon sandbox to prevent memory leaks
        // https://sinonjs.org/releases/v8.0.4/general-setup/
        sandbox.restore();
    });

    it('should initialize connection', function() {
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
