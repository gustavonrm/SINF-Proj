const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')

const accountsRouter = require('./routes/accounts-router')
const exampleRouter = require('./routes/example-router')
const financialRouter = require('./routes/financial-router')
const inventoryRouter = require('./routes/inventory-router')
const overviewRouter = require('./routes/overview-router')
const purchasesRouter = require('./routes/purchases-router')
const salesRouter = require('./routes/sales-router')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use((req, res) => {
    res.send('Hello World!')
    const err = new Error("Not Found");
    err.status = 404;
    res.status(404).json({
        message: err.message,
        error: err
    });
});

app.use('/api/overview', overviewRouter);
app.use('/api/sales', salesRouter);
app.use('/api/purchases', purchasesRouter);
app.use('/api/financial', financialRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/accounts', accountsRouter);


app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))

//module.exports = app;