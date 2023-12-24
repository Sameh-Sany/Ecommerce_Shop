const { Client } = require("@elastic/elasticsearch");
require("dotenv").config();

const client = new Client({
  cloud: {
    id: process.env.cloudID,
  },
  auth: {
    apiKey: process.env.apiKey,
  },

  // if want to use username and password
  // auth: {
  //   username: process.env.elastic_username,
  //   password: process.env.password,
  // },
});

client
  .ping()
  .then((response) => console.log("You are connected to Elasticsearch"))
  .catch((error) => console.error("Elasticsearch is not connected."));

module.exports = client;
