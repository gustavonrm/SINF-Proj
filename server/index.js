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

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', accountsRouter)
app.use('/api', exampleRouter)
app.use('/api', financialRouter)
app.use('/api', inventoryRouter)
app.use('/api', overviewRouter)
app.use('/api', purchasesRouter)
app.use('/api', salesRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))