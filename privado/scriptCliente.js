document.addEventListener('DOMContentLoaded', function() {
    
    const excluirBtn = document.getElementById("excluir");
    if (excluirBtn) {
        excluirBtn.onclick = excluirCliente;
    }

    const selecionarBtn = document.getElementById("selecionar");
    if (selecionarBtn) {
        selecionarBtn.onclick = selecionarCliente;
    }

    const atualizarBtn = document.getElementById("atualizar");
    if (atualizarBtn) {
        atualizarBtn.onclick = atualizarCliente;
    }

    window.selecionarCliente = function(codigo, evento, data, local, quantidadeIngresso, preco, cpf, nome, endereco, bairro, cidade, estado, telefone, email) {
        document.getElementById('codigo').value = codigo;
        document.getElementById('evento').value = evento;
        document.getElementById('data').value = data;
        document.getElementById('local').value = local;
        document.getElementById('quantidade').value = quantidadeIngresso;
        document.getElementById('preco').value = preco;
        document.getElementById('CPF').value = cpf;
        document.getElementById('nome').value = nome;
        document.getElementById('endereco').value = endereco;
        document.getElementById('bairro').value = bairro;
        document.getElementById('cidade').value = cidade;
        document.getElementById('uf').value = estado;
        document.getElementById('telefone').value = telefone;
        document.getElementById('email').value = email;
    };


   
    buscarClientes();
    const formularioCliente = document.getElementById('formCliente');
    formularioCliente.onsubmit = validarFormulario;
    window.onload = buscarClientes;
    document.getElementById("excluir").onclick = excluirCliente;
    document.getElementById("selecionar").onclick = selecionarCliente;
    document.getElementById("atualizar").onclick = atualizarCliente;
    document.getElementById("cadastrar").onclick = cadastarCliente;

    function validarFormulario(cliente){
        cliente.preventDefault(); 
        if (formularioCliente.checkValidity()){
            formularioCliente.classList.remove("was-validated");
            const evento = document.getElementById('evento').value;
            const data = document.getElementById("data").value;
            const local = document.getElementById("local").value;
            const quantidadeIngresso = document.getElementById("quantidade").value;
            const preco = document.getElementById("preco").value;
            const cpf = document.getElementById("CPF").value;
            const nome = document.getElementById("nome").value;
            const endereco = document.getElementById("endereco").value;
            const bairro = document.getElementById("bairro").value;
            const cidade = document.getElementById("cidade").value;
            const estado = document.getElementById("uf").value;
            const telefone = document.getElementById("telefone").value;
            const email = document.getElementById("email").value;
            
            const cliente = {evento, data, local, quantidadeIngresso, preco, cpf, nome, endereco, bairro, cidade, estado, telefone, email};

            cadastrarCliente(cliente);
        } else {
            formularioCliente.classList.add( "was-validated" );
        }

        cliente.stopPropagation();
    }

    function cadastrarCliente(cliente){
        fetch('http://localhost:3000/cliente', {
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
                formularioCliente.reset();
                mostrarMensagem(dados.mensagem, true);
                buscarClientes();
            }
            else{
                mostrarMensagem(dados.mensagem, false);
            }
        })
        .catch((erro) =>{
            mostrarMensagem(erro.message, false);
        });
    }

    function buscarClientes(){
        fetch('http://localhost:3000/Cliente',{method:  'GET'})
        .then(resposta=>{
            return resposta.json();
        })
        .then((dados)=>{
            if (Array.isArray(dados)){
                exibirTabelaClientes(dados);    
            }
            else{
                mostrarMensagem(dados.mensagem, false); 
            }      
        }) 
        .catch ((erro)=> {
            mostrarMensagem(erro.message, false);
        });     
    }
    function atualizarCliente() {
        const codigo = document.getElementById('codigo').value;
        if (confirm("Confirma atualização do Cliente?")) {
          const cliente = obterClienteDoFormulario('atualizacao');
          if (cliente) {
            fetch(`http://localhost:3000/Cliente/${codigo}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(cliente)
            })
            .then((resposta) => {
              if (!resposta.ok) {
                return resposta.text().then(text => {
                  throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText} ${text}`);
                });
              }
              return resposta.json();
            })
            .then((dados) => {
              console.log(dados); // Verifique a resposta do servidor
              if (dados && dados.mensagem) {
                mostrarMensagem(dados.mensagem, true);
              } else {
                mostrarMensagem("Ocorreu um erro ao processar a solicitação.", false);
              }
              buscarClientes();
            })
            .catch((erro) => {
              mostrarMensagem(erro.message, false);
            });
          } else {
            mostrarMensagem("Favor, informar corretamente os dados do Evento!", false);
          }
        }
      }


    function excluirCliente() {
        const codigo = document.getElementById('codigo').value;
        if (confirm("Confirma exclusão do Evento?")) {
            fetch(`http://localhost:3000/Cliente/${codigo}` ,{
                method: 'DELETE'
            })
            .then(async resposta => {
                if (!resposta.ok) {
                    return resposta.text().then(text => {
                        throw new Error(`Erro na requisição: ${resposta.status} ${resposta.statusText} ${text}`);
                    });
                }
                return resposta.json();
            })
            .then((dados) => {
                console.log(dados); // Verifique a resposta do servidor
                if (dados && dados.mensagem) {
                    mostrarMensagem(dados.mensagem, true);
                } else {
                    mostrarMensagem("Ocorreu um erro ao processar a solicitação.", false);
                }
                buscarClientes();
            })
            .catch((erro) => {
                mostrarMensagem(erro.message, false);
            });
        }
    }

    function mostrarMensagem(mensagem, sucesso = false){
        const divMensagem = document.getElementById('mensagem');
        if (sucesso){
            divMensagem.innerHTML=`
                <div class="alert alert-success" role="alert">
                    ${mensagem}
                </div>`;
        }
        else{
            divMensagem.innerHTML=`
                <div class="alert alert-danger" role="alert">
                    ${mensagem}
                </div>`;
        }

        setTimeout(()=>{
            divMensagem.innerHTML='';
        }, 5000);
    }

    function exibirTabelaClientes(listaClientes){
        const espacoTabela = document.getElementById('espacoTabela');
        espacoTabela.innerHTML = '';
        if (listaClientes.length > 0){
            const tabela = document.createElement('table');
            tabela.className = 'table table-striped table-hover';
            const cabecalho = document.createElement('thead');
            cabecalho.innerHTML = 
                `<tr>
                    <th>#</th>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>CPF</th>
                    <th>Nome</th>
                    <th>Endereço</th>
                    <th>Bairro</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Ações</th>
                </tr>`;
            tabela.appendChild(cabecalho);
            const corpo = document.createElement('tbody');
            for (let i = 0; i < listaClientes.length; i++){
                const cliente = listaClientes[i];
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${cliente.codigo}</td>
                    <td>${cliente.evento}</td>
                    <td>${cliente.data}</td>
                    <td>${cliente.local}</td>
                    <td>${cliente.quantidadeIngresso}</td>
                    <td>${cliente.preco}</td>
                    <td>${cliente.cpf}</td>
                    <td>${cliente.nome}</td>
                    <td>${cliente.endereco}</td>
                    <td>${cliente.bairro}</td>
                    <td>${cliente.cidade}</td>
                    <td>${cliente.estado}</td>
                    <td>${cliente.telefone}</td>
                    <td>${cliente.email}</td>
                    <td>
                        <button onclick="selecionarCliente('${cliente.codigo}',
                                                            '${cliente.evento}',
                                                            '${cliente.data}',
                                                            '${cliente.local}',
                                                            '${cliente.quantidadeIngresso}',
                                                            '${cliente.preco}',
                                                            '${cliente.cpf}',
                                                            '${cliente.nome}',
                                                            '${cliente.endereco}',
                                                            '${cliente.bairro}',
                                                            '${cliente.cidade}',
                                                            '${cliente.estado}',
                                                            '${cliente.telefone}',
                                                            '${cliente.email}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"/>
                            </svg>
                        </button>        
                    </td>`;
                corpo.appendChild(linha);
            }
            tabela.appendChild(corpo);
            espacoTabela.appendChild(tabela);
        }
        else{
            espacoTabela.innerHTML = '<p>Nenhum cliente cadastrado!</p>';
        }
    }

    function selecionarCliente(codigo, evento, data, local, quantidadeIngresso, preco, cpf, nome, endereco, bairro, cidade, estado, telefone, email) {
        document.getElementById('codigo').value = codigo;
        document.getElementById('evento').value = evento;
        document.getElementById('data').value = data;
        document.getElementById('local').value = local;
        document.getElementById('quantidade').value = quantidadeIngresso;
        document.getElementById('preco').value = preco;
        document.getElementById('cpf').value = cpf;
        document.getElementById('nome').value = nome;
        document.getElementById('endereco').value = endereco;
        document.getElementById('bairro').value = bairro;
        document.getElementById('cidade').value = cidade;
        document.getElementById('uf').value = estado;
        document.getElementById('telefone').value = telefone;
        document.getElementById('email').value = email;
    }
      return cliente;
}); 

function obterEventoDoFormulario(tipoOperacao) {
    const evento = document.getElementById('evento').value;
    const data = document.getElementById('data').value;
    const local = document.getElementById('local').value;
    const quantidade = document.getElementById('quantidadeIngresso').value;
    const preco = document.getElementById('preco').value;
    const cpf = document.getElementById('cpf').value;
    const nome = document.getElementById('nome').value;
    const endereco = document.getElementById('endereco').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;
    const uf = document.getElementById('uf').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    const cliente = {
      evento,
      data,
      local,
      quantidade,
      preco,
      cpf,
      nome,
      endereco,
      bairro,
      cidade,
      uf,
      telefone,
      email,
    };
  
    // Verifica se a operação é para atualização
    if (tipoOperacao === 'atualizacao') {
      const codigo = document.getElementById('codigo').value;
      evento.codigo = codigo;
    }
  
    return evento;
  }