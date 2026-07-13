# Notícias Microsoft — Instruções para rodar

Passos rápidos para executar localmente:

1. Instale Node.js (recomendo Node 16+). Baixe em https://nodejs.org/

2. Na raiz do projeto, instale dependências:

```powershell
npm install
```

3. Crie um arquivo `.env` copiando o `.env.example` e preenchendo as variáveis:

```powershell
copy .env.example .env
# editar .env com seus valores
```

4. Execute a aplicação:

```powershell
npm start
# ou
node src/index.js
```

Solucionando erros comuns:
- Se `npm` não for reconhecido: reinstale Node.js e reabra o terminal.
- Se `MODULE_NOT_FOUND` aparecer para um pacote (ex.: `dotenv`): rode `npm install <nome-do-pacote> --save`.
- Se houver erros relacionados a variáveis de ambiente (ex.: `Cannot read properties of undefined`): verifique que `.env` contém `RSS_FEEDS` e `RSS_KEYWORDS`.
- Para limpar e reinstalar dependências:

```powershell
rd /s /q node_modules
del package-lock.json
npm cache verify
npm install
```

Se quiser, eu posso:
- Executar `npm install` aqui (se permitir).
- Gerar `.env` com valores de teste (não funcionará com Graph sem credenciais).
- Validar a execução local e reportar erros concretos.
