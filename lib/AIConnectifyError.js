'use strict';
/**
* Create an Error with the specified message, config, error code, request and response
*/
class AIConnectifyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AIConnectifyError';
    }
}
  
export default AIConnectifyError;