require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const HOST = process.env.DB_HOST;
const PASSWORD = process.env.DB_PASS;
const USER = process.env.DB_USER;
const NAME = process.env.DB_NAME;

const DB_CONNECTION_STRING = `DATABASE_URL=mysql://${USER}:${PASSWORD}@${HOST}/${NAME}?ssl={"rejectUnauthorized":true}`

const mysql = require('mysql2')
const connection = mysql.createConnection(DB_CONNECTION_STRING);

connection.connect()

app.get('/', (req, res) => {
  connection.query('SELECT * FROM users', function (err, rows, fields) {
    if (err) throw err

    res.send(rows)
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
