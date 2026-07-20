function matchesKeyword(article, lowerKeywords) {
  const title = (article.title || '').toLowerCase();
  const summary = (article.summary || '').toLowerCase();
  return lowerKeywords.some((keyword) => title.includes(keyword) || summary.includes(keyword));
}

// Filtro puro (sem estado): mantém artigos cujo título contém alguma palavra-chave
// e remove duplicatas pelo link. Seguro para invocações serverless reutilizadas.
function filterArticles(articles, keywords, excludeLinks = new Set()) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const seen = new Set();

  return articles.filter((article) => {
    const link = article.link || '';
    if (link && seen.has(link)) return false;
    if (link && excludeLinks.has(link)) return false;
    if (!matchesKeyword(article, lowerKeywords)) return false;

    if (link) seen.add(link);
    return true;
  });
}

module.exports = { filterArticles };
