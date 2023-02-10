import express from 'express';
import mongoDB from './db/mongo.js';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { Record } from './dto/Record.js';
import mysql from './db/mysql.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoDB.connectToServer(function (err) {
    if (err) {
        console.log(err);
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.post('/queue/calc', (req, res) => {
    const { postBody } = req.body;
    mongoDB.getDb().collection('calc').insertOne(postBody);
})

app.post('/queue/record', (req, res) => {
    const { queryStr, param } = req.body;
    mongoDB.getDb().collection('record').insertOne({ queryStr, param });
})

let lock = false;
setInterval(async () => {
    if (lock) return
    lock = true;
    const calcCursor = await mongoDB.getDb().collection('calc').findOne({});
    if (calcCursor)
        calcCursor.forEach(async (doc) => {
            try {
                const res = await fetch('http://localhost:8200', {
                    method: 'POST',
                    body: JSON.stringify(doc.postBody),
                    headers: { 'Content-Type': 'application/json' }
                });
                const recordObj = await res.json();
                const recordDTO = new Record(recordObj);
                const queryStr = "INSERT INTO record SET ?";
                const param = recordDTO.toSql();
                mongoDB.getDb().collection('record').insertOne({ queryStr, param });
                mongoDB.getDb().collection('record').insertOne({ queryStr, param });
            } catch (error) {
                console.log(error);
            }
        });

    const recordCursor = await mongoDB.getDb().collection('record').findOne({});
    if (recordCursor)
        recordCursor.forEach(async (doc) => {
            try {
                await mysql.poolQuery(doc.queryStr, doc.param);
                mongoDB.getDb().collection('record').deleteOne({ _id: doc._id });
            } catch (error) {
                console.log(error);
            }
        })
    lock = false;

}, 3000);

const port = 7777;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})