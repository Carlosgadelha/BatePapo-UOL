let nomeUsuario, controle

controle = false


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
                buscarMensagens()
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

function buscarMensagens(){
    
    let mensagens,mensagensAntigas, mensagensAtuais
    
    mensagens = document.querySelector("main .mensagens")

    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(processarResposta);

    function processarResposta(resposta) {
        // console.log(resposta.data.length)

        // if(controle === false){
        //         mensagensAntigas = Array.from(resposta.data)
        //         console.log( mensagensAntigas)
        //         controle = true
        //     }else{
        //         mensagensAtuais = Array.from(resposta.data)
        //         console.log(novasMensagens(mensagensAntigas, mensagensAtuais))
        //         controle = false
        //     }
        mensagens.innerHTML = ""
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

function novasMensagens(mensagensAntigas, mensagensAtuais){
    return mensagensAntigas.filter((element)=>{
        !mensagensAtuais.includes(element)
    })

}

function buscarUsuariosAtivos(){

    let usuariosAtivos = document.querySelector(".menus .usuariosAtivos")

    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    promessa.then(processarResposta);

    function processarResposta(resposta) {

        // if(controle === false){
        //     usuariosAtivos_anteriores = resposta.data
        // }else{
        //     const usuariosAtivos_atuais = resposta.data.filter(separar())
        // }

        if(resposta.data.length >5){
            let menuVisibilidade = document.querySelector(".menus .menuVisibilidade")
            menuVisibilidade.classList.add("fixar")
        }
        usuariosAtivos.innerHTML = ""
        usuariosAtivos.innerHTML +=`
        <div class= "usuarios usuario_0" onclick="selecionar('usuario_0')">
            <ion-icon name="people-sharp"></ion-icon>
            <p>Todos</p>
            <ion-icon name="checkmark-sharp" class="check desmarcado"></ion-icon>
        </div>`

        for (let i = 0; i < resposta.data.length; i++) {
            
            usuariosAtivos.innerHTML +=`
                <div class= "usuarios usuario_${i+1}" onclick="selecionar('usuario_${i+1}')">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark-sharp" class="check desmarcado"></ion-icon>
                </div>
                `
            usuariosAtivos.lastElementChild.scrollIntoView()

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
        buscarMensagens()
    })
    promise.catch(()=>{
        window.location.reload()
    });
      
}

function ativarMenu(){
    buscarUsuariosAtivos()
    const menuLateral = document.querySelector(".fundo")
    menuLateral.classList.toggle("escondido")
}

function selecionar(tipo){
    let itemAnterior

    if( tipo === 'publico'){
        itemAnterior = document.querySelector(`.reservadamente .check`)
    }else{
        itemAnterior = document.querySelector(`.publico .check`)
    }
    
    const item = document.querySelector(`.${tipo} .check`)

    item.classList.remove("desmarcado")
    itemAnterior.classList.add("desmarcado")
}

logar()
setInterval(PermanecerLogado,5000)
setInterval(buscarMensagens,10000)
setInterval(buscarUsuariosAtivos,10000)

document.addEventListener("keypress", (tecla)=> {
    if(tecla.key === 'Enter') {
        EnviarMensagens()
    }
  });

