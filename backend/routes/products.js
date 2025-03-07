const {
  getProductsOpts,
  createProductOpts,
  updateProductOpts,
  deleteProductOpts,
  importProductsOpts,
  adjustStockOpts,
  getStockLogsOpts,
} = require("../controllers/products");

function productRoutes(fastify, options, done) {
  fastify.get("/products", getProductsOpts);
  fastify.post("/products", createProductOpts);
  fastify.patch("/product/:id", updateProductOpts);
  fastify.delete("/product/:id", deleteProductOpts);

  fastify.post("/import-products", importProductsOpts);
  fastify.patch("/product/:id/adjust-stock", adjustStockOpts);
  fastify.get("/stock-logs", getStockLogsOpts);

  done();
}

module.exports = productRoutes;
