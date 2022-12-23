const socket = io("localhost:3000", { transports: ['websocket'] });

const form = document.querySelector(".write-message");
const input = document.querySelector('#message-input');
const loginContainer = document.querySelector('.login');
const loginInput = document.querySelector('.login > form > input');
const loginBtn = document.querySelector('.login > form > button');
const chatBoxMain = document.querySelector('.chat-box-main');

let user = "";
let isBtnActive = false;

// check si cet utilisateur s'est déjà inscrit sur le site
function checkUser() {
    if(localStorage.getItem('user').length > 0) {
        chatBoxMain.classList.remove('hide');
        loginContainer.classList.add('hide');
        user = localStorage.getItem('user');
        return true;
    } else {
        return false;
    }
}

// event sur l'input de connexion
loginInput.addEventListener('keyup', (e) => {
    if(e.target.value.length > 0) {
        loginBtn.classList.remove('disable');
        isBtnActive = true;
    } else {
        loginBtn.classList.add('disable');
        isBtnActive = false;
    }
});

// event sur le bouton de connexion
loginBtn.addEventListener('click', () => {
    if(isBtnActive) {
        chatBoxMain.classList.remove('hide');
        loginContainer.classList.add('hide');
        localStorage.setItem("user", loginInput.value);
        user = loginInput.value;
    }
});

// vérifier si l'utilisateur s'est déjà inscrit sur le site
checkUser();

// event sur le form de message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    socket.emit('chat message', { message: input.value, user });
    console.log('message envoyé au backend !');
    input.value = "";
});

// quand le backend nous envoies un message
socket.on('chat message', (data) => {
    console.log(data);
    const div = document.createElement("div");
    const p = document.createElement('p');
    const messagesContainer = document.querySelector('.messages');

    div.classList.add('message');

    if(data.user !== user) {
        div.classList.add('received-message');
    } else {
        div.classList.add('user-message')
    }

    p.innerText = `${data.user} : ${data.message}`;
    div.appendChild(p);
    messagesContainer.appendChild(div);
});