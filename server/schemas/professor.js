
import mongoose from 'mongoose'
import ratingSchema from './rating'

const professorSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    quality: Number,
    difficulty: Number,
    university: String,
    department: String,
    ratings: [{ type: ratingSchema }]
});

const Professor = mongoose.model('Professor', professorSchema);

export { Professor }