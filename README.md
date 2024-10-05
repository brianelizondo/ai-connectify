[![AI Connectify Logo](./docs/images/ai_connectify_logo.png)](https://github.com/brianelizondo/ai-connectify)

# AI-Connectify
**AI-Connectify** is a JavaScript library for connecting to various AI services at the same time, including ChatGPT, Cohere, DALL-E, Stability and TensorFlow. With AI-Connectify, you can easily access to AI services to perform a variety of tasks, including natural language processing, image processing, and more.


![npm](https://img.shields.io/npm/v/ai-connectify)
![npm bundle size](https://img.shields.io/bundlephobia/min/ai-connectify?label=install%20size)
![npm](https://img.shields.io/npm/dw/ai-connectify)


## Table of Contents
- **[AI-Connectify](#ai-connectify)**
  - [Table of Contents](#table-of-contents)
  - [Currently supported AI services](#currently-supported-ai-services)
  - [Features](#features)
  - [Installation](#installation)
  - [Examples](#examples)
    - [Start a new ChatGPT instance](#start-a-new-chatgpt-instance)
    - [Start a new Cohere instance](#start-a-new-cohere-instance)
    - [Start a new DALL-E instance](#start-a-new-dall-e-instance)
    - [Start a new Stability instance](#start-a-new-stability-instance)
    - [Start a new TensorFlow instance](#start-a-new-tensorflow-instance)
  - [Credits](#credits)
  - [Contributing](#contributing)
  - [License](#license)


## Currently supported AI services
- ChatGPT
- Cohere
- DALL-E
- Stability
- TensorFlow


## Features
- A modular architecture that allows for easy integration with various AI services.
- Support for natural language processing, computer vision and machine learning use cases (Just to start).
- Clean and simple library for each AI service.
- Well-documented and extensively tested codebase.


## Installation
This is a [Node.js](https://nodejs.org/en/) module available through the [npm registry](https://www.npmjs.com/).
If this is a brand new project, make sure to create a `package.json` first with the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Using npm:
```console
$ npm install ai-connectify
```

Or if you're using Yarn, run:
```console
$ yarn add ai-connectify
```

Once the package is installed, you can import the library using `import` or `require` approach:
```js
const AIConnectify = require('ai-connectify');
```


## Examples
Here are some examples of how to use **AI-Connectify**:

#### Start a new ChatGPT instance
```js
const chatGPT = new AIConnectify("ChatGPT", "YOUR_OPENAI_API_KEY").connector;
```
**List of Available Methods:** 
| Method | Description |
|---|---|
| setOrganizationId | Set the Organization ID to the ChatGPTClient instance |
| setProjectId | Set the Project ID to the ChatGPTClient instance |
| getModels | Lists the currently available models, and provides basic information about each one such as the owner and availability |
| getModel | Retrieves a model instance, providing basic information about the model such as the owner and permissioning |
| delFineTunedModel | Delete a fine-tuned model. You must have the Owner role in your organization to delete a model |
| createChatCompletion | Creates a model response for the given chat conversation |
| createEmbeddings | Get a vector representation of a given input that can be easily consumed by machine learning models and algorithms |
| createModeration | Given some input text, outputs if the model classifies it as potentially harmful across several categories |
| createSpeech | Generates audio from the input text |
| createTranscription | Transcribes audio into the input language |
| createTranslation | Translates audio into English |
| getFineTuningJob | Get info about a fine-tuning job |
| getFineTuningJobs | List your organization's fine-tuning jobs |
| getFineTuningEvents | Get status updates for a fine-tuning job |
| getFineTuningCheckpoints | List checkpoints for a fine-tuning job |
| createFineTuning | Creates a fine-tuning job which begins the process of creating a new model from a given dataset |
| cancelFineTuning | Immediately cancel a fine-tune job |
> **Note:** OpenAI API Reference
> You can interact with a ChatGPT instance using like reference the parameters and returns specified in the [OpenAI API Reference](https://platform.openai.com/docs/api-reference/completions).


#### Start a new Cohere instance
```js
const cohere = new AIConnectify("Cohere", "YOUR_COHERE_API_KEY").connector;
```
**List of Available Methods:** 
| Method | Description |
|---|---|
| setClientName | Set the name of the project that is making the request |
| checkApiKey | Checks that the api key in the Authorization header is valid and active |
| chat | Generates a text response to a user message |
| chatWithStreaming | Generates a text response to a user message with streaming (stream of events) |
| embed | Generates an embedding list of floating point numbers that captures semantic information about the text that it represents |
| getEmbedJobs | Generates a list embed job endpoint allows users to view all embed jobs history for that specific user |
| getEmbedJob | Retrieves the details about an embed job started by the same user |
| createEmbedJob | Launches an async Embed job for a Dataset of type embed-input |
| cancelEmbedJob | Allows to cancel an active embed job |
| rerank | Takes in a query and a list of texts and produces an ordered array with each text assigned a relevance score |
| classify | Makes a prediction about which label fits the specified text inputs best |
| getDatasets | Generates a list datasets that have been created |
| getDataset | Retrieve a dataset by ID |
| getDatasetUsage | Retrieves the dataset storage usage for your Organization |
| createDataset | Create a dataset by uploading a file |
| deleteDataset | Delete a dataset by ID |
| tokenize | Generates a splits input text into smaller units called tokens using byte-pair encoding (BPE) |
| detokenize | Takes tokens using byte-pair encoding and returns their text representation |
| getModels | List of models available for use. The list contains models from Cohere as well as your fine-tuned models |
| getModel | Returns the details of a model, provided its name |
| getConnectors | Returns a list of connectors ordered by descending creation date (newer first) |
| getConnector | Retrieve a connector by ID |
| createConnector | Creates a new connector |
| deleteConnector | Delete a connector by ID |
| getFineTunedModels | Returns a list of fine-tuned models available for use |
| getFineTunedModel | Retrieve a fine-tuned model by ID |
| getFineTunedChronology | Retrieves the chronology of statuses the fine-tuned model has been through |
| getFineTunedMetrics | Retrieves metrics measured during the training of a fine-tuned model |
| createFineTunedModel | Trains and deploys a fine-tuned model |
| updateFineTunedModel | Updates a fine-tuned model by ID |
| deleteFineTunedModel | Delete a fine-tuned model by ID |
> **Note:** Cohere API Reference
> You can interact with a Cohere instance using like reference the parameters and returns specified in the [Cohere API Reference](https://docs.cohere.com/reference/about).


#### Start a new DALL-E instance
```js
const dalle = new AIConnectify("DALLE", "YOUR_OPENAI_API_KEY").connector;
```
**List of Available Methods:** 
| Method | Description |
|---|---|
| setOrganizationId | Set the Organization ID to the ChatGPTClient instance |
| setProjectId | Set the Project ID to the ChatGPTClient instance |
| getModels | Lists the currently available models, and provides basic information about each one such as the owner and availability |
| getModel | Retrieves a model instance, providing basic information about the model such as the owner and permissioning |
| createImage | Given a prompt and/or an input image, the model will generate a new image |
| createImageEdit | Creates an edited or extended image given an original image and a prompt |
| createImageVariation | Creates a variation of a given image |
> **Note:** OpenAI API Reference
> You can interact with a DALL-E instance using like reference the parameters and returns specified in the [OpenAI API Reference](https://platform.openai.com/docs/api-reference/images).


#### Start a new Stability instance
```js
const stability = new AIConnectify("Stability", "YOUR_STABILITY_API_KEY").connector;
```
**List of Available Methods:** 
| Method | Description |
|---|---|
| setClientId | Set the client ID of your application |
| setClientUserId | Set an unique identifier for your end user |
| setClientVersion | Set the version of your application |
| generateImageUltra | Creates the highest quality images with unprecedented prompt understanding |
| generateImageCore | Tools for generating new images with the best quality achievable at high speed |
| generateImageDiffusion | Tools for generating new images using a Stable Diffusion 3 model |
| upscaleConservative | Tools for increasing the size of your existing images |
| upscaleCreative | Takes images between 64x64 and 1 megapixel and upscales them all the way to 4K resolution |
| getUpscaleCreative | Fetch the result of an upscale generation by ID |
| upscaleFast | Fast Upscaler service enhances image resolution by 4x using predictive and generative AI |
| erase | Removes unwanted objects, such as blemishes on portraits or items on desks, using image masks |
| inpaint | Intelligently modify images by filling in or replacing specified areas with new content based on the content of a "mask" image |
| outpaint | The Outpaint service inserts additional content in an image to fill in the space in any direction |
| searchAndReplace | The Search and Replace service is a specific version of inpainting that does not require a mask |
| searchAndRecolor | The Search and Recolor service provides the ability to change the color of a specific object in an image using a prompt |
| removeBackground | The Remove Background service accurately segments the foreground from an image and implements and removes the background |
| controlSketch | This service offers an ideal solution for design projects that require brainstorming and frequent iterations |
| controlStructure | This service excels in generating images by maintaining the structure of an input image |
| constrolStyle | This service extracts stylistic elements from an input image (control image) and uses it to guide the creation of an output image based on the prompt |
| videoStableFast | Stable Fast 3D generates high-quality 3D assets from a single 2D input image |
| imageToVideo | Generate a short video based on an initial image with Stable Video Diffusion, a latent video diffusion model |
| getImageToVideo | Fetch the result of an image-to-video generation by ID |
> **Note:** Stability API Reference
> You can interact with a Stability instance using like reference the parameters and returns specified in the [Stability API Reference](https://platform.stability.ai/docs/api-reference).


#### Start a new TensorFlow instance
```js
const tf = new AIConnectify("TensorFlow").connector;
```
> **Note:** TensorFlow API Reference
> You can interact with a TensorFlow instance using like reference the parameters and returns specified in the [TensorFlow API Reference](https://js.tensorflow.org/api/latest/).



## Credits
The original author of **AI-Connectify** is [Brian Elizondo](https://github.com/brianelizondo)


## Contributing
Welcome to **AI-Connectify**! This is my first library, and I'm excited to see it grow and improve with the help of the community. I'm grateful for any contributions you might have to offer, whether it's reporting an issue, submitting a pull request, or just giving some feedback.

Please don't hesitate to reach out if you have any questions, comments, or concerns. I'm open to suggestions and eager to collaborate with other developers to make **AI-Connectify** even better. Thank you for your support!

[List of all contributors](https://github.com/brianelizondo/ai-connectify/graphs/contributors)


## License
**AI-Connectify** is an open-source library released under the [MIT](LICENSE) License.
This means you are free to use, modify, and distribute the software for personal and commercial purposes, as long as you retain the original copyright and license notice.
No fees are charged for using this library. The library is provided as-is, without any warranty, and there is no financial gain or charge for its use.
For more details, refer to the [MIT](LICENSE) file.