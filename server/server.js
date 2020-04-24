import express from 'express'
import router from './router'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use('/', router)

app.listen(PORT, () => console.log(`RateMyProfessor server is listening on port: ${PORT}`))