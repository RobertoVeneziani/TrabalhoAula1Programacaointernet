import express from "express";

const host ='0.0.0.0';
const porta = 3000; 
const app = express();

app.get('/', (pega, devolve) => {
    devolve.write('<h1>Seja bem-vindo ao nosso site!</h1>');
    devolve.end();
}  );

app.get('/index.html', (pega, devolve) =>{
    devolve.write('<h1>Esse é o index.html</h1>');
    cevolve.end();
})

app.listen(porta, host, () =>{
    console.log(`Servidor escutando em http://${host}:{porta}`);
}

)