const { pool } = require("../database");

const getProducts = async (req, reply) => {
  const query =
    "SELECT id, title, price, description, category, image, stock FROM products;";

  const result = await pool.query(query);
  const products = result.rows;

  return reply.send({ data: products });
};

const createProduct = async (req, reply) => {
  const { title, price, description, category, image, stock } = req.body;
  const query = `INSERT INTO products (title, price, description, category, image, stock) VALUES 
    ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [title, price, description, category, image, stock];

  var result = await pool.query(query, values);
  var newProduct = result.rows[0];

  return reply.code(201).send({ data: newProduct });
};

const updateProduct = async (req, reply) => {
  const id = req.params.id;
  const { title, price, description, category, image, stock } = req.body;

  const queryFind = `SELECT 1 FROM products WHERE id = $1`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) return reply.code(404).send({ data: "product not found" });

  const queryUpdate = `UPDATE products 
    SET title = $1,
     price = $2, 
     description = $3, 
     category = $4, 
     image = $5, 
     stock = $6
     WHERE id = $7`;
  const values = [title, price, description, category, image, stock, id];

  await pool.query(queryUpdate, values);

  return reply.send({ data: req.body });
};

const deleteProduct = async (req, reply) => {
  const id = req.params.id;
  const queryFind = `SELECT 1 FROM products WHERE id = $1`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) return reply.code(404).send({ data: "product not found" });

  const queryDelete = `DELETE FROM products WHERE id = $1`;

  await pool.query(queryDelete, [id]);

  return reply.code(204).send();
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
      },
    },
  },
  handler: getProducts,
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
  handler: createProduct,
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
          data: { type: "string" },
        },
      },
    },
  },
  handler: updateProduct,
};

const deleteProductOpts = {
  schema: {
    response: {
      204: {},
      404: {
        type: "object",
        properties: {
          data: { type: "string" },
        },
      },
    },
  },
  handler: deleteProduct,
};

module.exports = {
  getProductsOpts,
  createProductOpts,
  updateProductOpts,
  deleteProductOpts,
};
