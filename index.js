const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.negmw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    async function run() {
      try {

            const database = client.db('taskify');
            const taskCollection = database.collection('tasks');
            // create a document to be inserted
        
       
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
        
        
      }
    }
    run().catch(console.dir);
    

// Routes
app.get('/', (req, res) => {
      res.send('Su!');
});

// Start server
app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
});