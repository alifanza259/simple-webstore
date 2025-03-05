const fastify = require("fastify")({ logger: true });
const { validateDbConnection } = require("./database");
const productRoutes = require("./routes/products");

const PORT = 3001;

fastify.register(productRoutes);

const start = async () => {
  try {
    validateDbConnection();
    
    fastify.listen({ host: "localhost", port: PORT });

    process.on("SIGTERM", () => {
      console.info(`Termination by SIGTERM`);
      process.exit(0);
    });

    process.on("SIGINT", () => {
      console.info("Termination by SIGINT");
      process.exit(0);
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
