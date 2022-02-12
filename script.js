let nomeUsuario


function logar(){

        nomeUsuario = prompt("Qual seu nome? ")
        logado = true
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',{
        name: nomeUsuario
        })
        console.log("teste")
        promise.then((resposta)=>{
           
            const statusCode = parseInt(resposta.status)
            if(statusCode === 200){
                console.log("Sucesso vai da certo Garoto")
                buscarMenssagens()
            }
        })

        promise.catch(()=>{
           window.location.reload()
        });

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

function EnviarMensagens(){

    const input = document.querySelector('input')
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',{
        from: nomeUsuario,
        to: "para todos",
        text: input.value,
        type: "message" // ou "private_message" para o bônus
    })

    console.log(input.value)

    promise.then(()=>{
        input.value = ''
        buscarMenssagens()
    })
    promise.catch(()=>{
        window.location.reload()
    });
      
}

function ativarMenu(){
    const menuLateral = document.querySelector(".fundo")
    menuLateral.classList.toggle("escondido")
}

logar()
setInterval(PermanecerLogado,5000)
setInterval(buscarMenssagens,10000)
