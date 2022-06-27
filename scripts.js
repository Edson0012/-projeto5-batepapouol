let nome;

function chamar() {
    nome = prompt("Qual o seu nome?");

    const requisição = axios.post(
        "https://mock-api.driven.com.br/api/v6/uol/participants",
        {
            name: nome,
        }
    );
    requisição.then((sucesso) => {
        console.log(sucesso);
    });
    requisição.catch(refreshPage);
}

setInterval(() => {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", {
        name: nome,
    });
}, 5000);

setInterval(buscarMensagens, 3000);

function buscarMensagens() {
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then((resposta) => mensagens(resposta));
    promise.catch(mensagens);
}

function mensagens(mensagem) {
    document.querySelector(".container").innerHTML = "";

    const api = mensagem.data;
    const container = document.querySelector(".container");
    for (let i = 0; i < api.length; i++) {
        const messageInfo = api[i];
        if (api[i].type === "status") {
            container.innerHTML += `<div class="entrou">
                    <p>
                        <span>(${messageInfo.time})</span> <strong>${messageInfo.from}</strong> ${messageInfo.text}
                    </p>
                </div>`;
        } else if (api[i].type === "message") {
            container.innerHTML += ` <div class="normal">
                    <p>
                        <span>(${messageInfo.time})</span> <strong>${messageInfo.from}</strong> para
                        <strong>${messageInfo.to}:</strong> ${messageInfo.text}
                    </p>
                </div>`;
        } else if (api[i].type === "private_message") {
            container.innerHTML += ` <div class="privado">
                     <p>
                        <span>(${messageInfo.time})</span>
                        <strong>${messageInfo.from}</strong> reservadamente para
                        <strong>${messageInfo.to}:</strong> ${messageInfo.text}
                    </p>
                    </div>`;
        }
    }
    rolarFinal();
}
buscarMensagens();

function rolarFinal() {
    const ultimaMenssagem = document.querySelector(".container");
    ultimaMenssagem.lastChild.scrollIntoView();
}

function enviarMsg() {
    const texto = document.querySelector(".envio").value;

    const msg = {
        from: nome,
        to: "Todos",
        text: texto,
        type: "message",
    };
    if (texto) {
        document.querySelector(".envio").value = "";
        const promise = axios.post(
            "https://mock-api.driven.com.br/api/v6/uol/messages",
            msg
        );
        promise.then(buscarMensagens);
        promise.catch(refreshPage);
    } else {
        alert("a caixa de mensagem deve estar preenchida!");
    }
}
function refreshPage() {
    window.location.reload();
}

chamar();
