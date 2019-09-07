// db.js

const Pool = require('pg').Pool
const pool = new Pool({
  user: '',
  host: '',
  database: 'athena',
  password: 'NGDSdbpassword',
  port: 5432,
})

module.exports = {
  pool,
}
