require('dotenv').config();

const cron                        = require('node-cron');
const { fetchAllFeeds }           = require('./newsFetcher');
const { filterArticles }          = require('./newsFilter');
const { sendArticleToSharePoint } = require('./sharePointWriter');
const server                      = require('./server');

const CRON_EVERY_HOUR = '0 * * * *';

const feedUrls = process.env.RSS_FEEDS.split(',').map((url) => url.trim());
const keywords = process.env.RSS_KEYWORDS.split(',').map((kw) => kw.trim());

function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

async function processArticle(article) {
  try {
    await sendArticleToSharePoint(article);
    log(`Enviado: "${article.title}"`);
  } catch (error) {
    log(`Erro ao enviar "${article.title}": ${error.message}`);
  }
}

async function run() {
  log('Iniciando ciclo de busca...');

  const allArticles      = await fetchAllFeeds(feedUrls);
  const filteredArticles = filterArticles(allArticles, keywords);

  log(`${allArticles.length} artigos encontrados, ${filteredArticles.length} para enviar.`);

  server.setArticles(filteredArticles);

  for (const article of filteredArticles) {
    await processArticle(article);
  }

  log('Ciclo concluído.');
}

server.start();

run();

cron.schedule(CRON_EVERY_HOUR, run);

log('Agendador ativo — próxima execução no início da próxima hora.');
