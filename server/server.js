import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import router from './router'
import dbConnector from './dbConnector'

dbConnector()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use('/', router)

app.listen(PORT, () => console.log(`RateMyProfessor server is listening on port: ${PORT}`))