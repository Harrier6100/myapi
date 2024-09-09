const pgp = require('pg-promise')();
const types = pgp.pg.types;
types.setTypeParser(1700, (value) => parseFloat(value));
module.exports = pgp(process.env.POSTGRES);