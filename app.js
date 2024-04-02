const express = require('express');
const axios = require('axios');

const { createEntry, getEntries } = require('./data-access')
const { mapOrderDTO } = require('./mapper-util')

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

app.post('/createUser/', async (req, res) => {
  if (req && req.body) {
    let schema = '(name, email, address, password, phone)';
    let types = ['str', 'str', 'str', 'str', 'str'];
    let values = [req.body.name, req.body.email, req.body.address, req.body.password, req.body.phone];
    let response = await createEntry('CUSTOMER', schema, types, values);
    res.send(response != null);
  }
});

app.post('/checkUser/', async (req, res) => {
  if (req && req.body) {
    let fields = ['email', 'password'];
    let filter = "email = '" + req.body.email + "' and password = '" + req.body.password + "'";
    let response = await getEntries('CUSTOMER', fields, filter);
    res.send(response && response.length > 0 && response.email == req.email && response.password == req.password);
  }
});

app.get('/searchProducts/', async (req, res) => {
  if (req && req.body && req.body.query) {
    data = []
    const queryParam = req.body.query;
  
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
  }
});

app.post('/placeOrder/', async (req, res) => {
  if (req && req.body && req.body.orders && req.body.orders.length > 0) {
    for (let i = 0; i < req.body.orders.length; i++) {
      // Map Laura order to DTO...
      let orderDTO = mapOrderDTO(req.body.orders[i]);

      // Microservices order placements...
      try {
        if (req.body.orders[i].seller_id == 'MNT') {
          const response = await axios.post(mantraNewOrderApiUrl, orderDTO);
          console.log(response);
          // res.json(response);
        }
        else if (req.body.orders[i].seller_id == 'SHP') {
          const response = await axios.post(shopsterNewOrderApiUrl, orderDTO);
          console.log(response);
          // res.json(response);
        }
        else if (req.body.orders[i].seller_id == 'MAN') {
          console.log(orderDTO);
          const response = await axios.post(mangoeNewOrderApiUrl, orderDTO);
          console.log(response);
          // res.json(response);
        }
      }
      catch (error) {
        res.status(400).send(error);
      }

      // Warehouse order placements...
      let schema = '(order_id, invoice_id, customer_id, seller_id, date_created, date_modified, product_ids, quantities, total_cost, order_status)';
      let types = ['str', 'str', 'int', 'str', 'str', 'str', 'str', 'int', 'int', 'str'];

      // For now, date created = date modified...
      let values = [req.body.orders[i].order_id, req.body.orders[i].invoice_id, req.body.orders[i].customer_id, req.body.orders[i].seller_id,
      req.body.orders[i].date_created, req.body.orders[i].date_created, req.body.orders[i].product_ids, req.body.orders[i].quantities, req.body.orders[i].total_cost,
      req.body.orders[i].order_status];
      
      let response = await createEntry('ORDERDETAIL', schema, types, values);
      res.send(response != null);
    }
  }
  else {
    res.status(400).send({});
  }
});

app.listen(port, () => {
  console.log('Laura is up!');
});