const express = require("express");
const router = express.Router();

const { productsSearch } = require("../controllers/productsSearchController");

router.get("/results", productsSearch);

module.exports = router;
