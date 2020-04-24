import express from 'express'
const router = express.Router()

router.get('/professor/rating', (req, res) => {
    res.send('About birds')
})

export default router