module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "abcd1234",
  DB: "da_cnpm",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
