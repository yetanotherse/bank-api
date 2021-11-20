const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const { Transaction } = require('../db/schema/transaction');

// this is a dummy just for completeness sake since there is no use case for
// standalone transaction API. Transactions are fecthed/created via Accounts API
describe('Transaction related test cases', () => {
    beforeAll((done) => {
        mongoose.connect(process.env.MONGODB_TEST_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
    });

    afterAll((done) => {
        mongoose.connection.close(true, () => done());
    });

    // get single transaction by id
    test("GET /api/transactions/:id", async () => {
        await supertest(app).get("/api/transactions/6198a660e4edd27c583608b8")
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.data._id).toBe('6198a660e4edd27c583608b8');
            expect(response.body.message).toBe('Successfully fetched transaction data');
        });
    }, 10000);
});
