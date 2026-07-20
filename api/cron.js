const { fetchAllFeeds } = require('../src/newsFetcher');
const { filterArticles } = require('../src/newsFilter');
const { sendArticleToSharePoint, getExistingLinks } = require('../src/sharePointWriter');
const { getFeedUrls, getKeywords } = require('../src/config');

function log(message) {
  console.log(`[${new Date().toISOString()}] [cron] ${message}`);
}

// Endpoint disparado pelo Vercel Cron (ver vercel.json).
// Busca os feeds, filtra por palavra-chave, remove o que já está no SharePoint
// e envia os artigos novos.
module.exports = async (req, res) => {
  // Se CRON_SECRET estiver definido, exige o header enviado pelo Vercel Cron.
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const feedUrls = getFeedUrls();
    const keywords = getKeywords();

    log('Iniciando ciclo de busca...');

    const allArticles = await fetchAllFeeds(feedUrls);
    const existingLinks = await getExistingLinks();
    const articles = filterArticles(allArticles, keywords, existingLinks);

    log(`${allArticles.length} artigos encontrados, ${articles.length} novos para enviar.`);

    let sent = 0;
    const errors = [];

    for (const article of articles) {
      try {
        await sendArticleToSharePoint(article);
        sent += 1;
        log(`Enviado: "${article.title}"`);
      } catch (error) {
        errors.push({ title: article.title, error: error.message });
        log(`Erro ao enviar "${article.title}": ${error.message}`);
      }
    }

    log('Ciclo concluído.');

    res.status(200).json({
      ok: true,
      found: allArticles.length,
      candidates: articles.length,
      sent,
      errors,
    });
  } catch (error) {
    log(`Falha no ciclo: ${error.message}`);
    res.status(500).json({ ok: false, error: error.message });
  }
};
