const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.negmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const database = client.db("taskify");
    const taskCollection = database.collection("tasks");

    app.get("/tasks", async (req, res) => {
      try {
        const todo = await taskCollection.find({ category: "todo" }).toArray();
        const inProgress = await taskCollection
          .find({ category: "inProgress" })
          .toArray();
        const done = await taskCollection.find({ category: "done" }).toArray();
        res.json({ todo, inProgress, done });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
