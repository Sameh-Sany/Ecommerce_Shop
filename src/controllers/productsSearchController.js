const client = require("../config/elasticsearch/client");

exports.productsSearch = async (req, res) => {
  let productName = req.query?.productName;
  let productDescription = req.query.productDescription;

  if (!productName) {
    productName = "";
  } else if (!productDescription) {
    productDescription = "";
  }

  async function sendESRequest() {
    const body = await client.search({
      index: "products",
      body: {
        query: {
          // i want to search for products that have the productName in their name or description

          bool: {
            should: [
              {
                match: {
                  name: productName,
                },
              },
              {
                match: {
                  description: productDescription,
                },
              },
            ],
          },
        },
      },
    });
    return res.status(200).send({
      message: "Successfully retrieved products",
      data: body.hits.hits,
    });
  }
  sendESRequest();
};
