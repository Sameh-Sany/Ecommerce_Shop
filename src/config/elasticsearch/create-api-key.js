const client = require("./client");

async function generateApiKeys(opts) {
  const body = await client.security.createApiKey({
    body: {
      name: "ecommerce_app",
      role_descriptors: {
        products_example_writer: {
          cluster: ["monitor"],
          index: [
            {
              names: ["products"],
              privileges: ["create_index", "write", "read", "manage"],
            },
          ],
        },
      },
    },
  });
  return Buffer.from(`${body.id}:${body.api_key}`).toString("base64");
}

generateApiKeys()
  .then(console.log)
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
