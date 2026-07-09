const { ConfidentialClientApplication } = require('@azure/msal-node');

const GRAPH_SCOPE = 'https://graph.microsoft.com/.default';
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;

let client = null;
let token = null;
let tokenExpiresAt = 0;

function createClient() {
  return new ConfidentialClientApplication({
    auth: {
      clientId:     process.env.AZURE_CLIENT_ID,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      authority:    `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    },
  });
}

async function getAccessToken() {
  const tokenIsValid = token && Date.now() < tokenExpiresAt - TOKEN_EXPIRY_BUFFER_MS;
  if (tokenIsValid) return token;

  if (!client) client = createClient();

  const result = await client.acquireTokenByClientCredential({ scopes: [GRAPH_SCOPE] });

  token          = result.accessToken;
  tokenExpiresAt = result.expiresOn.getTime();

  return token;
}

module.exports = { getAccessToken };
