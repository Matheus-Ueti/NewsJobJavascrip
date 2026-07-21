const http = require('http');
const { renderPage } = require('./render');

const PORT = process.env.PORT || 3000;

let lastUpdated = null;
let articles = [];

function setArticles(newArticles) {
  articles = newArticles;
  lastUpdated = new Date().toLocaleString('pt-BR');
}

function start() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(renderPage(articles, lastUpdated));
  });

  server.listen(PORT, () => {
    console.log(`[server] Visualização disponível em http://localhost:${PORT}`);
  });
}

module.exports = { start, setArticles };
