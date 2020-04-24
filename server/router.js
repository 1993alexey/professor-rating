import express from 'express'
const router = express.Router()

router.get('/professor/rating', (req, res) => {
    console.log("da")
    res.send('About birds')
})

export default router