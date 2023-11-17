const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "root",
    database: "friendry",
    port: '3306'
})

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL database =', err)
        return;
    }
    else {
        console.log('MySQL successfully connected');
    }
})

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})