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

  const { rows: countResult } = await pool.query(countQuery, values);
  const totalItems = parseInt(countResult[0].count);

  let totalPages;
  if (perPage) {
    if (lastProductId) {
      selectQuery += ` AND id < $${index} ORDER BY id DESC LIMIT $${index + 1}`;
      values.push(lastProductId, perPage);
    } else {
      const offset = (page - 1) * perPage;
      totalPages = Math.ceil(totalItems / perPage);

      selectQuery += ` ORDER BY id DESC LIMIT $${index} OFFSET $${index + 1}`;
      values.push(perPage, offset);
    }
  } else {
    selectQuery += ` ORDER BY id DESC`;
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

module.exports = { getProducts };
