function parseList(value) {
  if (!value) return [];
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

function getFeedUrls() {
  return parseList(process.env.RSS_FEEDS);
}

function getKeywords() {
  return parseList(process.env.RSS_KEYWORDS);
}

function getExcludeKeywords() {
  return parseList(process.env.RSS_EXCLUDE_KEYWORDS);
}

module.exports = { parseList, getFeedUrls, getKeywords, getExcludeKeywords };
