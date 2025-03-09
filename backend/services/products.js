const { pool } = require("../database");

const getProducts = async ({
  page,
  perPage,
  title,
  category,
  lastProductId,
}) => {
  let countQuery = "SELECT COUNT(1) FROM products WHERE 1=1";
  let selectQuery =
    "SELECT id, title, price, description, category, image, stock FROM products WHERE 1=1";

  // for parameterized query
  const values = [];
  let index = 1;

  if (title) {
    const titleFilter = ` AND title ILIKE $${index}`;
    countQuery += titleFilter;
    selectQuery += titleFilter;

    values.push(`%${title}%`);
    index++;
  }

  if (category) {
    const categoryFilter = ` AND category ILIKE $${index}`;
    countQuery += categoryFilter;
    selectQuery += categoryFilter;

    values.push(`%${category}%`);
    index++;
  }

  countQuery += ` AND deleted_at IS NULL`
  const { rows: countResult } = await pool.query(countQuery, values);
  const totalItems = parseInt(countResult[0].count);

  let totalPages;
  if (perPage) {
    if (lastProductId) {
      selectQuery += ` AND id < $${index} AND deleted_at IS NULL ORDER BY id DESC LIMIT $${index + 1}`;
      values.push(lastProductId, perPage);
    } else {
      const offset = (page - 1) * perPage;
      totalPages = Math.ceil(totalItems / perPage);

      selectQuery += ` AND deleted_at IS NULL ORDER BY id DESC LIMIT $${index} OFFSET $${index + 1}`;
      values.push(perPage, offset);
    }
  } else {
    selectQuery += ` AND deleted_at IS NULL ORDER BY id DESC`;
  }

  const { rows: products } = await pool.query(selectQuery, values);

  return {
    products,
    meta: {
      page: parseInt(page),
      perPage: parseInt(perPage),
      totalPages,
      totalItems,
    },
  };
};

const getProductDetail = async (id) => {
  let query =
    "SELECT id, title, price, description, category, image, stock FROM products WHERE id=$1 AND deleted_at IS NULL";

  const { rows } = await pool.query(query, [id]);
  const product = rows[0];

  if (!product) throw new Error("Product not found");

  return product;
};

const createProduct = async ({
  title,
  price,
  description,
  category,
  image,
  stock,
}) => {
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

  return newProduct;
};

const updateProduct = async (
  id,
  { title, price, description, category, image }
) => {
  const queryFind = `SELECT 1 FROM products WHERE id = $1`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) throw new Error("Product not found");

  const queryUpdate = `UPDATE products 
    SET title = $1,
     price = $2, 
     description = $3, 
     category = $4, 
     image = $5
     WHERE id = $6 AND deleted_at IS NULL`;
  const values = [title, price, description, category, image, id];

  await pool.query(queryUpdate, values);
};

const deleteProduct = async (id) => {
  const queryFind = `SELECT id, stock FROM products WHERE id = $1 AND deleted_at IS NULL`;

  const product = (await pool.query(queryFind, [id])).rows[0];
  if (!product) throw new Error("Product not found");

  await pool.query("BEGIN");

  const queryDelete = `UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`;

  await pool.query(queryDelete, [id]);

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
  ($1, $2, $3);`;
  await pool.query(queryInsertLog, [id, "Remove Product", -product.stock]);

  await pool.query("COMMIT");
};

const importProducts = async () => {
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
  if (insertedIds.length === 0) return;

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
  ${placeholdersInsertLogs}`;
  await pool.query(queryInsertLog, valuesInsertLogs);

  await pool.query("COMMIT");
};

const adjustStock = async (adjustStockAmount, id) => {
  await pool.query("BEGIN");

  const queryFind = "SELECT id, stock FROM products WHERE id = $1 AND deleted_at IS NULL FOR UPDATE;";
  const product = await pool.query(queryFind, [id]);
  if (product.rowCount === 0) {
    await pool.query("ROLLBACK");
    throw new Error("Product not found");
  }

  if (product.rows[0].stock + adjustStockAmount < 0)
    throw new Error("Product out of stock");

  const queryUpdate = `UPDATE products SET stock = stock + $1 WHERE id = $2;`;
  await pool.query(queryUpdate, [adjustStockAmount, id]);

  const queryInsertLog = `INSERT INTO stock_logs (product_id, activity, changes) VALUES
  ($1, $2, $3);`;
  await pool.query(queryInsertLog, [id, "Update Stock", adjustStockAmount]);

  await pool.query("COMMIT");
};

const getStockLogs = async () => {
  const query = `SELECT sl.id as "logId", p.id as "productId", p.title as "productName", activity, changes, transaction_date as "transactionDate" 
  FROM stock_logs sl
  JOIN products p ON p.id = sl.product_id
  ORDER BY transaction_date DESC;`;

  const { rows: stockLogs } = await pool.query(query);

  return stockLogs;
};

module.exports = {
  getProducts,
  getProductDetail,
  createProduct,
  updateProduct,
  deleteProduct,
  importProducts,
  adjustStock,
  getStockLogs,
};
