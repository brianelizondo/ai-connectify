'use strict';

/**
* Module dependencies.
*/
import AIConnectifyError from '../../AIConnectifyError';
import { createReadStream } from 'fs';
import { Configuration, OpenAIApi } from 'openai';

/**
* Given a prompt and/or an input image, the model will generate a new image.
*/
class DALLE {
    constructor(apiKey, model = 'image-alpha-001') {
        if (!apiKey) {
            throw new AIConnectifyError('API key is required for DAll-E');
        }

        this.apiKey = apiKey;
        this.model = model;
        this.config = {
            n: 1,
            size: "1024x1024",
            response_format: "URL",
            user: null
        }
        
        const openaiConfig = new Configuration({ apiKey });
        this.openai = new OpenAIApi(openaiConfig);
    }

    /**
    * Creates an image given a prompt
    */
    async createImage(prompt, newConfig = null){
        const config = { ...this.config, ...newConfig };

        try {
            const response = await this.openai.createImage({ prompt, ...config });
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }

    /**
    * Creates an edited or extended image given an original image and a prompt
    */
    async createImageEdit(image, prompt, mask = null, newConfig = null){
        const config = { ...this.config, ...newConfig };
        const maskImage = mask ? createReadStream(mask) : undefined;

        try {
            const response = await this.openai.createImageEdit(
                createReadStream(image),
                prompt, 
                maskImage, 
                config.n, 
                config.size, 
                config.response_format, 
                config.user
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }

    /**
    * Creates a variation of a given image
    */
    async createImageVariation(image, newConfig = null){
        const config = { ...this.config, ...newConfig };

        try {
            const response = await this.openai.createImageVariation(
                createReadStream(image),
                config.n, 
                config.size, 
                config.response_format, 
                config.user
            );
            return response.data;
        } catch (error) {
            const errorMsg = error.response ? error.response.data : error.message;
            throw new AIConnectifyError(`Error generating response: ${errorMsg}`);
        }
    }
}

export default DALLE;