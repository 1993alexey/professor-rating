import mongoose from 'mongoose'
import rating from './rating'

const professorSchema = new mongoose.Schema({
    url: String,
    firstName: String,
    lastName: String,
    quality: Number,
    difficulty: Number,
    university: String,
    department: String,
    takeAgain: String,
    ratings: [rating.schema]
})

const Professor = mongoose.model('Professor', professorSchema)

export default Professor