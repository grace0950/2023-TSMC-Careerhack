import { MongoClient } from "mongodb";

const connectionString = process.env.MONGO_CONNECTION_STRING || "mongodb://localhost:27017";
const client = new MongoClient(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

export default {
    connectToServer: async () => {
        try {
            await client.connect();
            dbConnection = client.db("ha-queue");
            console.log("Successfully connected to MongoDB.");
        } catch (err) {
            console.log(err);
        }
    },
    getDb: () => {
        return dbConnection;
    },
}