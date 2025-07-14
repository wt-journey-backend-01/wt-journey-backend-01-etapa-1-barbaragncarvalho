const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const fs = require('fs');
const lanches = JSON.parse(fs.readFileSync(path.join(__dirname, 'public', 'data', 'lanches.json'), 'utf8'));

app.use(express.static(path.join(__dirname, 'public'))); //disponibiliza arquivo da pasta public para serem acessados nas rotas criadas
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: true })); //

app.get('/', (requisicao, resposta) => { //caso seja feita requisição get, retorna essa resposta
    resposta.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/sugestao', (requisicao, resposta) => {
    const { nome, ingredientes } = requisicao.query;
    resposta.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Agradecimento</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <img src="/images/hamburger.svg" alt="Logo com desenho de Hambúrguer da DevBurger" id="logoImg">
        <h2>DevBurger</h2>
        <h6></h6><a href="/contato">Contato</a></h6>
    </header>
    <main>
        <div class="divCentro">
            <h1>Obrigado, ${nome}!</h1>
                <p>Recebemos sua sugestão de hambúrguer com os seguintes ingredientes:</p>
                <p>${ingredientes}</p>
            <a href="/">Voltar para a página inicial</a>
        </div>
    </main>
      <footer>
        <p>Todos os direitos reservados à DevBurger</p>
        <p>©2025</p>
    </footer>
</body>
</html>
        `);
});

app.get('/not-found', (requisicao, resposta) => {
    resposta.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.get('/contato', (requisicao, resposta) => {
    resposta.sendFile(path.join(__dirname, 'views', 'contato.html'));
});

app.post('/contato', (requisicao, resposta) => {
    const { nome, email, assunto, mensagem } = requisicao.body;

    if (!nome || !email || !assunto || !mensagem) {
        return resposta.status(400).sendFile(path.join(__dirname, 'public', '404.html'));
    }

    resposta.send(`
        <!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contato recebido</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <header>
        <img src="/images/hamburger.svg" alt="Logo com desenho de Hambúrguer da DevBurger" id="logoImg">
        <h2>DevBurger</h2>
        <h6></h6><a href="/contato">Contato</a></h6>
    </header>
    <main>
        <div class="divCentro">
            <h1>Contato recebido! Obrigado, ${nome}.</h1>
            <p><strong>Seu e-mail: </strong>${email}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong> ${mensagem}</p>
            <a href="/contato">Voltar ao formulário de contato</a>
        </div>
    </main>
    <footer>
        <p>Todos os direitos reservados à DevBurger</p>
        <p>©2025</p>
    </footer>
</body>
</html>
        `);
});

app.get('/api/lanches', (requisicao, resposta) => {
    resposta.status(200).json(lanches);
});

app.use((requisicao, resposta) => {
  resposta.redirect('/not-found');
});

app.listen(port, () => { //indica onde o servidor roda
    console.log(`Servidor da DevBurger rodando em http://localhost:${port}`);
});