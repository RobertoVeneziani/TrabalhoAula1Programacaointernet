import express from "express";

const host ='0.0.0.0';
const porta = 3000; 
const app = express();

app.get('/', (requisicao, resposta) => {
    requisicao.write('<h1>Seja bem-vindo ao nosso site!</h1>');
    resposta.end();
}  );

app.get('/index.html', (requisicao, resposta) =>{
    requisicao.write('<h1>Esse é o index.html</h1>');
    resposta.end();
})

app.listen(porta, host, () =>{
    console.log(`Servidor escutando em http://${host}:{porta}`);
}

)