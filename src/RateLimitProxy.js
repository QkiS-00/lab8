class RateLimitProxy {
  constructor(httpClient, maxRequests = 5, windowMs = 1000) {
    this._client = httpClient;
    this._maxRequests = maxRequests;
    this._windowMs = windowMs;
    this._requests = [];
  }

  async request(req) {
    const now = Date.now();

    this._requests = this._requests.filter(
      (t) => now - t < this._windowMs
    );

    if (this._requests.length >= this._maxRequests) {
      throw new Error(
        `Rate limit exceeded: max ${this._maxRequests} requests per ${this._windowMs}ms`
      );
    }

    this._requests.push(now);
    return this._client.request(req);
  }
}

export { RateLimitProxy };