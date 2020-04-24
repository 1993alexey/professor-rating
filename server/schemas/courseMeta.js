
import mongoose from 'mongoose'

const courseMetaSchema = new mongoose.Schema({
    forCredit: Boolean,
    attendance: Boolean,
    takeAgain: Boolean,
    grade: String,
    textbook: Boolean,
})

const CourseMeta = mongoose.model('courseMeta', courseMetaSchema)

export default CourseMeta 