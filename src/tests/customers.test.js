const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const { Account, accountSchema } = require('../db/schema/account');
const { Customer } = require('../db/schema/customer');

describe('Customer related test cases', () => {
    beforeAll((done) => {
        mongoose.connect(process.env.MONGODB_TEST_URI,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
    });

    afterAll((done) => {
        mongoose.connection.close(true, () => done());
    });

    // get all customers - we have 100 customers in test db
    test("GET /api/customers", async () => {
        await supertest(app).get("/api/customers")
        .expect(200)
        .then((response) => {
            // validate response
            expect(Array.isArray(response.body.data)).toBeTruthy();
            expect(response.body.data.length).toEqual(100);
            expect(response.body.message).toBe('Successfully fetched all customers');
        });
    }, 10000);

    // get single customer data by id
    // since this app does not require customer creation capabilty, we'll use an existing customer id
    test("GET /api/customers/:id", async () => {
        await supertest(app).get("/api/customers/61989f462e467b6aca60044c")
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.data._id).toBe('61989f462e467b6aca60044c');
            expect(response.body.message).toBe('Successfully fetched customer data');
        });
    }, 10000);
});
