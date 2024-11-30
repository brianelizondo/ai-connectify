import axios from 'axios';
import HttpClient  from '../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../lib/AIConnectifyError';
import FormData from 'form-data';

jest.mock('axios');

describe("HttpClient class", () => {
    let httpClient;
    let mockAxiosInstance;
    const testBaseURL = 'https://api.example.com';
    const testHeaders = { 'Authorization': 'Bearer APIKEY-TEST' }
    const testTimeOut = 5000;

    const createHttpClient = (baseURL, headers={}, timeout=10000) => {
        mockAxiosInstance = {
            get: jest.fn(),
            post: jest.fn(),
            patch: jest.fn(),
            delete: jest.fn(),
            postForm: jest.fn(),
        };
        axios.create.mockReturnValue(mockAxiosInstance);

        return new HttpClient(baseURL, headers, timeout);
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create new instance", () => {
        it("Test create an instance with a valid base URL", () => {
            httpClient = createHttpClient(testBaseURL);

            expect(axios.create).toHaveBeenCalledWith({
                baseURL: testBaseURL,
                headers: {},
                timeout: 10000
            });
        });
        it("Test create an instance with a valid base URL and custom headers", () => {
            httpClient = createHttpClient(testBaseURL, testHeaders);

            expect(axios.create).toHaveBeenCalledWith({
                baseURL: testBaseURL,
                headers: testHeaders,
                timeout: 10000
            });
        });
        it("Test create an instance with a valid base URL, custom headers, custom timeout", () => {
            httpClient = createHttpClient(testBaseURL, testHeaders, testTimeOut);

            expect(axios.create).toHaveBeenCalledWith({
                baseURL: testBaseURL,
                headers: testHeaders,
                timeout: testTimeOut
            });
        });
    });

    describe("Use the request methods individually", () => {
        beforeEach(() => {
            // create base mock httpClient
            httpClient = createHttpClient(testBaseURL);
        });

        describe("GET method", () => {
            it("Test make a 'get' request and return data", async () => {
                const mockResponse = { data: { id: 1, name: 'Test' } };
                httpClient.client.get.mockResolvedValue(mockResponse);
    
                const result = await httpClient.get('/users', { id: 1 });
                expect(httpClient.client.get).toHaveBeenCalledWith('/users', { params: { id: 1 } });
                expect(result).toEqual(mockResponse.data);
            });
            it("Test make a 'getFull' request and return full response data", async () => {
                const mockResponse = { 
                    data: { id: 1, name: 'Test' },
                    status: 200,
                    headers: {} 
                };
                mockAxiosInstance.get.mockResolvedValue(mockResponse);
    
                const result = await httpClient.getFull('/users', { id: 1 });
                expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users', { params: { id: 1 } });
                expect(result).toEqual(mockResponse);
            });
        });

        describe("POST method", () => {
            it("Test make a 'post' request and return data", async () => {
                const mockResponse = { data: { id: 1, name: 'Created' } };
                const postData = { name: 'New User' };
                mockAxiosInstance.post.mockResolvedValue(mockResponse);
    
                const result = await httpClient.post('/users', postData);
                expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, {});
                expect(result).toEqual(mockResponse.data);
            });
            it("Test make a 'post' request with custom headers and return data", async () => {
                const mockResponse = { data: { id: 1, name: 'Created' } };
                const postData = { name: 'New User' };
                const customHeaders = { 'Content-Type': 'application/json' };
                mockAxiosInstance.post.mockResolvedValue(mockResponse);
    
                const result = await httpClient.post('/users', postData, customHeaders);
                expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', postData, customHeaders);
                expect(result).toEqual(mockResponse.data);
            });
        });

        describe("POST FORM method", () => {
            it("Test make a 'postForm' request return full response data", async () => {
                const mockResponse = { data: { status: 'uploaded' } };
                const formData = new FormData();
                formData.append('file', 'test');

                mockAxiosInstance.postForm.mockResolvedValue(mockResponse);
    
                const result = await httpClient.postForm('/upload', formData);
                expect(mockAxiosInstance.postForm).toHaveBeenCalledWith('/upload', formData, {});
                expect(result).toEqual(mockResponse);
            });
        });
    
        describe("PATCH method", () => {
            it("Test make a 'patch' request and return data", async () => {
                const mockResponse = { data: { id: 1, status: 'updated' } };
                const patchData = { status: 'active' };
                mockAxiosInstance.patch.mockResolvedValue(mockResponse);
    
                const result = await httpClient.patch('/users/1', patchData);
                expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/users/1', patchData, {});
                expect(result).toEqual(mockResponse.data);
            });
        });

        describe("DELETE method", () => {
            it("Test make a 'delete' request and return data", async () => {
                const mockResponse = { data: { status: 'deleted' } };
                mockAxiosInstance.delete.mockResolvedValue(mockResponse);
    
                const result = await httpClient.delete('/users/1');
                expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
                expect(result).toEqual(mockResponse.data);
            });
        });

    });

    describe("Use 'throwError' method for error handling", () => {
        beforeEach(() => {
            httpClient = createHttpClient(testBaseURL);
        });

        it("Test 'throwError' should create an 'AIConnectifyError' instance", () => {
            const errorMessage = "Test error message";
            
            expect(() => {
                httpClient.throwError(errorMessage);
            }).toThrow(AIConnectifyError);

            expect(() => {
                httpClient.throwError(errorMessage);
            }).toThrow(errorMessage);
        });
    });

    describe("Throw the 'AIConnectifyError' error", () => {
        const errorMessage = 'Network Error';
        beforeEach(() => {
            httpClient = createHttpClient(testBaseURL);
        });

        it("Tests throw error on 'get' request failure", async () => {
            mockAxiosInstance.get.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.get('/users')).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.get('/users')).rejects.toThrow(errorMessage);
        });
        it("Tests throw error on 'getFull' request failure", async () => {
            mockAxiosInstance.get.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.getFull('/users')).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.getFull('/users')).rejects.toThrow(errorMessage);
        });
        it("Tests throw error on 'post' request failure", async () => {
            mockAxiosInstance.post.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.post('/users', {})).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.post('/users', {})).rejects.toThrow(errorMessage);
        });
        it("Tests throw error on 'postForm' request failure", async () => {
            mockAxiosInstance.postForm.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.postForm('/users', {})).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.postForm('/users', {})).rejects.toThrow(errorMessage);
        });
        it("Tests throw error on 'patch' request failure", async () => {
            mockAxiosInstance.patch.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.patch('/users/1', {})).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.patch('/users/1', {})).rejects.toThrow(errorMessage);
        });

        it("Tests throw error on 'delete' request failure", async () => {
            mockAxiosInstance.delete.mockRejectedValue(new AIConnectifyError(errorMessage));

            await expect(httpClient.delete('/users/1')).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.delete('/users/1')).rejects.toThrow(errorMessage);
        });
    });

});