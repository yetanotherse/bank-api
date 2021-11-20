const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

const routes = require("./routes");

const app = express();

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', routes);

app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

module.exports = app;
