const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(express.json())

const port = 3000;
app.listen(port, () => {
  console.log("Server up!");
});

const callLauraDb = require('./call_db_laura')
app.get('/api/test', async (req, res) => {
  item = await callLauraDb.searchById(req.query._id)
  res.json(item);
});

// Load all products from Laura...
app.get('/api/laura', async(req, res) => {
  items = await callLauraDb.loadAllProducts();
  res.json(items);
});