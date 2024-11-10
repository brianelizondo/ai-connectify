import createSpeech from '../../../../lib/connectors/AI/ChatGPT/methods/createSpeech';

describe("ChatGPT - createSpeech method", () => {
    let httpRequestMock;
    let throwErrorMock;
    // test variables
    const input = 'test text';
    const destinationFolder = 'test';
    const modelId = 'model-test-id';
    const responseFormat = 'mp3';
    const voice = 'voice-test';
    const config = {};
    
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
            const mockAudioBuffer = Buffer.from('mock audio data');
            httpRequestMock.post.mockResolvedValue(mockAudioBuffer);

            const result = await createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, responseFormat, config);
            
            expect(httpRequestMock.post).toHaveBeenCalledWith(
                '/audio/speech',
                {
                    ...config,
                    input,
                    model: modelId,
                    voice,
                    response_format: responseFormat
                },
                {
                    validateStatus: undefined,
                    responseType: "arraybuffer",
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
            expect(result).toEqual({
                audio_path: expect.stringMatching(/\.mp3$/)
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it('Test when input is not provided', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, undefined)
            ).rejects.toThrow('Cannot process the input text');
        });
        it('Test when input is empty string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, '')
            ).rejects.toThrow('Cannot process the input text');
        });
        it('Test when input is not a string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, 123)
            ).rejects.toThrow('Cannot process the input text');
        });

        it('Test when destinationFolder is not provided', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, undefined)
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is empty string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, '')
            ).rejects.toThrow('Cannot process the destination folder');
        });
        it('Test when destinationFolder is not a string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, 123)
            ).rejects.toThrow('Cannot process the destination folder');
        });

        it('Test when modelID is not provided', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, undefined)
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is empty string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, '')
            ).rejects.toThrow('Cannot process the model ID');
        });
        it('Test when modelID is not a string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, 123)
            ).rejects.toThrow('Cannot process the model ID');
        });

        it('Test when voice is not provided', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, undefined)
            ).rejects.toThrow('Cannot process the voice');
        });
        it('Test when voice is empty string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, '')
            ).rejects.toThrow('Cannot process the voice');
        });
        it('Test when voice is not a string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, 123)
            ).rejects.toThrow('Cannot process the voice');
        });

        it('Test when response_format is not provided', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, undefined)
            ).rejects.toThrow('Cannot process the response format');
        });
        it('Test when response_format is empty string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, '')
            ).rejects.toThrow('Cannot process the response format');
        });
        it('Test when response_format is not a string', async () => {
            await expect(
                createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, 123)
            ).rejects.toThrow('Cannot process the response format');
        });

        
        it('Test handle API errors correctly', async () => {
            const apiError = new Error('API Error');
            apiError.response = {
                data: {
                    error: {
                        message: 'Job not found'
                    }
                }
            };
            httpRequestMock.post.mockRejectedValue(apiError);

            await createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, responseFormat, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(apiError);
        });
        it('Test handle network errors correctly', async () => {
            const networkError = new Error('Network Error');
            httpRequestMock.post.mockRejectedValue(networkError);

            await createSpeech(httpRequestMock, throwErrorMock, input, destinationFolder, modelId, voice, responseFormat, config);
            expect(throwErrorMock).toHaveBeenCalledTimes(1);
            expect(throwErrorMock).toHaveBeenCalledWith(networkError);
        });
    });
});