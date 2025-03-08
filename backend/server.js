const fastify = require("fastify")({ logger: true });
const { validateDbConnection } = require("./database");
const productRoutes = require("./routes/products");

fastify.register(productRoutes);
fastify.register(require("@fastify/cors"), {
  origin: "*",
});

const start = async () => {
  try {
    validateDbConnection();

    const [host, port] = process.env.APP_URL.split(":");
    fastify.listen({ host, port });

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
