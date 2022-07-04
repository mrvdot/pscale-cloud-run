require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const HOST = process.env.DB_HOST;
const PASSWORD = process.env.DB_PASS;
const USER = process.env.DB_USER;
const NAME = process.env.DB_NAME;

const DB_CONNECTION_STRING = `mysql://${USER}:${PASSWORD}@${HOST}/${NAME}?ssl={"rejectUnauthorized":true}`

const mysql = require('mysql2')
const connection = mysql.createConnection(DB_CONNECTION_STRING);

connection.connect()

const ALLOWED_TABLES = process.env.ALLOWED_TABLES.split('|');

if (!ALLOWED_TABLES?.length) {
  console.warn(
    `[WARNING][SECURITY RISK]
    You have not configured ALLOWED_TABLES, which means all tables
    are fully readable through this service. It is highly recommended
    that you limit access before publishing to production!!`
  );
}

app.get('/:table', (req, res) => {
  const filters = (req.query?.filters || '').split('|');
  const params = (req.query?.params || '').split('|');
  if (filters.length !== params.length) {
    res
      .statusCode(400)
      .json({
        code: 400,
        error: 'Invalid Query',
        message: `Query must have same number of filters and params`
      })
    return
  }

  let query = `SELECT * FROM ${table}`;
  if (filters.length) {
    query += ` WHERE ${filters.join(' AND ')}`
  }
  connection.execute(query, params, function (err, rows, fields) {
    if (err) throw err

    res.json(rows)
  })
})

app.post('/:table', (req, res) => {
  const filters = (req.body?.filters || '').split('|');
  const params = (req.body?.params || '').split('|');
  if (filters.length !== params.length) {
    res
      .statusCode(400)
      .json({
        code: 400,
        error: 'Invalid Query',
        message: `Query must have same number of filters and params`
      })
    return
  }

  let query = `SELECT * FROM ${table}`;
  if (filters.length) {
    query += ` WHERE ${filters.join(' AND ')}`
  }
  connection.execute(query, params, function (err, rows, fields) {
    if (err) throw err

    res.json(rows)
  })
})

app.listen(port, () => {
  console.log(`PSCALE Read Access listening at http://localhost:${port}`)
})
