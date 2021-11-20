# Simple Bank API

## Database
This project uses MongoDB and the database is hosted on a cluster on Atlas cloud. There are 3 primary entities/collections as mentioned below.

* Customers
* Accounts
* Transactions

Customer can have more than 1 account and each account has a balance and references to the customer record. All transactions (initial deposits, transfers) are stored in transaction collection with a reference to account.

Below are sample datasets for `customer`, `account` and `transaction` collections. Note that customer data has been generated using `faker` hence city/country/state may be inconsistent.

**Customer**
```
{
    "_id": { "$oid":"61978b9d60d7e4060f60044c" },
    "name":"Mellie Dickinson",
    "country":"Myanmar",
    "state":"Illinois",
    "city":"Port Lesch",
    "address":"2301 South Ways mouth"
}
```

**Account**
```
{
    "_id": { "$oid":"6198a4fd801054bf6a9e9c87" },
    "balance": { "$numberInt":"650" },
    "customer": {"$oid":"61978b9d60d7e4060f60044c"},
    "transactions": [
        {"$oid": "6198a500801054bf6a9e9c8a"},
        {"$oid": "6198d8b20dd770f8c0a1e3b1"}
    ],
    "createdAt": {"$date":{"$numberLong":"1637393661296"}},
    "updatedAt": {"$date":{"$numberLong":"1637406899203"}},
    "__v": {"$numberInt":"0"}
}
```

**Transaction**
```
{
    "_id": {"$oid":"6198a500801054bf6a9e9c8a"},
    "origin": {"$oid":"6198a4fd801054bf6a9e9c87"},
    "destination": null,
    "amount": {"$numberInt":"500"},
    "reason": "Initial deposit",
    "createdAt": {"$date":{"$numberLong":"1637393664697"}},
    "updatedAt": {"$date":{"$numberLong":"1637393664697"}},
    "__v": {"$numberInt":"0"}
}
```

## API
API is built using Node and Express and deployed on Heroku cloud. Link for the API is [Base API Endpoint](https://revbank-api.herokuapp.com/api/)

API documentation can be found in the section below. Here is a list of endpoints for quick reference.

```
https://revbank-api.herokuapp.com/api/customers/ [GET]
https://revbank-api.herokuapp.com/api/customers/:id [GET]
https://revbank-api.herokuapp.com/api/accounts/:id/balance [GET]
https://revbank-api.herokuapp.com/api/accounts/:id/transactions [GET]
https://revbank-api.herokuapp.com/api/accounts [POST]
https://revbank-api.herokuapp.com/api/accounts/transfer [POST]
https://revbank-api.herokuapp.com/api/transactions/:id [GET]
```

## API Docs
API documentation can be found under `docs` directory. Also available at [https://yetanotherse.github.io/bank-api/](https://yetanotherse.github.io/bank-api/).

*Note* If you do not see any API docs then select the version as `0.1.0` from the top right of page.

## Test Suite/Jest
Tests have beeb written for API endpoints testing using `Jest`. Tests are available under `src/tests` directory and can be run using `yarn test` or `npm run test`. They connect to a secondary test database which is also hosted on Atlas cloud.

## Data for Testing API
Some existing records are mentioned below for quick testing. Further, since there is no use case for creation of new customers, tests have to be done using existing customers data. Database has 100 demo customers. For testing purpose, IDs of 10 customers are provided below (for creation of new accounts and other API tests as needed).

**Customers**
```
61989f22241b9ce0ae60044d
61989f22241b9ce0ae60044e
61989f22241b9ce0ae60044f
61989f22241b9ce0ae600450
61989f22241b9ce0ae600451
61989f22241b9ce0ae600452
61989f22241b9ce0ae600453
61989f22241b9ce0ae600454
61989f22241b9ce0ae600455
61989f22241b9ce0ae600456
```

**Account**
```
6198a4fd801054bf6a9e9c87
6198d85c0dd770f8c0a1e39f
```

**Transactions**
```
6198a500801054bf6a9e9c8a
6198d85d0dd770f8c0a1e3a2
6198d8b10dd770f8c0a1e3ac
6198d8b20dd770f8c0a1e3b1
```
