let nomeUsuario, controle, destinatario, tipoMensagem, texto

controle = false
destinatario = "Todos"
tipoMensagem = "message"


function preloader(){
    const input = document.querySelector(' .telaEntrada input')
    input.classList.add('escondido')

    const button = document.querySelector(' .telaEntrada button')
    button.classList.add('escondido')

    const preloader = document.querySelector(' .telaEntrada .preloader')
    preloader.classList.remove('escondido')

    const nome = document.querySelector(' .telaEntrada p')
    nome.classList.remove('escondido')

}


function logar(){

        const input = document.querySelector(' .telaEntrada input')
        nomeUsuario = input.value
        logado = true
        const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',{
        name: nomeUsuario
        })

        promise.then((resposta)=>{
           
            const statusCode = parseInt(resposta.status)
            if(statusCode === 200){
                preloader()
                setTimeout(()=>{

                    const telaEntrada = document.querySelector(' .telaEntrada')
                    telaEntrada.classList.add('escondido')
                    buscarMensagens()
                },2000)
                
            }else if(statusCode === 400){
                window.location.reload()
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

        mensagens.innerHTML = ""
        for (let i = 0; i < resposta.data.length; i++) {

            if(resposta.data[i].type === 'private_message' && resposta.data[i].to !== nomeUsuario){

            }else{

                if(resposta.data[i].type === 'private_message'){
                    texto = "reservadamente para"
                }else{
                    texto = "para"
                }

                mensagens.innerHTML +=`
                    <div class="mensagem ${resposta.data[i].type} data-identifier="message"" >
                        <p>${resposta.data[i].time} </p>
                        <p><b>${resposta.data[i].from}</b> ${texto} <b>${resposta.data[i].to}</b> </p>
                        <p>${resposta.data[i].text} </p>
                    </div>
                    `
                mensagens.lastElementChild.scrollIntoView()
            }

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

        if(resposta.data.length >5){
            let menuVisibilidade = document.querySelector(".menus .menuVisibilidade")
            menuVisibilidade.classList.add("fixar")
        }
        usuariosAtivos.innerHTML = ""
        usuariosAtivos.innerHTML +=`
        <div class= "usuarios usuario_0 selecionado" onclick="selecionar('usuariosAtivos',this)" data-identifier="participant">
            <ion-icon name="people-sharp"></ion-icon>
            <p>Todos</p>
            <ion-icon name="checkmark-sharp" class="check "></ion-icon>
        </div>`

        for (let i = 0; i < resposta.data.length; i++) {
            
            usuariosAtivos.innerHTML +=`
                <div class= "usuarios usuario_${i+1}" onclick="selecionar('usuariosAtivos',this)" data-identifier="participant">
                    <ion-icon name="person-circle"></ion-icon>
                    <p>${resposta.data[i].name}</p>
                    <ion-icon name="checkmark-sharp" class="check desmarcado"></ion-icon>
                </div>
                `

        }
}

}
function EnviarMensagens(){

    const input = document.querySelector('footer input')
    const promise = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',{
        from: nomeUsuario,
        to: destinatario,
        text: input.value,
        type: tipoMensagem 
    })

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


function selecionar(tipo, item){

    const itemSelecionado = document.querySelector(`.${tipo} .selecionado`)

    if (itemSelecionado != null){
        itemSelecionado.classList.remove('selecionado')
        itemSelecionado.children[2].classList.add('desmarcado')
        item.children[2].classList.remove("desmarcado")
        item.classList.add("selecionado")
    
    }{
        item.children[2].classList.remove("desmarcado")
        item.classList.add("selecionado")
        
    }
    
    if(item.children[1].innerText === 'Público'){

        destinatario = "Todos"
        tipoMensagem = "message"

    }else if(item.children[1].innerText === 'Reservadamente'){
        tipoMensagem = "private_message"
        
    }else{
        destinatario = item.children[1].innerText
    }
    
       
 } 

setInterval(PermanecerLogado,5000)
setInterval(buscarMensagens,3000)
setInterval(buscarUsuariosAtivos,10000)

document.addEventListener("keypress", (tecla)=> {
    if(tecla.key === 'Enter') {
        EnviarMensagens()
    }
  });

