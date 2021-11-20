const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new mongoose.Schema({
    name: String,
    address: String,
    city: String,
    state: String,
    country: String,
    accounts: [{ type: Schema.Types.ObjectId, ref: 'Account' }]
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = {
    Customer,
    customerSchema
};
