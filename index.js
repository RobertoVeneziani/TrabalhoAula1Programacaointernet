// Importando os módulos necessários
import express from "express";
import process from "process";
import path from "path";
import session from 'express-session';

// Definindo as constantes
const host = '0.0.0.0';
const porta = 3000;
const app = express();

// Configuração do middleware e da sessão
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: "M1nH4Ch4v3S3cr3t4",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 100 * 15
    }
}));
// Rota de login
app.post('/login', (requisicao, resposta) => {
    const { usuario, senha } = requisicao.body;
    if (usuario === "Roberto" && senha === "123") {
        requisicao.session.usuarioLogado = true;
        resposta.redirect('/privado/cadastroCliente.html');
    } else {
        resposta.redirect('/login.html');
    }
});

// Middleware para servir conteúdo estático (público)
app.use(express.static(path.join(process.cwd(), 'publico')));

// Middleware de autenticação aplicado apenas para o diretório privado
app.use('/privado', autenticar, express.static(path.join(process.cwd(), 'privado')));

// Iniciando o servidor
app.listen(porta, host, () => {
    console.log(`Servidor escutando em http://localhost:${porta}`);
});
