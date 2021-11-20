const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new mongoose.Schema({
    balance: Number,
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
}, {
    timestamps: true
});

const Account = mongoose.model('Account', accountSchema);

module.exports = {
    Account,
    accountSchema
};
