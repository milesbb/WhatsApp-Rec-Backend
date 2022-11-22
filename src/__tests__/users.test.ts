import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import server from "../server";

dotenv.config();

const client = supertest(server);

describe("Test User Endpoints", async () => {
  beforeAll(async () => {
    if (process.env.MONGO_TEST_CONNECTION) {
      await mongoose.connect(process.env.MONGO_TEST_CONNECTION);
    } else {
      throw new Error("Mongo URL missing!");
    }
  });

  // Check MongoDB connection is not undefined

  // Register User Bad Data (POST)

  // Register User (POST)

  // Login User (POST)

  // Refresh Tokens (POST)

  // GET all users

  // GET me

  // PUT me

  // GET user specific

  // GET user specific non-existent ID

  // POST user avatar

  // Logout (DELETE)

  // Test Logout


  // After All Close Connection

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
