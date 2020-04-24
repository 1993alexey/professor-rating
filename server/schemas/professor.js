
import mongoose from 'mongoose'
import ratingSchema from './rating'

const professorSchema = new mongoose.Schema({
    rmpId: Number,
    firstName: String,
    lastName: String,
    quality: Number,
    difficulty: Number,
    university: String,
    department: String,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
})

const Professor = mongoose.model('Professor', professorSchema)

export default Professor