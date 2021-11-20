const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let db = null;
let dbConnectionUri = process.env.MONGODB_URI;

async function connect() {
    try {
        await mongoose.connect(dbConnectionUri);
    } catch(error) {
        throw new Error(error);
    }
}

module.exports = {
    connect
};
