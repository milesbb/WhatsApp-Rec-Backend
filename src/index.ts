import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import server from "./server";

const port = 3001;

mongoose.connect(process.env.MONGO_CONNECTION_URL!);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to MongoDB!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port ${port}`);
  });
});