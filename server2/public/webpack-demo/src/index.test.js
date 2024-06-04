// index.test.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import {
  writeUserData,
  readUserData,
  getParametersFromURL,
  sendMessage2,
  displayMessage2,
  displayMessage,
  getTimeForDataBase,
  getCurrentTime,
} from './index'; 

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("firebase/database", () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  set: jest.fn(() => Promise.resolve()),
  get: jest.fn(() => Promise.resolve({
    exists: jest.fn(() => true),
    val: jest.fn(() => ({
      "2023-01-01T00:00:00.000Z": {
        name: "TestUser",
        timestamp: "2023-01-01T00:00:00.000Z",
        message: "TestMessage"
      }
    })),
  })),
}));

describe('Firebase Functions', () => {
  beforeEach(() => {
    initializeApp.mockClear();
    getDatabase.mockClear();
    ref.mockClear();
    set.mockClear();
    get.mockClear();
  });

  test('writeUserData writes data to the database', async () => {
    await writeUserData('testChatroom', 'testUser', '2023-01-01T00:00:00.000Z', 'testMessage');
    expect(set).toHaveBeenCalled();
  });

  test('readUserData reads data from the database', async () => {
    const data = await readUserData('testChatroom');
    expect(data).toEqual({
      "2023-01-01T00:00:00.000Z": {
        name: "TestUser",
        timestamp: "2023-01-01T00:00:00.000Z",
        message: "TestMessage"
      }
    });
  });
});

describe('URL Parameter Functions', () => {
  beforeEach(() => {
    delete window.location;
    window.location = { search: '?username=testUser&chatroom=testChatroom' };
  });

  test('getParametersFromURL returns correct parameters', () => {
    const params = getParametersFromURL();
    expect(params).toEqual({ username: 'testUser', chatroom: 'testChatroom' });
  });
});

describe('Message Functions', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="messages"></div>
      <input id="messageInput" value="test message"/>
    `;
  });

  test('sendMessage2 sends a message', async () => {
    await sendMessage2();
    const messagesContainer = document.getElementById('messages');
    expect(messagesContainer.children.length).toBe(1);
    expect(messagesContainer.children[0].innerHTML).toContain('test message');
  });

  test('displayMessage2 displays a message', async () => {
    await displayMessage2('testUser', 'test message', '2023-01-01T00:00:00.000Z');
    const messagesContainer = document.getElementById('messages');
    expect(messagesContainer.children.length).toBe(1);
    expect(messagesContainer.children[0].innerHTML).toContain('test message');
  });

  test('displayMessage fetches and displays messages', async () => {
    await displayMessage();
    const messagesContainer = document.getElementById('messages');
    expect(messagesContainer.children.length).toBe(1);
    expect(messagesContainer.children[0].innerHTML).toContain('TestMessage');
  });
});

describe('Time Functions', () => {
  test('getTimeForDataBase returns correct time format', () => {
    const timeString = getTimeForDataBase('2023-01-01T00:00:00.000Z');
    expect(timeString).toBe('12:00:00 AM');
  });

  test('getCurrentTime returns correct time format', () => {
    const timeString = getCurrentTime('2023-01-01T00:00:00.000Z');
    expect(timeString).toBe('12:00 AM');
  });
});
