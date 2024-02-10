import mongoose from 'mongoose'

function connect() {
    const connectionUrl = 'mongodb+srv://alexey:ZRXD2hxQDMudailv@professor-rating.tyvje4o.mongodb.net/?retryWrites=true&w=majority'
    mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('Connected to MongoDB'));
    mongoose.set('useFindAndModify', false);
}

export default connect