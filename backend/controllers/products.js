const { postAnalytics } = require("../services/analytics");
const {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  getStockLogs,
  adjustStock,
} = require("../services/products");

const getProductsController = async (req, reply) => {
  const { page = 1, perPage, title, category, lastProductId } = req.query;

  try {
    const { products, meta } = await getProducts({
      page,
      perPage,
      title,
      category,
      lastProductId,
    });

    return reply.send({
      data: products,
      meta,
    });
  } catch (error) {
    return reply.code(500).send({
      message: error.message,
    });
  }
};

const getProductDetailController = async (req, reply) => {
  const id = req.params.id;

  try {
    const product = await getProductDetail(id);

    return reply.send({
      data: product,
    });
  } catch (error) {
    if (error.message === "Product not found") {
      return reply.code(404).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: error.message,
    });
  }
};

const createProductController = async (req, reply) => {
  const { title, price, description, category, image, stock = 0 } = req.body;

  try {
    const newProduct = await createProduct({
      title,
      price,
      description,
      category,
      image,
      stock,
    });

    postAnalytics([
      {
        name: "admin_actions",
        params: {
          action: "product_creation",
          event_source: "backend",
        },
      },
    ]);

    return reply.code(201).send({ data: newProduct });
  } catch (error) {
    return reply.code(500).send({
      message: error.message,
    });
  }
};

const updateProductController = async (req, reply) => {
  const id = req.params.id;
  const { title, price, description, category, image } = req.body;

  try {
    await updateProduct(id, { title, price, description, category, image });

    postAnalytics([
      {
        name: "admin_actions",
        params: {
          action: "product_update",
          event_source: "backend",
        },
      },
    ]);
  } catch (error) {
    if (error.message === "Product not found") {
      return reply.code(404).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: error.message,
    });
  }

  return reply.send({ data: req.body });
};

const deleteProductController = async (req, reply) => {
  const id = req.params.id;

  try {
    await deleteProduct(id);
    postAnalytics([
      {
        name: "admin_actions",
        params: {
          action: "product_deletion",
          event_source: "backend",
        },
      },
    ]);

    return reply.code(204).send();
  } catch (error) {
    if (error.message === "Product not found") {
      return reply.code(404).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: error.message,
    });
  }
};

const importProductsController = async (req, reply) => {
  try {
    await importProducts();

    return reply.send({ data: "import success" });
  } catch (error) {
    return reply.code(500).send({
      message: error.message,
    });
  }
};

const adjustStockController = async (req, reply) => {
  const adjustStockAmount = req.body.amount;
  const id = req.params.id;

  try {
    await adjustStock(adjustStockAmount, id);

    postAnalytics([
      {
        name: "stock_adjustment",
        params: {
          event_source: "backend",
        },
      },
    ]);

    return reply.send({
      data: "adjust stock success",
    });
  } catch (error) {
    if (error.message === "Product not found") {
      return reply.code(404).send({
        message: error.message,
      });
    }
    if (error.message === "Product out of stock") {
      return reply.code(400).send({
        message: error.message,
      });
    }

    return reply.code(500).send({
      message: error.message,
    });
  }
};

const getStockLogsController = async (req, reply) => {
  try {
    const stockLogs = await getStockLogs();

    return reply.send({
      data: stockLogs,
    });
  } catch (error) {
    return reply.code(500).send({
      message: error.message,
    });
  }
};

const Product = {
  id: { type: "integer" },
  title: { type: "string" },
  price: { type: "integer", minimum: 1 },
  description: { type: "string" },
  category: { type: "string" },
  image: { type: "string" },
  stock: { type: "integer", minimum: 0, default: 0 },
};

const getProductsOpts = {
  schema: {
    response: {
      200: {
        data: {
          type: "object",
          properties: {
            type: "array",
            items: {
              type: "object",
              properties: Product,
            },
          },
        },
        meta: {
          type: "object",
          properties: {
            page: { type: "integer" },
            perPage: { type: "integer" },
            totalPages: { type: "integer" },
            totalItems: { type: "integer" },
          },
        },
      },
    },
  },
  handler: getProductsController,
};

const createProductOpts = {
  schema: {
    body: {
      type: "object",
      required: ["title"],
      properties: Product,
    },
    response: {
      201: {
        type: "object",
        properties: {
          data: { type: "object", properties: Product },
        },
      },
    },
  },
  handler: createProductController,
};

const updateProductOpts = {
  schema: {
    body: {
      type: "object",
      required: ["title"],
      properties: Product,
    },
    response: {
      200: {
        type: "object",
        properties: {
          data: { type: "object", properties: Product },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: updateProductController,
};

const deleteProductOpts = {
  schema: {
    response: {
      204: {},
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: deleteProductController,
};

const importProductsOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          data: { type: "string" },
        },
      },
    },
  },
  handler: importProductsController,
};

const adjustStockOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "string",
          },
        },
      },
      404: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  handler: adjustStockController,
};

const getStockLogsOpts = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                logId: { type: "integer" },
                productId: { type: "integer" },
                productId: { type: "integer" },
                productName: { type: "string" },
                activity: { type: "string" },
                changes: { type: "integer" },
                transactionDate: { type: "integer" },
              },
            },
          },
        },
      },
    },
  },
  handler: getStockLogsController,
};

const getProductDetailOpts = {
  schema: {
    response: {
      200: {
        data: {
          type: "object",
          properties: Product,
        },
      },
    },
  },
  handler: getProductDetailController,
};

module.exports = {
  getProductsOpts,
  createProductOpts,
  updateProductOpts,
  deleteProductOpts,
  importProductsOpts,
  adjustStockOpts,
  getStockLogsOpts,
  getProductDetailOpts,
};
