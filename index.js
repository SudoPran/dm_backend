const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.json())

const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('dm_db');
    const inventory = database.collection('inventory');
    const query = { _id: 100 };
    const item = await inventory.findOne(query);
    console.log(item);
  }
  finally {
    await client.close();
  }
}
run().catch(console.dir);

const port = 3000;
app.listen(port, () => {
  console.log("Server up!");
});

app.get('/api/test', (req, res) => {
    res.json({"body": "Test output"});
})