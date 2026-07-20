function renderArticleCard(article) {
  return `
    <div class="card">
      <a href="${article.link}" target="_blank" class="title">${article.title}</a>
      <p class="summary">${article.summary || 'Sem resumo disponível.'}</p>
      <span class="date">${article.pubDate || ''}</span>
    </div>
  `;
}

function renderPage(articles = [], lastUpdated = null) {
  const cards = articles.length > 0
    ? articles.map(renderArticleCard).join('')
    : '<p class="empty">Nenhuma notícia encontrada ainda. Aguarde o próximo ciclo.</p>';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="refresh" content="60" />
  <title>Notícias Microsoft — Mundo365</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f4f6f8;
      color: #1a1a2e;
      min-height: 100vh;
    }

    header {
      background: #0078d4;
      color: white;
      padding: 24px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    header h1 { font-size: 1.4rem; font-weight: 600; }
    header span { font-size: 0.85rem; opacity: 0.85; }

    main {
      max-width: 860px;
      margin: 32px auto;
      padding: 0 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card {
      background: white;
      border-radius: 8px;
      padding: 20px 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: box-shadow 0.2s;
    }

    .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); }

    .title {
      font-size: 1rem;
      font-weight: 600;
      color: #0078d4;
      text-decoration: none;
      line-height: 1.4;
    }

    .title:hover { text-decoration: underline; }

    .summary {
      font-size: 0.9rem;
      color: #555;
      line-height: 1.6;
    }

    .date {
      font-size: 0.78rem;
      color: #999;
    }

    .empty {
      text-align: center;
      color: #888;
      padding: 48px 0;
      font-size: 0.95rem;
    }

    .badge {
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      padding: 4px 12px;
      font-size: 0.82rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Notícias Microsoft — Mundo365</h1>
    <div style="text-align:right">
      <span class="badge">${articles.length} notícia(s)</span><br/>
      <span>Atualizado: ${lastUpdated || '—'}</span>
    </div>
  </header>
  <main>${cards}</main>
</body>
</html>`;
}

module.exports = { renderPage };
