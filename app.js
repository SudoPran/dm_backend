const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());
const port = 8080;

// Get URLs...
const shopsterSearchApiUrl = 'http://127.0.0.1:3001/getItems';
const mantraSearchApiUrl = 'http://127.0.0.1:3002/getItems';
const mangoeSearchApiUrl = 'http://127.0.0.1:3003/getItems';

// Place Order URLs...
const shopsterNewOrderApiUrl = 'http://127.0.0.1:3001/newOrder';
const mantraNewOrderApiUrl = 'http://127.0.0.1:3002/newOrder';
const mangoeNewOrderApiUrl = 'http://127.0.0.1:3003/newOrder';


app.get('/searchProducts/', async (req, res) => {
  data = []
  const queryParam = req.query.query;

  // Call Shopster...
  let shopsterResponse = await axios.get(shopsterSearchApiUrl + '?query=' + queryParam);
  data.push(shopsterResponse.data);

  // Call Mantra...
  let mantraResponse = await axios.get(mantraSearchApiUrl + '?query=' + queryParam);
  data.push(mantraResponse.data);

  // Call Mangoe...
  let mangoeResponse = await axios.get(mangoeSearchApiUrl + '?query=' + queryParam);
  data.push(mangoeResponse.data);

  res.json(data)
});

app.post('/placeOrder/', async (req, res) => {
  if (req && req.body) {
    try {
      console.log(req.body);
      if (req.body._id.substr(0, 3) == 'MNT') {
        const response = await axios.post(mantraNewOrderApiUrl, req.body);
        res.json(response);
      }
      else if (req.body._id.substr(0, 3) == 'SHP') {
        const response = await axios.post(shopsterNewOrderApiUrl, req.body);
        res.json(response);
      }
      else if (req.body._id.substr(0, 3) == 'MAN') {
        const response = await axios.post(mangoeNewOrderApiUrl, req.body);
        res.json(response);
      }
    }
    catch (error) {
      res.status(400).send(error);
    }
  }
  else {
    res.status(400).send({});
  }
});

app.listen(port, () => {
  console.log('Laura is up!');
});