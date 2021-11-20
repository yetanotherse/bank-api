const mongoose = require('mongoose');
const { Account, accountSchema } = require('./schema/account');
const { Customer } = require('./schema/customer');
const { Transaction } = require('./schema/transaction');

async function getAccountTransactionsById(req, res) {
    try {
        if (mongoose.isValidObjectId(req.params.id)) {
            const account = await Account.findById(req.params.id).populate(['customer', 'transactions']).exec();
            res.json({
                message: 'Successfully fetched account transactions',
                data: account.transactions
            });
        } else {
            res.status(400).json({
                message: 'Invalid customer!'
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function getAccountBalanceById(req, res) {
    try {
        if (mongoose.isValidObjectId(req.params.id)) {
            const account = await Account.findById(req.params.id, 'balance').populate(['customer']).exec();
            res.json({
                message: 'Successfully fetched account balance',
                data: account.balance
            });
        } else {
            res.status(400).json({
                message: 'Invalid customer!'
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function createAccount(req, res) {
    // validate request (valid positive number and valid customer id, invalid params)
    // TBD - validation can be improved to have specific error messages
    if (
        Object.keys(req.body).length !== 2 ||
        !req.body.hasOwnProperty('deposit') ||
        !req.body.hasOwnProperty('customer') ||
        isNaN(req.body.deposit) ||
        req.body.deposit < 0 ||
        !mongoose.isValidObjectId(req.body.customer)
    ) {
        res.status(400).json({
            error: 'Invalid request. Please check the requst params.'
        });
    } else {
        // ensure customer account exists
        const customerExists = await Customer.exists({ _id: req.body.customer });
        if (customerExists) {
            try {
                // get the session for transaction
                const session = await mongoose.startSession();
                let account = null;
                // initialte transaction
                await session.withTransaction(async () => {
                    // create account
                    account = await Account.create([{
                        balance: req.body.deposit,
                        customer: req.body.customer
                    }], { session: session });
                    // update customer record with this new account info
                    await Customer.findByIdAndUpdate(req.body.customer,
                        { $push: { accounts: account[0]._id } },
                        { session: session, new: true }
                    );
                    // create a transaction for this deposit
                    const tx = await Transaction.create([{
                        origin: account[0]._id,
                        destination: null, // this is not a transfer across accounts
                        amount: req.body.deposit,
                        reason: 'Initial deposit'
                    }], { session: session });
                    // link this transaction record with account
                    await Account.findByIdAndUpdate(account[0]._id,
                        { $push: { transactions: tx[0]._id } },
                        { session: session, new: true }
                    );
                });
                session.endSession();
                res.json({
                    message: 'Account created successfully',
                    data: account[0]
                });
            } catch(error) {
               res.status(422).json({
                   error
               });
           }
       } else {
           res.status(400).json({
               error: 'Customer does not exist.'
           })
       }
    }
}

async function transferFunds(req, res) {
    // data type validations (valid origin and dest accounts and valid transaction amount)
    // TBD - validation can be improved to have specific error messages
    if (
        Object.keys(req.body).length !== 3 ||
        !req.body.hasOwnProperty('origin') ||
        !req.body.hasOwnProperty('destination') ||
        !req.body.hasOwnProperty('amount') ||
        isNaN(req.body.amount) ||
        req.body.amount < 0 ||
        !mongoose.isValidObjectId(req.body.origin) ||
        !mongoose.isValidObjectId(req.body.destination)
    ) {
        res.status(400).json({
            message: 'Invalid request. Please check the request params.'
        });
    } else {
        try {
            // check both accounts exist
            const originExists = await Account.exists({ _id: req.body.origin });
            const destExists = await Account.exists({ _id: req.body.destination });
            if (originExists && destExists) {
                // ensure that the origin account has sufficient funds for transfer
                const origin = await Account.findById(req.body.origin, 'balance').exec();
                let originTx = null; // for sending in response
                if (origin.balance < req.body.amount) {
                    res.status(400).json({
                        error: 'Origin account does not have sufficient funds for the transfer'
                    });
                } else {
                    // we are all set for the transfer now so initiate the transaction
                    // get the session for transaction
                    const session = await mongoose.startSession();
                    // initialte transaction
                    await session.withTransaction(async () => {
                        // ORIGIN ACCOUNT
                        // deduct the amount from origin account
                        await Account.findByIdAndUpdate(req.body.origin,
                            { balance: origin.balance - req.body.amount },
                            { session: session }
                        );
                        // add transfer record to origin account transactions
                        originTx = await Transaction.create([{
                            origin: req.body.origin,
                            destination: req.body.destination,
                            amount: req.body.amount,
                            reason: 'Funds deducted due to transfer'
                        }], { session: session });
                        // link this transaction record with account
                        await Account.findByIdAndUpdate(req.body.origin,
                            { $push: { transactions: originTx[0]._id } },
                            { session: session, new: true }
                        );
                        // DESTINATION ACCOUNT
                        // add the amount to destination account
                        const desination = await Account.findById(req.body.destination, 'balance').exec();
                        await Account.findByIdAndUpdate(req.body.destination,
                            { balance: desination.balance + req.body.amount },
                            { session: session }
                        );
                        // add transfer record to destination account transactions
                        const destinationTx = await Transaction.create([{
                            origin: req.body.origin,
                            destination: req.body.destination,
                            amount: req.body.amount,
                            reason: 'Funds received via transfer'
                        }], { session: session });
                        // link this transaction record with account
                        await Account.findByIdAndUpdate(req.body.destination,
                            { $push: { transactions: destinationTx[0]._id } },
                            { session: session, new: true }
                        );
                    });
                    session.endSession();
                    res.json({
                        message: 'Funds transfer completed successfully',
                        data: originTx // sending the origin side transaction
                    });
                }
            } else {
                res.status(400).json({
                    error: 'Either one or both the accounts do not exist!'
                });
            }
        } catch(error) {
           res.status(422).json({
               error
           });
       }
   }
}

module.exports = {
    getAccountBalanceById,
    getAccountTransactionsById,
    createAccount,
    transferFunds
};
