import express from 'express';
import mongoDB from './db/mongo.js';
import bodyParser from 'body-parser';
import fetch, { AbortError } from 'node-fetch';
import { Record } from './dto/Record.js';
import mysql from './db/mysql.js';

// AbortController was added in node v14.17.0 globally
const AbortController = globalThis.AbortController || await import('abort-controller')
const controller = new AbortController();
const timeout = setTimeout(() => {
    controller.abort();
}, 1000);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoDB.connectToServer(function (err) {
    if (err) {
        console.log(err);
    }
});

let lockCalc = 0;
app.use((req, res, next) => {
    lockCalc += 1;
    res.on('finish', () => {
        // console.log("finish: " + lockCalc);
        setTimeout(() => {
            lockCalc -= 1;
        }, 100);
    });
    next();
});

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/clear-mongo', (req, res) => {
    mongoDB.getDb().collection('calc').deleteMany({});
    mongoDB.getDb().collection('record').deleteMany({});
})

app.post('/queue/calc', (req, res) => {
    const { postBody } = req.body;
    mongoDB.getDb().collection('calc').insertOne({ postBody });
    res.status(200).send();
})

app.post('/queue/record', (req, res) => {
    console.log('/queue/record: ', req.body)
    const { queryStr, params } = req.body;
    mongoDB.getDb().collection('record').insertOne({ queryStr, params });
    res.status(200).send();
})

setInterval(async () => {
    console.log("calc: " + lockCalc);
    if (lockCalc) return
    const calcCursor = await mongoDB.getDb().collection('calc').find({}).limit(1000);
    if (calcCursor)
        calcCursor.forEach((doc) => {
            lockCalc += 1;
            fetchRecord(doc._id, doc.postBody);
        });
}, 1000);

let lockRecord = 0;
setInterval(async () => {
    if (lockRecord) return

    const recordCursor = await mongoDB.getDb().collection('record').find({});
    if (recordCursor)
        recordCursor.forEach((doc) => {
            lockRecord += 1;
            saveRecord(doc._id, doc.queryStr, doc.params);
        })

}, 3000);

const port = 7777;
const s = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const fetchRecord = async (_id, postBody) => {
    // console.log("fetching: " + _id + " " + postBody);
    try {
        // console.log(postBody)
        const INVENTORY_HOST = process.env.INVENTORY_HOST || 'localhost';
        const res = await fetch(`http://${INVENTORY_HOST}:8200`, {
            method: 'POST',
            body: JSON.stringify(postBody),
            headers: { 'Content-Type': 'application/json' },
            // signal: controller.signal
        });
        const recordObj = await res.json();
        const recordDTO = new Record(recordObj);
        const queryStr = "INSERT INTO record SET ?";
        const param = recordDTO.toSql();
        console.log({ queryStr, params: [param] })
        mongoDB.getDb().collection('record').insertOne({ queryStr, params: [param] });
        mongoDB.getDb().collection('calc').deleteOne({ _id: _id });
    } catch (error) {
        // console.log(error);
        if (error instanceof AbortError) {
            console.log('request was aborted');
        }
        console.log("fetch error: ", error.message)
    } finally {
        lockCalc -= 1;
        clearTimeout(timeout);
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
        console.log("save error: ", error.message)
    } finally {
        lockRecord -= 1;
    }
}