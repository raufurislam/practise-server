const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xi11k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    app.get("/tasks/:email", async (req, res) => {
      const { email } = req.params;

      try {
        const todo = await taskCollection
          .find({ category: "todo", userEmail: email })
          .toArray();
        const inProgress = await taskCollection
          .find({ category: "inProgress", userEmail: email })
          .toArray();
        const done = await taskCollection
          .find({ category: "done", userEmail: email })
          .toArray();
        res.json({ todo, inProgress, done });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" });
      }
    });

    app.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        const newTask = { _id: result.insertedId, ...task };
        res.status(201).json(newTask);
      } catch (error) {
        res.status(500).json({ error: "Failed to add task" });
      }
    });

    app.put("/tasks/drag/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const { category, order } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = { $set: { category, order } };
        const result = await taskCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 0) {
          return res.status(404).json({ error: "Task not found" });
        }
        const updatedTask = await taskCollection.findOne(filter);
        res.json(updatedTask);
      } catch (error) {
        res.status(500).json({ error: "Failed to update task order" });
      }
    });

    app.delete("/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: "Invalid ObjectId" });
        }
        const result = await taskCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: "Task not found" });
        }
        res.json({ message: "Task deleted" });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
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
