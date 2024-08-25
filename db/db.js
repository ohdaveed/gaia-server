const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to MongoAtlas`);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose error: ', err);
});
