const express = require("express");
const router = express.Router();
const axios = require("axios");
const client = require("../client");

const URL = `http://localhost:3000/api/products`;

router.get("/products", async function (req, res) {
  try {
    console.log("Loading Application...");

    // Fetch data from the products API
    const PRODUCTS = await axios.get(`${URL}`, {
      headers: {
        "Content-Type": ["application/json", "charset=utf-8"],
      },
    });

    console.log("Data retrieved!");

    const results = PRODUCTS.data.data;

    console.log("Indexing data...");

    // Use Promise.all to wait for all indexing operations to complete
    await Promise.all(
      results.map(async (result) => {
        const productObject = {
          name: result.name,
          description: result.description,
        };

        await client.index({
          index: "products",
          id: result.id,
          body: productObject,
          pipeline: "products_pipeline",
        });
      })
    );

    console.log("Data has been indexed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

  console.log("Preparing for the next round of indexing...");
  res.json("Running Application...");
});

module.exports = router;
