import mongoose from 'mongoose'

function connect() {
    const connectionUrl = 'mongodb://alex:79PC5214@ds163705.mlab.com:63705/heroku_brnwrl2h'
    mongoose.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', () => console.log('Connected to MongoDB'));
    mongoose.set('useFindAndModify', false);
}

export default connect