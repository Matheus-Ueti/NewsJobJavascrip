function matchesAny(article, lowerWords) {
  const title = (article.title || '').toLowerCase();
  const summary = (article.summary || '').toLowerCase();
  return lowerWords.some((word) => title.includes(word) || summary.includes(word));
}

// Filtro puro (sem estado): mantém artigos cujo título/resumo contém alguma palavra-chave,
// descarta quem contém alguma palavra de exclusão, e remove duplicatas pelo link.
// Seguro para invocações serverless reutilizadas.
function filterArticles(articles, keywords, excludeLinks = new Set(), excludeKeywords = []) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());
  const lowerExcludeKeywords = excludeKeywords.map((k) => k.toLowerCase());
  const seen = new Set();

  return articles.filter((article) => {
    const link = article.link || '';
    if (link && seen.has(link)) return false;
    if (link && excludeLinks.has(link)) return false;
    if (!matchesAny(article, lowerKeywords)) return false;
    if (lowerExcludeKeywords.length > 0 && matchesAny(article, lowerExcludeKeywords)) return false;

    if (link) seen.add(link);
    return true;
  });
}

module.exports = { filterArticles };
