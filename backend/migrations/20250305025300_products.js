/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return await knex.raw(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
        description TEXT,
        category VARCHAR(255),
        image TEXT,
        stock INT DEFAULT 0 CHECK (stock >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return await knex.raw("DROP TABLE products;");
};
