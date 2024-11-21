import agentsCompletion from '../../../../lib/connectors/AI/Mistral/methods/agentsCompletion';

describe("Mistral - agentsCompletion method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const messagesArray = [{
        "role": "user",
        "content": "Who is the best French painter? Answer in one short sentence."
    }];
    const agentID = 'agent-test-id';
    const config = { max_tokens: 0 };
    
    beforeEach(() => {
        httpRequestMock = {
            post: jest.fn()
        };
        throwErrorMock = jest.fn();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('API Interaction', () => {
        it('Test make a POST request to the correct endpoint', async () => {
            const expectedResponse = { 
                choices: [{ message: { content: 'Hi!' } }]
            };
            httpRequestMock.post.mockResolvedValue(expectedResponse);

            const response = await agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, agentID, config);

            expect(httpRequestMock.post).toHaveBeenCalledTimes(1);
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/agents/completions', 
                expect.objectContaining({
                    ...config, 
                    messages: messagesArray, 
                    agent_id: agentID
                })
            );
            expect(response).toEqual(expectedResponse);
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when messagesArray is not provided', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the message array');
        });
        it('Test when messagesArray is empty array', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, [])
            ).rejects.toThrow('Cannot process the message array');
        });
        it('Test when messagesArray is not an array', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('This is not an array');
        });
        it('Test when agentID is not provided', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, undefined)
            ).rejects.toThrow('Cannot process the agent ID');
        });
        it('Test when agentID is empty string', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, '')
            ).rejects.toThrow('Cannot process the agent ID');
        });
        it('Test when agentID is not a string', async () => {
            await expect(
                agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, 123)
            ).rejects.toThrow('Cannot process the agent ID');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'API request error'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, agentID, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await agentsCompletion(httpRequestMock, throwErrorMock, messagesArray, agentID, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});