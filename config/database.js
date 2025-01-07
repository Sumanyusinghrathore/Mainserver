const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://atik:18211317p%40A@cluster0.svz6a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

async function closeDatabase() {
  await client.close();
  console.log("Disconnected from MongoDB");
}

module.exports = { client, connectToDatabase, closeDatabase };
