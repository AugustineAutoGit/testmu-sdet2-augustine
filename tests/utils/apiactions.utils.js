import Ajv from 'ajv';

export class APIActions {
  /**
   * @param {import('@playwright/test').APIRequestContext} request
   * @param {string} baseURL
   */
  constructor (request, baseURL = 'https://reqres.in') {
    this.request = request;
    this.baseURL = baseURL.replace(/\/+$/, '');
    this.ajv = new Ajv({ allErrors: true });
  }

  /**
   * Build a full URL for a request.
   * If the path is an absolute URL, return it unchanged.
   * @param {string} path
   * @returns {string}
   */
  _buildUrl (path) {
    if (!path) {
      throw new Error('The request path must be provided');
    }
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const base = this.baseURL || '';
    return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  /**
   * Normalize request options and default headers.
   * @param {object} options
   * @returns {object}
   */
  _requestOptions (options = {}) {
    return {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers ?? {}),
        ...({ 'x-api-key': process.env.API_KEY }),
      },
    };
  }

  /**
   * Send a GET request.
   * @param {string} path
   * @param {object} options
   */
  async get (path, options = {}) {
    const start = Date.now();
    const response = await this.request.get(this._buildUrl(path), this._requestOptions(options));
    /** @type {{duration?: number}} */ (response).duration = Date.now() - start;
    return response;
  }

  /**
   * Send a POST request.
   * @param {string} path
   * @param {object} data
   * @param {object} options
   */
  async post (path, data, options = {}) {
    const start = Date.now();
    const response = await this.request.post(this._buildUrl(path), {
      ...this._requestOptions(options),
      data,
    });
    /** @type {{duration?: number}} */ (response).duration = Date.now() - start;
    return response;
  }

  /**
   * Send a PUT request.
   * @param {string} path
   * @param {object} data
   * @param {object} options
   */
  async put (path, data, options = {}) {
    const start = Date.now();
    const response = await this.request.put(this._buildUrl(path), {
      ...this._requestOptions(options),
      data,
    });
    /** @type {{duration?: number}} */ (response).duration = Date.now() - start;
    return response;
  }

  /**
   * Send a PATCH request.
   * @param {string} path
   * @param {object} data
   * @param {object} options
   */
  async patch (path, data, options = {}) {
    const start = Date.now();
    const response = await this.request.patch(this._buildUrl(path), {
      ...this._requestOptions(options),
      data,
    });
    /** @type {{duration?: number}} */ (response).duration = Date.now() - start;
    return response;
  }

  /**
   * Send a DELETE request.
   * @param {string} path
   * @param {object} options
   */
  async delete (path, options = {}) {
    const start = Date.now();
    const response = await this.request.delete(this._buildUrl(path), this._requestOptions(options));
    /** @type {{duration?: number}} */ (response).duration = Date.now() - start;
    return response;
  }

  /**
   * Return HTTP status code for the response.
   * @param {import('@playwright/test').APIResponse} response
  * @returns {Promise<number>}
   */
  async validateStatus (response) {
    return response.status();
  }

  /**
   * Validate response body is valid JSON.
   * @param {import('@playwright/test').APIResponse} response
   */
  async validateJson (response) {
    const json = await response.json();
    return json;
  }

  /**
   * Assert the response time is below a threshold.
   * @param {import('@playwright/test').APIResponse} response
   */
  validateResponseTime (response) {
    const duration = /** @type {{duration?: number}} */ (response).duration ?? 0;
    return duration;
  }

  /**
   * Validate JSON data against a JSON Schema.
   * @param {unknown} data
   * @param {object} schema
   */
  validateSchema (data, schema) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);
    const errors = validate.errors ?? [];
    return { valid, errors };
  }
}
