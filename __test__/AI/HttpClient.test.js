import axios from 'axios';
import HttpClient  from '../../lib/connectors/HttpClient/HttpClient';
import AIConnectifyError from '../../lib/AIConnectifyError';

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
            delete: jest.fn(),
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
        describe("GET method", () => {
            it('should make a GET request and return data', async () => {
                const mockResponse = { data: { id: 1, name: 'Test' } };
                httpClient.client.get.mockResolvedValue(mockResponse);
    
                const result = await httpClient.get('/users', { id: 1 });
                expect(httpClient.client.get).toHaveBeenCalledWith('/users', { params: { id: 1 } });
                expect(result).toEqual(mockResponse.data);
            });
        });
        describe("POST method", () => {
            it('should make a POST request and return data', async () => {
                const mockResponse = { data: { id: 1, name: 'Created' } };
                const postData = { name: 'New User' };
                httpClient.client.post.mockResolvedValue(mockResponse);
    
                const result = await httpClient.post('/users', postData);
                expect(httpClient.client.post).toHaveBeenCalledWith('/users', postData);
                expect(result).toEqual(mockResponse.data);
            });
        });
    
        describe("DELETE method", () => {
            it('should make a DELETE request and return data', async () => {
                const mockResponse = { data: { status: 'deleted' } };
                httpClient.client.delete.mockResolvedValue(mockResponse);
    
                const result = await httpClient.delete('/users/1');
                expect(httpClient.client.delete).toHaveBeenCalledWith('/users/1');
                expect(result).toEqual(mockResponse.data);
            });
        });
    });

    describe("Throw the AIConnectifyError error", () => {
        it("Tests throw error on GET request failure", async () => {
            const errorMessage = 'Network Error';
            httpClient.client.get.mockRejectedValue(new Error(errorMessage));

            await expect(httpClient.get('/users')).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.get('/users')).rejects.toThrow(`HTTP GET error => ${errorMessage}`);
        });
        it("Tests throw error on POST request failure", async () => {
            const errorMessage = 'Bad Request';
            httpClient.client.post.mockRejectedValue(new Error(errorMessage));

            await expect(httpClient.post('/users', {})).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.post('/users', {})).rejects.toThrow(`HTTP POST error => ${errorMessage}`);
        });
        it("Tests throw error on DELETE request failure", async () => {
            const errorMessage = 'Not Found';
            httpClient.client.delete.mockRejectedValue(new Error(errorMessage));

            await expect(httpClient.delete('/users/1')).rejects.toThrow(AIConnectifyError);
            await expect(httpClient.delete('/users/1')).rejects.toThrow(`HTTP DELETE error => ${errorMessage}`);
        });
    });    
});