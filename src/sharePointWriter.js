const { getAccessToken } = require('./graphAuth');

const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0';

function buildListItemUrl() {
  const siteId = process.env.SHAREPOINT_SITE_ID;
  const listId = process.env.SHAREPOINT_LIST_ID;
  return `${GRAPH_BASE_URL}/sites/${siteId}/lists/${listId}/items`;
}

function buildRequestBody(article) {
  return {
    fields: {
      Title:          article.title,
      Resumo:         article.summary,
      Link:           article.link,
      DataPublicacao: article.pubDate,
    },
  };
}

async function sendArticleToSharePoint(article) {
  const token = await getAccessToken();

  const response = await fetch(buildListItemUrl(), {
    method:  'POST',
    headers: {
      Authorization:  `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(buildRequestBody(article)),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Graph API retornou ${response.status}: ${errorBody}`);
  }

  return response.json();
}

module.exports = { sendArticleToSharePoint };
