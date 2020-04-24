
import mongoose from 'mongoose'
import courseMeta from './courseMeta'

const ratingSchema = new mongoose.Schema({
    quality: String,
    difficulty: String,
    class: String,
    message: String,
    courseMeta: courseMeta.schema,
    tags: [{ type: String }],
    createdAt: String
})

const Rating = mongoose.model('Rating', ratingSchema)

export default Rating 