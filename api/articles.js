const { fetchAllFeeds } = require('../src/newsFetcher');
const { filterArticles } = require('../src/newsFilter');
const { getFeedUrls, getKeywords, getExcludeKeywords } = require('../src/config');

// Endpoint JSON de leitura: busca os feeds, filtra e devolve os artigos.
// Consumido ao vivo pela Web Part SPFx dentro do SharePoint.
// CORS liberado para o navegador poder chamar de qualquer domínio *.sharepoint.com.
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const feedUrls = getFeedUrls();
    const keywords = getKeywords();
    const excludeKeywords = getExcludeKeywords();

    const allArticles = await fetchAllFeeds(feedUrls);
    const articles = filterArticles(allArticles, keywords, new Set(), excludeKeywords);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).json({ articles, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error(`[api/articles] Erro: ${error.message}`);
    res.status(500).json({ articles: [], error: error.message });
  }
};
