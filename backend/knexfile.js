require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      database: 'postgres',
      user:     "postgres",
      password: "mysecretpassword",
      host: "localhost",
      port: 5436
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
