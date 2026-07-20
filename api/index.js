const { fetchAllFeeds } = require('../src/newsFetcher');
const { filterArticles } = require('../src/newsFilter');
const { renderPage } = require('../src/render');
const { getFeedUrls, getKeywords, getExcludeKeywords } = require('../src/config');

// Página serverless: busca os feeds na hora e renderiza.
// Nada de estado em memória — cada requisição é independente.
module.exports = async (req, res) => {
  try {
    const feedUrls = getFeedUrls();
    const keywords = getKeywords();
    const excludeKeywords = getExcludeKeywords();

    const allArticles = await fetchAllFeeds(feedUrls);
    const articles = filterArticles(allArticles, keywords, new Set(), excludeKeywords);
    const lastUpdated = new Date().toLocaleString('pt-BR');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(renderPage(articles, lastUpdated));
  } catch (error) {
    console.error(`[api/index] Erro ao renderizar página: ${error.message}`);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(500).send(renderPage([], null));
  }
};
