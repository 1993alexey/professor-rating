
import mongoose from 'mongoose'

const ratingSchema = new mongoose.Schema({
    quality: String,
    difficulty: String,
    class: String,
    forCredit: Boolean,
    attendance: Boolean,
    takeAgain: Boolean,
    grade: String,
    textbook: Boolean,
    tags: [{ type: String }],
    createdAt: Date
})

const Rating = mongoose.model('Rating', ratingSchema)

export { Rating }