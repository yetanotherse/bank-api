const mongoose = require('mongoose');
const { Transaction, transactionSchema } = require('./schema/transaction');

async function getTransactionsById(req, res) {
    try {
        if (req.params.id && mongoose.isValidObjectId(req.params.id)) {
            const transaction = await Transaction.findById(req.params.id).populate(['origin', 'destination']).exec();
            res.json({
                message: 'Successfully fetched transaction data',
                data: transaction
            });
        } else {
            res.status(400).json({
                error: 'Invalid transaction ID'
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

module.exports = {
    getTransactionsById
};
