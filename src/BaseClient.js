class BaseClient {
  async request({ url, method = 'GET', headers = {}, body = null }) {
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
      options.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, options);

    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.json().catch(() => null),
    };
  }
}

export { BaseClient };