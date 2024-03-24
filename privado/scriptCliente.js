
const formularioCliente = document.getElementById('formCliente');
formularioCliente.onsubmit = validarFormulario;

function validarFormulario(evento){
    if (formularioCliente.checkValidity()){
        formularioCliente.classList.romove( "was-validated" );
        const evento = document.getElementById('evento').value;
        const data = document.getElementById("data").value;
        const local = document.getElementById("local").value;
        const quantidade = document.getElementById("quantidade").value;
        const preco = document.getElementById("preco").value;
        const cpf = document.getElementById("cpf").value;
        const nome = document.getElementById("nome").value;
        const endereco = document.getElementById("endereco").value;
        const bairro = document.getElementById("bairro").value;
        const cidade = document.getElementById("cidade").value;
        const estado = document.getElementById("estado").value;
        const telefone = document.getElementById("telefone").value;
        const email = document.getElementById("email").value;

        const cliente = {evento, data, local, quantidade, preco, cpf, nome, endereco, bairro, cidade, estado, telefone, email}

        cadastrarCliente();
    } else {
        formularioCliente.classList.add( "was-validated" );
   }
   evento.preventDefault(); 
   evento.stopPropagation();
}
function cadastrarCliente(cliente){
    fetch('http://localhost:3000/clientes', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(cliente)
    })
    .then((resposta)=>{
        return resposta.json();
    })
    .then((dados)=>{
        if (dados.status){
            mostrarMensagem(dados.mensagem, true);
        }
        else{
            mostrarMensagem(dados.mensagem, false);
            }
    })
    .catch((erro) =>{
        mostrarMensagem(erro.mensage, false)
    });
}

function mostrarMensagem(mensagem, sucesso = false){
    const divMensagem = document.getElementById('mensagem');
    if (sucesso){
        divMensagem.innerHTML=`
        <div class="alert alert-sucess" role=alert">
            ${mensagem}
        </div>`;

    }
    else{
        divMensagem.innerHTML=`
        <div class="alert alert-danger" role=alert">
            ${mensagem}
        </div>`;

    }

    setTimeout(()=>{
        divMensagem.innerHTML='';
    }, 5000);
    
}