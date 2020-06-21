const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const port = 8080
const { Pool,Client } = require('pg')

const dateExpression = new RegExp("\\d{4}-[0-1]\\d-[0-3]\\d")
const numExpression = new RegExp("\\d+.?\\d*")

const connectionString = 'postgressql://postgres:postgres@localhost:5432/DataTracker';

app.use(bodyParser.urlencoded({extended:true}))

// respond with "hello world" when a GET request is made to the homepage
app.get('/values', function (req, res) {
    let client = new Client({
        connectionString: connectionString
    })
    client.connect()
    client.query('SELECT * FROM public."Values"')
        .then((dbRes) => {
            res.send(dbRes.rows)
        })
        .catch(err => console.log(err))
        .finally(() => client.end())
})

app.post('/create', function (req, res) {
    if(dateExpression.test(req.body.date)&&numExpression.test(req.body.value)){
        let client = new Client({
            connectionString: connectionString
        })
        client.connect()
        let q = `INSERT INTO public."Values" ("Date", "Value") VALUES ('${req.body.date}', '${req.body.value}')`
        client.query(q)
            .then((dbRes) => {
                res.sendStatus(201);
            })
            .catch(err => console.log(err))
            .finally(() => client.end())
    }
    else{
        res.sendStatus(400);
    }

})

app.listen(port, () => console.log(`App Listening on port ${port}`))