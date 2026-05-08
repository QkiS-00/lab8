import { BaseClient } from './BaseClient.js';
import { AuthProxy } from './AuthProxy.js';
import { LoggingProxy } from './LoggingProxy.js';
import { RateLimitProxy } from './RateLimitProxy.js';
import { GitHubService } from './GitHubService.js';

async function main() {
  const token = process.env.GITHUB_TOKEN || 'demo-token';

  const client = new RateLimitProxy(
    new LoggingProxy(
      new AuthProxy(
        new BaseClient(),
        'jwt',
        { token },

        async (creds) => {
          console.log('[AUTH] refreshing token...');
          return creds;
        }
      )
    ),
    5,  
    1000
  );

//demo 
  const github = new GitHubService(client);

  console.log('=== JWT Auth ===\n');
  try {
    const user = await github.getUser('torvalds');
    console.log('User status:', user.status);
  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\n=== API Key Auth ===\n');
  const apiKeyClient = new LoggingProxy(
    new AuthProxy(
      new BaseClient(),
      'apiKey',
      { apiKey: process.env.API_KEY || 'demo-api-key' }
    )
  );
  const githubApiKey = new GitHubService(apiKeyClient);
  try {
    const repos = await githubApiKey.getRepos('torvalds');
    console.log('Repos status:', repos.status);
  } catch (err) {
    console.error('Error:', err.message);
  }

  console.log('\n=== Rate Limit Demo ===\n');
  const limitedClient = new RateLimitProxy(new BaseClient(), 2, 1000);
  const limitedGithub = new GitHubService(limitedClient);

  for (let i = 0; i < 3; i++) {
    try {
      await limitedGithub.getUser('torvalds');
      console.log(`Request ${i + 1}: OK`);
    } catch (err) {
      console.error(`Request ${i + 1}: ${err.message}`);
    }
  }
}

main().catch((err) => {
  console.error('Unhandled:', err.message);
  process.exit(1);
});