[![AI Connectify Logo](https://github.com/brianelizondo/ai-connectify/docs/images/ai_connectify_logo.png)](https://github.com/brianelizondo/ai-connectify)


AI-Connectify is a Beta JavaScript library for connecting to various AI services at the same time, including Tensor Flow Node, ChatGPT and DALL-E. With AI-Connectify, you can easily access to AI services to perform a variety of tasks, including natural language processing, image processing, and more.

![npm](https://img.shields.io/npm/v/ai-connectify)
[![install size](https://packagephobia.com/badge?p=ai-connectify)](https://packagephobia.com/result?p=ai-connectify)
![npm](https://img.shields.io/npm/dw/ai-connectify)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
- [Examples](#examples)
  - [ChatGPT instance:](#chatgpt-instance)
  - [DALL-E instance:](#dall-e-instance)
  - [Tensor Flow Node instance:](#tensor-flow-node-instance)
- [Credits](#credits)
- [Contributing](#contributing)
- [License](#license)

## Features
- A modular architecture that allows for easy integration with various AI services like Tensor Flow Node, ChatGPT and DALL-E.
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
import AIConnectify from 'ai-connnectify';
```

## Examples
Here are some examples of how to use AI-Connectify:

### ChatGPT instance:
```js
import AIConnectify from 'ai-connectify';

// new instance of ChatGPT
const chatGPT= new AIConnectify.getAIInstance("ChatGPT", "YOUR_API_KEY");

// Create a async function with the code
const prompt = 'Write a short story about a robot who becomes sentient and learns how to love';
const completion = await chatGPT.createCompletion(prompt);
console.log(completion);
```

### DALL-E instance:
```js
import AIConnectify from 'ai-connectify';

// new instance of DALL-E
const dalle = new AIConnectify.getAIInstance("DALLE", "YOUR_API_KEY");

// Create a async function with the code to creates an image given a prompt
const prompt = 'a white siamese cat';
const newImage = await dalle.createImage(prompt);
console.log(newImage);

// Create a async function with the code to 
// creates an edited or extended image given an original image and a prompt
const prompt = 'a white siamese cat';
const imageEdit = await dalle.createImageEdit(IMAGE_FILE, prompt, mask);
console.log(imageEdit);

// Create a async function with the code to creates a variation of a given image
const prompt = 'a white siamese cat';
const imageVariation= await dalle.createImageVariation(IMAGE_FILE);
console.log(imageVariation);
```

### Tensor Flow Node instance:
```js
import AIConnectify from 'ai-connectify';

// new instance of Tensor Flow Node
const tfNode= new AIConnectify.getAIInstance("TensorFlowNode");

// Create a async function with the code to load a new model
const model = await tfNode.loadModel('URL_TO_MODEL');

// Create a async function with the code to make a prediction using the loaded TensorFlow model
const inputData = [[1, 2], [3, 4]];
const prediction = model.predict(inputData);
console.log(prediction.toString());
```

## Credits
The original author of AI-Connectify is [Brian Elizondo](https://github.com/brianelizondo)

## Contributing
Welcome to AI-Connectify! This is my first library, and I'm excited to see it grow and improve with the help of the community. I'm grateful for any contributions you might have to offer, whether it's reporting an issue, submitting a pull request, or just giving some feedback.

Please don't hesitate to reach out if you have any questions, comments, or concerns. I'm open to suggestions and eager to collaborate with other developers to make AI-Connectify even better. Thank you for your support!

[List of all contributors](https://github.com/brianelizondo/ai-connectify/graphs/contributors)

## License
AI-Connectify is released under the [MIT](LICENSE) License.