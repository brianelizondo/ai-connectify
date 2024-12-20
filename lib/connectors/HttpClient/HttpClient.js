/*
* AI-Connectify
* Copyright(c) 2023 Brian Elizondo
* MIT Licensed
*/
'use strict';

/**
* Module and dependencies
*/
const axios = require('axios');
const AIConnectifyError = require('../../AIConnectifyError');

/**
* Represents an HTTP client for making API requests using Axios.
* This client is designed to make HTTP requests to a specified base URL
* and includes error handling specific to AI-Connectify.
* @class 
*/
class HttpClient {
    /**
    * Create a new HttpClient instance.
    * Initializes the Axios client with a base URL and optional default headers.
    * 
    * @constructor
    * @param {string} baseURL - The base URL of the API for making requests.
    * @param {Object} [defaultHeaders={}] - Default headers to include in every request made by this client.
    * @param {number} [timeout=10000] - Optional timeout for each request in milliseconds (default is 10 seconds).
    */
    constructor(baseURL, defaultHeaders = {}, timeout=10000){
        this.client = axios.create({
            baseURL,
            timeout,
            headers: defaultHeaders
        });
    }

    /**
    * Throw a formatted AIConnectifyError with the request method and error message.
    * @param {string} errorMsg - The error message caught during the request.
    * @throws {AIConnectifyError} - Throws an error with a message detailing the HTTP method and error description.
    */
    throwError(errorMsg){
        throw new AIConnectifyError(errorMsg);
    }

    /**
    * Send an HTTP GET request to the specified endpoint with optional query parameters.
    * @async
    * @param {string} endpoint - The API endpoint to which the GET request will be sent (relative to the baseURL).
    * @param {Object} [params={}] - Optional query parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async get(endpoint, params = {}){
        const response = await this.client.get(endpoint, { params });
        return response.data;
    }

    /**
    * Send an HTTP POST request to the specified endpoint with a JSON body.
    * @async
    * @param {string} endpoint - The API endpoint to which the POST request will be sent (relative to the baseURL).
    * @param {Object} body - The JSON body to send in the POST request.
    * @param {Object} [headers={}] - Optional headers parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async post(endpoint, body, headers={}) {
        const response = await this.client.post(endpoint, body, headers);
        return response.data;
    }

    /**
    * Send an HTTP PATCH request to the specified endpoint
    * @async
    * @param {string} endpoint - The API endpoint to which the PATCH request will be sent (relative to the baseURL).
    * @param {Object} body - The JSON body to send in the POST request.
    * @param {Object} [headers={}] - Optional headers parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async patch(endpoint, body, headers={}) {
        const response = await this.client.patch(endpoint, body, headers);
        return response.data;
    }

    /**
    * Send an HTTP DELETE request to the specified endpoint
    * @async
    * @param {string} endpoint - The API endpoint to which the POST request will be sent (relative to the baseURL).
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async delete(endpoint) {
        const response = await this.client.delete(endpoint);
        return response.data;
    }

    /**
    * Send an HTTP POST request to the specified endpoint with form data body.
    * @async
    * @param {string} endpoint - The API endpoint to which the POST request will be sent (relative to the baseURL).
    * @param {Object} body - The JSON body to send in the POST request.
    * @param {Object} [headers={}] - Optional headers parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async postForm(endpoint, body, headers={}) {
        const response = await this.client.postForm(endpoint, body, headers);
        return response;
    }

    /**
    * Send an HTTP GET request to the specified endpoint with optional query parameters (data complete)
    * @async
    * @param {string} endpoint - The API endpoint to which the GET request will be sent (relative to the baseURL).
    * @param {Object} [params={}] - Optional query parameters to include in the request URL.
    * @returns {Promise<Object>} - Resolves with the response data from the API.
    */
    async getFull(endpoint, params = {}){
        const response = await this.client.get(endpoint, { params });
        return response;
    }
}

module.exports = HttpClient;