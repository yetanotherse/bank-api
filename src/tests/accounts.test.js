const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const { Account, accountSchema } = require('../db/schema/account');
const { Customer } = require('../db/schema/customer');
const { Transaction } = require('../db/schema/transaction');

describe('Account related test cases', () => {
    beforeAll((done) => {
        mongoose.connect(process.env.MONGODB_TEST_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
    });

    afterAll((done) => {
        mongoose.connection.close(true, () => done());
    });

    // test successful creation of a new account
    test("POST /api/accounts", async () => {
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: 500
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Account created successfully');
            // validate data
            expect(response.body.data.customer).toBe('61989f462e467b6aca60044c');
            expect(response.body.data.balance).toBe(500);
        });
    }, 10000);

    // test successful fetch of account balance
    test("GET /api/accounts/:id/balance", async () => {
        // first create a new account
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: 500
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Account created successfully');
            // now make another call to fetch the account balance using this account _id
            await supertest(app).get(`/api/accounts/${response.body.data._id}/balance`)
            .expect(200)
            .then((response) => {
                // validate response
                expect(response.body.data).toBeTruthy();
                expect(response.body.message).toBe('Successfully fetched account balance');
                // validate data
                expect(response.body.data).toBe(500);
            });
        });
    }, 10000);

    // test successful fetch of account transactions
    test("GET /api/accounts/:id/transactions", async () => {
        // first create a new account
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: 500
        })
        .expect(200)
        .then(async (accountResponse) => {
            let account = accountResponse.body.data._id;
            // validate response
            expect(accountResponse.body.data).toBeTruthy();
            expect(accountResponse.body.message).toBe('Account created successfully');
            // we already have one transaction for this account (deposit)
            await supertest(app).get(`/api/accounts/${account}/transactions`)
            .expect(200)
            .then((txResponse) => {
                // validate response
                expect(Array.isArray(txResponse.body.data)).toBeTruthy();
                expect(txResponse.body.data.length).toEqual(1); // expecting 1 log
                expect(txResponse.body.data[0].amount).toEqual(500); // deposit amount
                expect(txResponse.body.message).toBe('Successfully fetched account transactions');
            });
        });
    }, 10000);

    // test successful transfer of funds across accounts
    test("GET /api/accounts/transfer", async () => {
        // first create a new account
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: 500
        })
        .expect(200)
        .then(async (accountResponse) => {
            let originAccount = accountResponse.body.data._id;
            // validate response
            expect(accountResponse.body.data).toBeTruthy();
            expect(accountResponse.body.message).toBe('Account created successfully');
            // we already have one transaction for this account (deposit)
            await supertest(app).post("/api/accounts/transfer")
            .send({
                origin: originAccount,
                destination: '6198a3555bea08102fca70c7', // using an existing account for destination
                amount: 100
            })
            .expect(200)
            .then(async (transferResponse) => {
                // validate response
                expect(transferResponse.body.data).toBeTruthy();
                expect(transferResponse.body.message).toBe('Funds transfer completed successfully');
                // transfer was successfull, we will now validate the account balance of
                // the account we created with initial deposit of 500. It should have only 400 now
                await supertest(app).get(`/api/accounts/${originAccount}/balance`)
                .expect(200)
                .then((response) => {
                    // validate response
                    expect(response.body.data).toBeTruthy();
                    expect(response.body.message).toBe('Successfully fetched account balance');
                    // validate data
                    expect(response.body.data).toBe(400);
                });
            });
        });
    }, 10000);

    // negative test case for transfer of funds where source account does not have sufficient funds
    test("GET /api/accounts/transfer", async () => {
        // first create a new account
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: 500
        })
        .expect(200)
        .then(async (accountResponse) => {
            let originAccount = accountResponse.body.data._id;
            // validate response
            expect(accountResponse.body.data).toBeTruthy();
            expect(accountResponse.body.message).toBe('Account created successfully');
            // we already have one transaction for this account (deposit)
            await supertest(app).post("/api/accounts/transfer")
            .send({
                origin: originAccount,
                destination: '6198a3555bea08102fca70c7', // using an existing account for destination
                amount: 600 // trying to transfer more than available (500)
            })
            .expect(400)
            .then(async (transferResponse) => {
                // validate response
                expect(transferResponse.body.error).toBeTruthy();
                expect(transferResponse.body.error).toBe('Origin account does not have sufficient funds for the transfer');
            });
        });
    }, 10000);

    // nagative test case for creation of account for non-existent customer
    test("POST /api/accounts", async () => {
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f22241b9ce0ae60045f", // non-existent customer
            deposit: 500
        })
        .expect(400)
        .then((response) => {
            // validate response
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('Customer does not exist.');
        });
    }, 10000);

    // nagative test case for creation of account with negative deposit amount
    test("POST /api/accounts", async () => {
        await supertest(app).post("/api/accounts")
        .send({
        	customer: "61989f462e467b6aca60044c",
            deposit: -500 // negative deposit
        })
        .expect(400)
        .then((response) => {
            // validate response
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('Invalid request. Please check the requst params.');
        });
    }, 10000);

    // nagative test case for creation of account with invalid request params
    test("POST /api/accounts", async () => {
        await supertest(app).post("/api/accounts")
        .send({
        	random: "61989f462e467b6aca60044c", // invalid param name
            amount: -500, // invalid param name
            something: 'total params should only be 3 (this is extra)'
        })
        .expect(400)
        .then((response) => {
            // validate response
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('Invalid request. Please check the requst params.');
        });
    }, 10000);
});
