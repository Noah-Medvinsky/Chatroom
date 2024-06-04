// testFirebase.js

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import bcrypt from 'bcrypt';
import { writeUserData, readUserData } from './firebase';

// Mock Firebase and bcrypt modules
jest.mock("firebase/app");
jest.mock("firebase/database");
jest.mock("bcrypt");

describe("Firebase Functions", () => {
  let mockDb, mockRef, mockSet, mockGet, mockHash, mockCompare;

  beforeAll(() => {
    // Initialize Firebase mock
    mockDb = {};
    mockRef = jest.fn();
    mockSet = jest.fn();
    mockGet = jest.fn();
    mockHash = jest.fn();
    mockCompare = jest.fn();

    initializeApp.mockReturnValue({});
    getDatabase.mockReturnValue(mockDb);
    ref.mockImplementation(mockRef);
    set.mockImplementation(mockSet);
    get.mockImplementation(mockGet);
    bcrypt.hash.mockImplementation(mockHash);
    bcrypt.compare.mockImplementation(mockCompare);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("writeUserData should hash the password and write user data to Firebase", async () => {
    const userId = "testUser";
    const name = "Test User";
    const email = "testuser@example.com";
    const password = "password123";
    const hashedPassword = "hashedPassword123";

    mockHash.mockResolvedValue(hashedPassword);
    mockSet.mockResolvedValue(null);

    await writeUserData(userId, name, email, password);

    expect(mockHash).toHaveBeenCalledWith(password, 10);
    expect(mockSet).toHaveBeenCalledWith(ref(mockDb, 'users/' + userId), {
      username: name,
      email: email,
      password: hashedPassword
    });
  });

  test("readUserData should return true if passwords match", async () => {
    const userId = "testUser";
    const password = "password123";
    const hashedPassword = "hashedPassword123";

    mockGet.mockResolvedValue({
      exists: jest.fn(() => true),
      val: jest.fn(() => ({
        username: "Test User",
        email: "testuser@example.com",
        password: hashedPassword
      }))
    });
    mockCompare.mockResolvedValue(true);

    const result = await readUserData(userId, password);

    expect(mockRef).toHaveBeenCalledWith(mockDb, 'users/' + userId);
    expect(mockGet).toHaveBeenCalled();
    expect(mockCompare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(true);
  });

  test("readUserData should return false if passwords do not match", async () => {
    const userId = "testUser";
    const password = "password123";
    const hashedPassword = "hashedPassword123";

    mockGet.mockResolvedValue({
      exists: jest.fn(() => true),
      val: jest.fn(() => ({
        username: "Test User",
        email: "testuser@example.com",
        password: hashedPassword
      }))
    });
    mockCompare.mockResolvedValue(false);

    const result = await readUserData(userId, password);

    expect(mockRef).toHaveBeenCalledWith(mockDb, 'users/' + userId);
    expect(mockGet).toHaveBeenCalled();
    expect(mockCompare).toHaveBeenCalledWith(password, hashedPassword);
    expect(result).toBe(false);
  });

  test("readUserData should return false if no data is available", async () => {
    const userId = "testUser";
    const password = "password123";

    mockGet.mockResolvedValue({
      exists: jest.fn(() => false),
      val: jest.fn()
    });

    const result = await readUserData(userId, password);

    expect(mockRef).toHaveBeenCalledWith(mockDb, 'users/' + userId);
    expect(mockGet).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});