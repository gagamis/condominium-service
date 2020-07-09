const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        keepAlive: true,
        keepAliveInitialDelay: 300000,
    });

    console.log(` [x] MongoDB Connected: ${conn.connection.host}`)
}

module.exports = connectDB;