const router = require('express').Router();

const { getCustomers, getCustomerById } = require('./db/customers');
const { createAccount, getAccountBalanceById, getAccountTransactionsById, transferFunds } = require('./db/accounts');
const { getTransactionsById } = require('./db/transactions');

/**
 * @apiVersion 0.1.0
 * @api {get} /customers Request all customers
 * @apiGroup Customer
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object[]} data  List of customers.
 * @apiError {String} error Error message
 */
router.get('/customers', (req, res) => {
    getCustomers(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {get} /customers/:id Request a single customer information by id
 * @apiGroup Customer
 *
 * @apiParam {String} id Customer unique id.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Customer data
 * @apiError {String} error Error message
 */
 router.get('/customers/:id', (req, res) => {
    getCustomerById(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {post} /accounts/:id Creates a new customer account
 * @apiGroup Account
 *
 * @apiParam {String} id Customer ID for the account
 * @apiParam {Number} deposit Initial balance to create the account with
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Created account object
 * @apiError {String} error Error message
 */
router.post('/accounts', (req, res) => {
    createAccount(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {get} /accounts/:id/balance Get account balance amount
 * @apiGroup Account
 *
 * @apiParam {String} id Account id for which balance need to be queried
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Account balance
 * @apiError {String} error Error message
 */
router.get('/accounts/:id/balance', (req, res) => {
    getAccountBalanceById(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {get} /accounts/:id/transactions Get account transactions
 * @apiGroup Account
 *
 * @apiParam {String} id Account id for which transactions need to be queried
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object[]} data  Account transactions
 * @apiError {String} error Error message
 */
router.get('/accounts/:id/transactions', (req, res) => {
    getAccountTransactionsById(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {post} /accounts/transfer Transfer funds from one account to another
 * @apiGroup Account
 *
 * @apiParam {String} origin Origin account id from which funds need to be transferred
 * @apiParam {String} destination Destination account id where funds need to be sent
 * @apiParam {Number} amount Amount of funds to be transferred
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Transaction object
 * @apiError {String} error Error message
 */
 router.post('/accounts/transfer', (req, res) => {
    transferFunds(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {get} /transactions/:id Get details of a transaction
 * @apiGroup Transaction
 *
 * @apiParam {String} id Unique transaction id
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Transaction object
 * @apiError {String} error Error message
 */
 router.get('/transactions/:id', (req, res) => {
    getTransactionsById(req, res);
});

module.exports = router;
