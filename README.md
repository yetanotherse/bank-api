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

## API Docs
API documentation can be found under `docs` directory. 

## Test Suite/Jest
Tests have beeb written for API endpoints testing using `Jest`. Tests are available under `src/tests` directory and can be run using `yarn test` or `npm run test`. They connect to a secondary test database which is also hosted on Atlas cloud.

## Data for Testing API
Since there is no use case for creation of new customers, tests have to be done using existing customers data. Database has 100 demo customers. For testing purpose, IDs of 10 customers are provided below (for creation of new accounts and other API tests as needed).

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
