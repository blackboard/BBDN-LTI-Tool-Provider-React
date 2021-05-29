import config from "../config/config";

class Client {
    constructor(basePath) {
        this.basePath = basePath || '';
        this.middlewares = [];
    }

    request(path, method, body) {
        let request = new Request(path, method, body)
        this.middlewares.forEach(middleware => {
            if (!middleware.method || middleware.method === method) {
                request = middleware.handler(request) || request
            }
        })
        return request
    }
}

/**
 * Unified API Client for the Backend
 */
class ToolClient extends Client {

    constructor() {
        super(config.lti_backend);
    }


    /**
     *  Method to obtain the payload using a token
     * @param token token provided at the redirection
     */
    async getLaunchJWTPayload(token) {

        const requestOptions = {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        };

        console.log("backend: " + config['lti_backend']);
        return fetch(config['lti_backend'] + '/ims/deepLink/payloadData?token=' + token, requestOptions);
    }

    /**
     * Method to obtain the payload for the LTI Content items
     * @param items array of items to obtain the payload from backend
     */
    async getLTIContent(items) {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                deep_link_content: items
            })
        };

        return fetch(config['lti_backend'] + '/ims/deepLink/content', requestOptions)

    }
}

const toolClient = new ToolClient(config.lti_backend);

export default toolClient;