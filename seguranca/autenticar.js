export default function autenticar(requisicao, resposta, next){
    if (requisicao.session.usuarioLogado){
        console.log("Middleware de autenticação chamado"); 
        next();
    }
    else{
        console.log("Usuário não autenticado, redirecionando para página de login");
        resposta.redirect('/login.html');
    }
}