import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

async function connectDB() {
  // use try/catch - cuz DB in another continent, we might be couth error any time
  const databaseInstance = await mongoose.connect(
    `${process.env.MONGODB_URI}/${DB_NAME}`
  );
  console.log(
    `MONGODB connected !! DB HOST: ${databaseInstance.connection.host}`
  );

  try {
  } catch (error) {
    console.log(`MONGODB connection FAILED ${error}`);
    process.exit(1);
  }
}

export default connectDB;
