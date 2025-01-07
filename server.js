const app = require("./app");
const { connectToDatabase, closeDatabase } = require("./config/database");

const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectToDatabase();
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await closeDatabase();
  process.exit(0);
});
