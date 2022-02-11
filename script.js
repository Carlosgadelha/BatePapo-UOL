let nomeUsuario



nomeUsuario = prompt("Qual seu nome? ")

const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',{
   name: nomeUsuario
})

promise.then(conexaoSucesso)
promise.catch(tratarErro);

function conexaoSucesso(resposta) {
    logado = true
    const statusCode = parseInt(resposta.status)
    if(statusCode === 200){
        logado = true
        console.log("Sucesso vai da certo Garoto")
    }else if(statusCode === 400){
        logado = false
    }
    
}

function tratarErro(erro) {
    console.log("Status code: " + erro.response.status); // Ex: 404
    console.log("Mensagem de erro: " + erro.response.data); // Ex: Not Found
}


function PermanecerLogado(){
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/status',{
       name: nomeUsuario
    })
}

function buscarMenssagens(){

    let mensagens = document.querySelector("main .mensagens")

    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(processarResposta);

    function processarResposta(resposta) {
        // console.log(resposta.data)
        for (let i = 0; i < resposta.data.length; i++) {
            
            mensagens.innerHTML +=`
                <div class="mensagem ${resposta.data[i].type}" >
                    <p>${resposta.data[i].time} </p>
                    <p>${resposta.data[i].from} ${resposta.data[i].to}</p>
                    <p>${resposta.data[i].text} </p>
                </div>
                `
            mensagens.lastElementChild.scrollIntoView()

        }
}

}


setInterval(PermanecerLogado,5000)
setInterval(buscarMenssagens,3000)
