const socket = io("https://skelos-chatapp.alwaysdata.net", { transports: ['websocket'] });

const form = document.querySelector(".write-message");
const input = document.querySelector('#message-input');
const loginContainer = document.querySelector('.login');
const loginInput = document.querySelector('.login > form > input');
const loginBtn = document.querySelector('.login > form > button');
const chatBoxMain = document.querySelector('.chat-box-main');
const messagesContainer = document.querySelector('.messages');

const API_URL = "https://skelos-chatapp.alwaysdata.net";

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

function createMessage(user_message, message) {
    const div = document.createElement("div");
    const p = document.createElement('p');

    div.classList.add('message');

    if(user_message !== user) {
        div.classList.add('received-message');
    } else {
        div.classList.add('user-message')
    }

    p.innerText = `${user_message} : ${message}`;
    div.appendChild(p);
    messagesContainer.appendChild(div);
    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
}

// récupérer les anciens messages
axios.get(`${API_URL}/api/v1/message/getAll`)
.then((res) => {
    let messages = res.data;

    messages.forEach((doc) => {
        createMessage(doc.user, doc.message);
    });

    messagesContainer.scrollTo(0, messagesContainer.scrollHeight);
}).catch((err) => console.log(err))

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

    axios.get('http://ip-api.com/json/').then((res) => {

        axios.post(`${API_URL}/api/v1/message/postMessage`, { user, message: input.value, user_ip: res.data.query })
        .then((res) => {
            if(res.data.success) {
                input.value = "";
            }

        }).catch((err) => {
            console.log(err);
        })
    })

});

// quand le backend nous envoies un message
socket.on('chat message', (data) => {
    createMessage(data.user, data.message);
});