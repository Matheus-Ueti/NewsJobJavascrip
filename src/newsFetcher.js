const RssParser = require('rss-parser');

const parser = new RssParser();

function toArticle(item) {
  return {
    title:   item.title           || '',
    summary: item.contentSnippet  || item.content || '',
    link:    item.link            || '',
    pubDate: item.pubDate         || '',
  };
}

async function fetchFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items.map(toArticle);
  } catch (error) {
    console.error(`[newsFetcher] Falha ao ler feed "${url}": ${error.message}`);
    return [];
  }
}

async function fetchAllFeeds(urls) {
  const results = await Promise.all(urls.map(fetchFeed));
  return results.flat();
}

module.exports = { fetchAllFeeds };
