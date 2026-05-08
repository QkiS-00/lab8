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
  constructor(httpClient, strategyName, credentials, refreshFn = null) {
    this._client = httpClient;
    this._strategyName = strategyName;
    this._credentials = credentials;
    this._refreshFn = refreshFn;
  }

  async request(req) {
    const strategy = authStrategies[this._strategyName];
    if (!strategy) {
      throw new Error(`Unknown auth strategy: ${this._strategyName}`);
    }

    const authHeaders = strategy(this._credentials);
    const response = await this._client.request({
      ...req,
      headers: { ...req.headers, ...authHeaders },
    });

    if (response.status === 401 && this._refreshFn) {
      const newCredentials = await this._refreshFn(this._credentials);
      this._credentials = newCredentials;

      const newAuthHeaders = strategy(newCredentials);
      return this._client.request({
        ...req,
        headers: { ...req.headers, ...newAuthHeaders },
      });
    }

    return response;
  }
}

export { AuthProxy };