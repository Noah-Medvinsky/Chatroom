import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import _ from 'lodash';

const firebaseConfig = {
  apiKey: "AIzaSyAUg5d6VpoJSJ1OWe_zYg8ER3kRBpQ9nFQ",
  authDomain: "chatroom-421223.firebaseapp.com",
  projectId: "chatroom-421223",
  storageBucket: "chatroom-421223",
  messagingSenderId: "199486896569",
  appId: "1:199486896569:web:d04a624b5c4a469ddbde68",
  measurementId: "G-MMD690D7KC"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function writeUserData(chatroom, name, timestamp, message) {
  try {
    let time= getTimeForDataBase(timestamp)
    let timeName= time+name
    set(ref(db, chatroom+'/' + timeName), {
      name: name,
      timestamp: timestamp,
      message: message
    });
  } catch (error) {
    console.error("Error writing data:", error);
  }
}

function readUserData(chatroom) {
  console.log("chatroom is "+chatroom)
  const userRef = ref(db, chatroom+'/' );
  
  // Return a promise
  return get(userRef)
      .then((snapshot) => {
          if (snapshot.exists()) {
              console.log("User data:", snapshot.val());
              return snapshot.val();
          } else {
              console.log("No data available");
              return {}; // Return an empty object if no data
          }
      })
      .catch((error) => {
          console.error("Error reading data:", error);
          return {}; // Return an empty object on error
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
  var messageInput = document.getElementById('messageInput');
  var message = messageInput.value.trim();
  if (message !== '') {
    var timestamp = new Date().toISOString();
    await displayMessage2(username, message, timestamp);
    // username +timestamp or somethin
    
    messageInput.value = '';
    writeUserData(chatroom, username, timestamp, message);
  }
}

async function displayMessage2(sender, message, timestamp) {
    var messagesContainer = document.getElementById('messages');
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span class="sender">${sender}:</span> ${message} <span class="timestamp"> - ${getCurrentTime(timestamp)}</span>`;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function displayMessage(sender, message, timestamp) {
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
      messagesArray.forEach(({ name, message, timestamp }) => {
          var messageElement = document.createElement('div');
          messageElement.classList.add('message');
          messageElement.innerHTML = `<span class="sender">${name}:</span> ${message} <span class="timestamp"> - ${getCurrentTime(timestamp)}</span>`;
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
// Attach functions to the window object
window.sendMessage2 = sendMessage2;
window.displayMessage = displayMessage;
window.getCurrentTime = getCurrentTime;