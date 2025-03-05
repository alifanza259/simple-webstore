const fastify = require("fastify")({ logger: true });

const PORT = 3001;

const start = async () => {
  try {
    fastify.listen({ host: "localhost", port: PORT });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
