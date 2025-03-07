const { pool } = require("../database");

const getProducts = async (req, reply) => {
  const { page = 1, perPage = 10, title, category } = req.query;
  const values = [];
  let index = 1;

  let query =
    "SELECT id, title, price, description, category, image, stock FROM products WHERE 1=1";
  let countQuery = "SELECT COUNT(1) FROM products WHERE 1=1";

  if (title) {
    countQuery += ` AND title ILIKE $${index}`;
    query += ` AND title ILIKE $${index}`;
    values.push(`%${title}%`);
    index++;
  }
  if (category) {
    countQuery += ` AND category ILIKE $${index}`;
    query += ` AND category ILIKE $${index}`;
    values.push(`%${category}%`);
    index++;
  }

  const resultCount = await pool.query(countQuery, values);
  const totalItems = parseInt(resultCount.rows[0].count, 10);
  const totalPages = Math.ceil(totalItems / perPage);

  query += ` LIMIT $${index} OFFSET $${index + 1}`;
  values.push(perPage, (page - 1) * perPage);

  const result = await pool.query(query, values);
  const products = result.rows;

  return reply.send({
    data: products,
    meta: { page, perPage, totalPages, totalItems },
  });
};

const createProduct = async (req, reply) => {
  const { title, price, description, category, image, stock = 0 } = req.body;

  const query = `INSERT INTO products (title, price, description, category, image, stock) VALUES 
    ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [title, price, description, category, image, stock];

  await pool.query("BEGIN");

  var result = await pool.query(query, values);
  var newProduct = result.rows[0];

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
    ($1, $2, $3);`;
  await pool.query(queryInsertLog, [newProduct.id, "Insert Product", stock]);

  await pool.query("COMMIT");

  return reply.code(201).send({ data: newProduct });
};

const updateProduct = async (req, reply) => {
  const id = req.params.id;
  const { title, price, description, category, image } = req.body;

  const queryFind = `SELECT 1 FROM products WHERE id = $1`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) return reply.code(404).send({ data: "product not found" });

  const queryUpdate = `UPDATE products 
    SET title = $1,
     price = $2, 
     description = $3, 
     category = $4, 
     image = $5,
     WHERE id = $6`;
  const values = [title, price, description, category, image, id];

  await pool.query(queryUpdate, values);

  return reply.send({ data: req.body });
};

const deleteProduct = async (req, reply) => {
  const id = req.params.id;
  const queryFind = `SELECT id, stock FROM products WHERE id = $1`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) return reply.code(404).send({ data: "product not found" });

  await pool.query("BEGIN");

  const queryDelete = `DELETE FROM products WHERE id = $1`;

  await pool.query(queryDelete, [id]);

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
  ($1, $2, $3);`;
  await pool.query(queryInsertLog, [id, "Remove Product", -product.stock]);

  await pool.query("COMMIT");

  return reply.code(204).send();
};

const importProducts = async (req, reply) => {
  const url = "https://fakestoreapi.com/products";
  const response = await fetch(url);
  const products = await response.json();

  await pool.query("BEGIN");

  const values = [];
  let placeholders = [];

  for (let i = 0; i < products.length; i++) {
    placeholders.push(
      `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${
        i * 6 + 5
      }, $${i * 6 + 6})`
    );

    const p = products[i];
    values.push(p.id, p.title, p.price, p.category, p.description, p.image);
  }

  placeholders = placeholders.join(",");

  const query = `
    INSERT INTO products (id, title, price, category, description, image)
    VALUES ${placeholders}
    ON CONFLICT (id) DO NOTHING
    RETURNING *;
  `;

  const result = await pool.query(query, values);

  const insertedIds = result.rows.map((e) => e.id);

  const valuesInsertLogs = [];
  let placeholdersInsertLogs = [];

  for (let i = 0; i < insertedIds.length; i++) {
    placeholdersInsertLogs.push(
      `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
    );

    valuesInsertLogs.push(insertedIds[i], "Insert Product", 0);
  }

  placeholdersInsertLogs = placeholdersInsertLogs.join(",");

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
  ${placeholdersInsertLogs};`;
  await pool.query(queryInsertLog, valuesInsertLogs);

  await pool.query("COMMIT");

  return reply.send({ data: "import success" });
};

const adjustStock = async (req, reply) => {
  const adjustStockAmount = req.body.amount;
  const id = req.params.id;

  await pool.query("BEGIN");

  const queryFind = "SELECT id, stock FROM products WHERE id = $1 FOR UPDATE;";
  const product = await pool.query(queryFind, [id]);
  if (product.rowCount === 0) {
    await pool.query("ROLLBACK");
    return reply.code(404).send({ data: "product not found" });
  }

  const queryUpdate = `UPDATE products SET stock = stock + $1 WHERE id = $2;`;
  await pool.query(queryUpdate, [adjustStockAmount, id]);

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
  ($1, $2, $3);`;
  await pool.query(queryInsertLog, [id, "Update Stock", adjustStockAmount]);

  await pool.query("COMMIT");

  return reply.send({
    data: "adjust stock success",
  });
};

const getStockLogs = async (req, reply) => {
  const query =
    `SELECT sl.id as "logId", p.id as "productId", p.title as "productName", activity, changes, transaction_date as "transactionDate" 
      FROM stock_logs sl
      JOIN products p ON p.id = sl.product_id
      ORDER BY transaction_date DESC;`;
  const result = await pool.query(query);
  const stockLogs = result.rows;

  return reply.send({
    data: stockLogs,
  });
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
  handler: importProducts,
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
          data: { type: "string" },
        },
      },
    },
  },
  handler: adjustStock,
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
  handler: getStockLogs,
};

module.exports = {
  getProductsOpts,
  createProductOpts,
  updateProductOpts,
  deleteProductOpts,
  importProductsOpts,
  adjustStockOpts,
  getStockLogsOpts,
};
