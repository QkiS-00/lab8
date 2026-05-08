class GitHubService {
  constructor(httpClient) {
    this._client = httpClient;
  }

  async getUser(username) {
    return this._client.request({
      url: `https://api.github.com/users/${username}`,
      method: 'GET',
    });
  }

  async getRepos(username) {
    return this._client.request({
      url: `https://api.github.com/users/${username}/repos`,
      method: 'GET',
    });
  }
}

export { GitHubService };