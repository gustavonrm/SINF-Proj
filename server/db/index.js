import { connect, connection } from 'mongoose'

connect('mongodb://127.0.0.1:27017/sinf', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = connection

export default db