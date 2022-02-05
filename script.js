const CLIENT_ID = 'pqmzeWVbEieKJeUz';

const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});

let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
    }
  });
});


function getRandomName() {
  const adjs = ["Super", "Capitan","Man", "Retard", "Assasin"];
  const nouns = ["Fart", "Sneez", "Barf", "Toothache", "Horn"];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] + " " + nouns[Math.floor(Math.random() * nouns.length)]
  );
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}


const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  })
}
function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.background = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElementReceive(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message-receive';
  return el;
}

function createMessageElement(text, member) {
  if (member == members[0]){
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message';
    return el;
  }
  else{
    const el = document.createElement('div');
    el.appendChild(createMemberElement(member));
    el.appendChild(document.createTextNode(text));
    el.className = 'message-receive';
    return el;
  }
}


// function checkMessageIfIncomming(text, member){
//   if (mymessage == message){

//     addMessageToListDOMReceive(text,member)
//   }
//   else{
//     addMessageToListDOM(text)
// }

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
