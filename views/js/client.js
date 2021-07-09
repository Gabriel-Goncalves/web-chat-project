const socket = window.io();

const formNickname = document.querySelector('#form-nickname');
const formMessage = document.querySelector('#message-form');
const inputNickname = document.querySelector('#nickname');
const inputMessage = document.querySelector('#mensagem');

let NICK = '';

formNickname.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('changeNickname', {
    nickname: inputNickname.value,
  });
  inputNickname.value = '';
  return false;
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', { chatMessage: inputMessage.value, nickname: NICK });
  inputMessage.value = '';
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const createUserNickname = (nickname) => {
  const userNameList = document.querySelector('#localUser');
  const li = document.createElement('li');
  li.setAttribute('data-testid', 'online-user');
  li.setAttribute('id', 'online-user');
  li.innerText = nickname;
  NICK = nickname;
  userNameList.appendChild(li);
};

const appendNewUser = (nickname, id) => {
  const onlineUsersList = document.querySelector('#onlineUsers');
  const li = document.createElement('li');
  li.setAttribute('id', id);
  li.innerText = nickname;
  onlineUsersList.appendChild(li);
};

const createAllOnlineUsers = (allClients) => {
  allClients.forEach((clientNick) => {
    appendNewUser(clientNick.nickname, clientNick.id);
  });
};

socket.on('userNickname', ({ randomNickname: nickname, allClients }) => {
  createUserNickname(nickname);
  console.log(allClients);
  createAllOnlineUsers(allClients);
});

const changeUserNick = (nick) => {
  const userNick = document.querySelector('#online-user');
  userNick.innerText = nick;
};

const changeUserNickInList = (nick, id) => {
  const userNickList = document.querySelector(`#${id}`);
  userNickList.innerText = nick;
};

socket.on('newUser', ({ randomNickname: nickname, id }) =>
  appendNewUser(nickname, id));

socket.on('changeUserNick', (newNick) => {
  changeUserNick(newNick);
  NICK = newNick;
});

socket.on('changeUserNickList', ({ newNick, id }) => {
  changeUserNickInList(newNick, id);
});

socket.on('message', (message) => {
  createMessage(message);
});