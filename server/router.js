import express from 'express'
import { getProfessors, createProfessor, getProfessor } from './services/professorService'
const router = express.Router()

router.get('/professor', (req, res) => {
    if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
        res.send('What professor are you looking for?')
        return
    }

    getProfessor(req.body).then(data => {
        if (!data)
            data = {}

        res.json(data)
    })
})

router.get('/professors', (req, res) => {
    getProfessors(req.body).then(data => {
        res.json(data)
    })
})

export default router