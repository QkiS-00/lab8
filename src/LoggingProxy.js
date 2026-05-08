class LoggingProxy {
  constructor(httpClient) {
    this._client = httpClient;
  }

  async request(req) {
    const start = Date.now();
    console.log(`[LOG] ${req.method || 'GET'} ${req.url}`);

    try {
      const response = await this._client.request(req);
      const duration = Date.now() - start;
      console.log(`[LOG] ${response.status} — ${duration}ms`);
      return response;
    } catch (err) {
      console.error(`[LOG] ERROR — ${err.message}`);
      throw err;
    }
  }
}

export { LoggingProxy };