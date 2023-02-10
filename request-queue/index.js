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
    mongoDB.getDb().collection('calc').insertOne({ postBody });
})

app.post('/queue/record', (req, res) => {
    const { queryStr, params } = req.body;
    mongoDB.getDb().collection('record').insertOne({ queryStr, params });
})

let lockCalc = 0;
setInterval(async () => {
    if (lockCalc) return
    const calcCursor = await mongoDB.getDb().collection('calc').find({});
    if (calcCursor)
        calcCursor.forEach(async (doc) => {
            lockCalc += 1;
            fetchRecord(doc._id, doc.postBody);
        });
}, 3000);

let lockRecord = 0;
setInterval(async () => {
    if (lockRecord) return

    const recordCursor = await mongoDB.getDb().collection('record').find({});
    if (recordCursor)
        recordCursor.forEach(async (doc) => {
            lockRecord += 1;
            saveRecord(doc._id, doc.queryStr, doc.params);
        })

}, 7000);

const port = 7777;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const fetchRecord = async (_id, postBody) => {
    try {
        // console.log(postBody)
        const res = await fetch('http://localhost:8200', {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' }
        });
        const recordObj = await res.json();
        const recordDTO = new Record(recordObj);
        const queryStr = "INSERT INTO record SET ?";
        const param = recordDTO.toSql();
        mongoDB.getDb().collection('record').insertOne({ queryStr, params: [param] });
        mongoDB.getDb().collection('calc').deleteOne({ _id: _id });
    } catch (error) {
        // console.log(error);
        // console.log("error")
    } finally {
        lockCalc -= 1;
    }
}

const saveRecord = async (_id, queryStr, params) => {
    try {
        await mysql.poolQuery(queryStr, params);
        mongoDB.getDb().collection('record').deleteOne({ _id: _id });
    } catch (error) {
        if (error.sqlState === '23000') {
            mongoDB.getDb().collection('record').deleteOne({ _id: _id });
        }
        // console.log(error);
        // console.log("error")
    } finally {
        lockRecord -= 1;
    }
}