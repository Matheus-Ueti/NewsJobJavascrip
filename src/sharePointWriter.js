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

// Busca os links já cadastrados na lista para evitar duplicatas entre execuções.
// Em caso de falha (ex.: nome de campo diferente), retorna um Set vazio e loga o erro,
// para nunca derrubar o ciclo de envio.
async function getExistingLinks() {
  try {
    const token = await getAccessToken();
    const url = `${buildListItemUrl()}?expand=fields(select=Link)&$top=500`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`[sharePointWriter] Falha ao listar itens: ${response.status}`);
      return new Set();
    }

    const data = await response.json();
    const links = (data.value || [])
      .map((item) => item.fields && item.fields.Link)
      .filter(Boolean);

    return new Set(links);
  } catch (error) {
    console.error(`[sharePointWriter] Erro ao buscar links existentes: ${error.message}`);
    return new Set();
  }
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

module.exports = { sendArticleToSharePoint, getExistingLinks };
