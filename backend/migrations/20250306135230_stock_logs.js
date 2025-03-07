/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  return await knex.raw(`
    CREATE TABLE stock_logs (
      id SERIAL PRIMARY KEY,
      product_id int NOT NULL,
      activity varchar(255),
      changes int NOT NULL,
      transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return await knex.raw(`
    DROP TABLE stock_logs CASCADE;
  `);
};
