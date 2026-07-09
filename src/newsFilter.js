const sentLinks = new Set();

function containsKeyword(article, keywords) {
  const title = article.title.toLowerCase();
  return keywords.some((keyword) => title.includes(keyword));
}

function isNew(article) {
  return !sentLinks.has(article.link);
}

function markAsSent(article) {
  sentLinks.add(article.link);
}

function filterArticles(articles, keywords) {
  const lowerKeywords = keywords.map((k) => k.toLowerCase());

  return articles.filter((article) => {
    if (!isNew(article))                          return false;
    if (!containsKeyword(article, lowerKeywords)) return false;

    markAsSent(article);
    return true;
  });
}

module.exports = { filterArticles };
