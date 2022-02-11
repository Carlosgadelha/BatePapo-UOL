

let mensagens = document.querySelector("main .mensagens")


const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
promessa.then(processarResposta);

function processarResposta(resposta) {
    console.log(resposta.data)
    for (let i = 0; i < resposta.data.length; i++) {
        
        mensagens.innerHTML +=`
            <div class="mensagem">
                <p class="horario">${resposta.data[i].time} </p>
                <p>${resposta.data[i].from} ${resposta.data[i].to}</p>
                <p>${resposta.data[i].text} </p>
            </div>
            `
        mensagens.lastElementChild.scrollIntoView()

    }

}

