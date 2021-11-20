const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new mongoose.Schema({
    origin: { type: Schema.Types.ObjectId, ref: 'Account' },
    destination: { type: Schema.Types.ObjectId, ref: 'Account' },
    amount: Number,
    reason: String
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
    Transaction,
    transactionSchema
};
