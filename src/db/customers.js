const mongoose = require('mongoose');
const { Customer, customerSchema } = require('./schema/customer');

async function getCustomers(req, res) {
    try {
        const customers = await Customer.find({}).sort({ "name": 1 }).exec();
        res.json({
            message: 'Successfully fetched all customers',
            data: customers
        });
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function getCustomerById(req, res) {
    try {
        if (mongoose.isValidObjectId(req.params.id)) {
            const customer = await Customer.findById(req.params.id).populate('accounts').exec();
            res.json({
                message: 'Successfully fetched customer data',
                data: customer
            });
        } else {
            res.status(400).json({
                error: 'Invalid customer ID'
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

module.exports = {
    getCustomers,
    getCustomerById
};
