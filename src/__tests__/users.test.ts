import supertest from "supertest"
import mongoose from "mongoose"
import dotenv from "dotenv"
import server from "../server"


dotenv.config()

const client = supertest(server)


beforeAll(async () => {
   
    if (process.env.MONGO_TEST_CONNECTION) {
      await mongoose.connect(process.env.MONGO_TEST_CONNECTION)
    } else {
      throw new Error("Mongo URL missing!")
    }
  })


  afterAll(async () => {
    
    await mongoose.connection.close()
  })


    

