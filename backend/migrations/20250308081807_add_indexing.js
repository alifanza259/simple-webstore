/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  return await knex.raw(`
  CREATE INDEX "stock_logs_product_id_index" ON stock_logs ("product_id");
  CREATE INDEX "products_category_index" ON products ("category");
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return await knex.raw(`
    DROP INDEX "stock_logs_product_id_index";
    DROP INDEX "products_category_index";
  `);
};
