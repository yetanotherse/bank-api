const app = require('./server');
const { connect } = require('./db/mongo');

// connect to database
connect();

// start listening
app.listen(process.env.PORT || 3001, async () => {
    console.log('Server listening on port 3001');
});
