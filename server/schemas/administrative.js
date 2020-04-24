
import mongoose from 'mongoose'

const administrativeSchema = new mongoose.Schema({
    urls: [String],
    dateFetched: Date
})

const Administrative = mongoose.model('administrative', administrativeSchema)

export default Administrative 