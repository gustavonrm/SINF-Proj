import express from 'express'
import { urlencoded, json } from 'body-parser'
import cors from 'cors'

import { on } from './db'

import example from './routes/example'

const app = express()
const apiPort = 3000

app.use(urlencoded({ extended: true }))
app.use(cors())
app.use(json())

on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use('/api/example', example);