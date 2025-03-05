const {
  getProductsOpts,
  createProductOpts,
  updateProductOpts,
  deleteProductOpts,
} = require("../controllers/products");

function productRoutes(fastify, options, done) {
  fastify.get("/products", getProductsOpts);
  fastify.post("/products", createProductOpts);
  fastify.patch("/product/:id", updateProductOpts);
  fastify.delete("/product/:id", deleteProductOpts);

  done();
}

module.exports = productRoutes;
