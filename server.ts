require('dotenv').config()

var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const axios = require('axios').default;

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

const APIUrl = `https://${API_KEY}:${API_SECRET_KEY}@${SHOP}/admin/api/2022-01/products.json`

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

let productList = []

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}

axios.get(APIUrl)
  .then(function (response) {
    const products = response.data.products

    products.map((item) => {
      productList.push(
        {
          title: item.title,
          data: {
            price: item.variants[0].price,
            status: item.status,
            created_at: formatDate(item.created_at),
          }
        }
      )
    })
    console.log(productList);
  })
  .catch(function (error) {
    console.log(error);
  })


app.get("/", async (req, res) => {
  res.json(productList)
});

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});