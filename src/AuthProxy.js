const authStrategies = {
  apiKey: ({ apiKey }) => ({
    'X-API-Key': apiKey,
  }),

  jwt: ({ token }) => ({
    Authorization: `Bearer ${token}`,
  }),

  oauth: ({ accessToken }) => ({
    Authorization: `OAuth ${accessToken}`,
  }),
};

class AuthProxy {

  constructor(httpClient, strategyName, credentials) {
    this._client = httpClient;
    this._strategyName = strategyName;
    this._credentials = credentials;
  }

  async request(req) {
    const strategy = authStrategies[this._strategyName];
    if (!strategy) {
      throw new Error(`Unknown auth strategy: ${this._strategyName}`);
    }

    const authHeaders = strategy(this._credentials);

    return this._client.request({
      ...req,
      headers: {
        ...req.headers,
        ...authHeaders,
      },
    });
  }
}

export { AuthProxy };