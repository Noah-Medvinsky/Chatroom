import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAUg5d6VpoJSJ1OWe_zYg8ER3kRBpQ9nFQ",
  authDomain: "chatroom-421223.firebaseapp.com",
  projectId: "chatroom-421223",
  storageBucket: "chatroom-421223.appspot.com",
  messagingSenderId: "199486896569",
  appId: "1:199486896569:web:d04a624b5c4a469ddbde68",
  measurementId: "G-MMD690D7KC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

async function uploadImage(file) {
  const storageReference = storageRef(storage, 'images/' + file.name);
  const snapshot = await uploadBytes(storageReference, file);
  return getDownloadURL(snapshot.ref);
}

async function writeUserData(chatroom, name, timestamp, message, imageUrl = null) {
  try {
    let time = getTimeForDataBase(timestamp);
    let timeName = time + name;
    const data = {
      name: name,
      timestamp: timestamp,
      message: message,
    };

    if (imageUrl) {
      data.imageUrl = imageUrl;
    }

    await set(ref(db, chatroom + '/' + timeName), data);
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

function readUserData(chatroom) {
  console.log("chatroom is " + chatroom);
  const userRef = ref(db, chatroom + '/');
  return get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("User data:", snapshot.val());
        return snapshot.val();
      } else {
        console.log("No data available");
        return {};
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
      return {};
    });
}

function getParametersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    username: urlParams.get('username') || 'Anonymous',
    chatroom: urlParams.get('chatroom') || 'DefaultChatroom'
  };
}

const { username, chatroom } = getParametersFromURL();

async function sendMessage2() {
  const messageInput = document.getElementById('messageInput');
  const imageInput = document.getElementById('imageInput');
  const messagesContainer = document.getElementById('messages');

  const messageText = messageInput.value.trim();
  const imageFile = imageInput.files[0];

  if (messageText === '' && !imageFile) {
    return;
  }

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');

  const senderElement = document.createElement('div');
  senderElement.classList.add('sender');
  senderElement.textContent = ''+ username;

  const timestampElement = document.createElement('div');
  timestampElement.classList.add('timestamp');
  timestampElement.textContent = new Date().toLocaleTimeString();

  messageElement.appendChild(senderElement);
  messageElement.appendChild(timestampElement);

  let imageUrl = null;
  if (imageFile) {
    imageUrl = await uploadImage(imageFile);
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    messageElement.appendChild(imgElement);
  }

  if (messageText !== '') {
    const textElement = document.createElement('div');
    textElement.textContent = messageText;
    messageElement.appendChild(textElement);
  }

  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  await writeUserData(chatroom, username, new Date().toISOString(), messageText, imageUrl);

  messageInput.value = '';
  imageInput.value = '';
}

async function displayMessage() {
  console.log("Fetching messages...");
  let data = await readUserData(chatroom);

  if (data) {
    console.log("Messages data:", data);
    var messagesContainer = document.getElementById('messages');

    // Clear previous messages
    messagesContainer.innerHTML = '';

    // Convert object to array and sort messages by timestamp
    const messagesArray = Object.values(data).sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    // Append sorted messages to messagesContainer
    messagesArray.forEach(({ name, message, timestamp, imageUrl }) => {
      var messageElement = document.createElement('div');
      messageElement.classList.add('message');

      const senderElement = document.createElement('div');
      senderElement.classList.add('sender');
      senderElement.textContent = name;

      const timestampElement = document.createElement('div');
      timestampElement.classList.add('timestamp');
      timestampElement.textContent = getCurrentTime(timestamp);

      messageElement.appendChild(senderElement);
      messageElement.appendChild(timestampElement);

      if (message) {
        const textElement = document.createElement('div');
        textElement.textContent = message;
        messageElement.appendChild(textElement);
      }

      if (imageUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = imageUrl;
        messageElement.appendChild(imgElement);
      }

      messagesContainer.appendChild(messageElement);
    });

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } else {
    console.log("No data found");
  }
}

function getTimeForDataBase(timestamp) {
  var now = new Date(timestamp);
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  var timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
  return timeString;
}

function getCurrentTime(timestamp) {
  var now = new Date(timestamp);
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var timeString = `${hours}:${minutes} ${ampm}`;
  return timeString;
}

window.onload = () => {
  displayMessage();
  setInterval(displayMessage, 15000); // Refresh messages every 15 seconds
};

window.sendMessage2 = sendMessage2;
window.displayMessage = displayMessage;
window.getCurrentTime = getCurrentTime;
