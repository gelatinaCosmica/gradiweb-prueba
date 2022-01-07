require('dotenv').config()

import Shopify, { ApiVersion as Version, AuthQuery } from '@shopify/shopify-api';
var express = require('express');
var app = express();
const bodyParser = require("body-parser");
const axios = require('axios').default;

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST } = process.env;

const APIUrl = `https://${process.env.SHOP}.myshopify.com/admin/api/2022-01/products.json`


const ApiVersion = {
  version: "2021-10"
}

Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES: ["products"],
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  IS_EMBEDDED_APP: true,
  API_VERSION: Version.October21 // all supported versions are available, as well as "unstable" and "unversioned"
})

const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string | undefined } = {};

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

axios.get(APIUrl)
  .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
      // always executed
    });
  
  app.get("/", async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  const response = client.get({path: 'shop'});

  if (ACTIVE_SHOPIFY_SHOPS[SHOP] === undefined) {
    // not logged in, redirect to login
    res.redirect(`/login`);
  } else {
    res.send("Hello world!");
    // Load your app skeleton page with App Bridge, and do something amazing!
    res.end();
  }
});

// console.log(process.env.API_KEY)

const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});