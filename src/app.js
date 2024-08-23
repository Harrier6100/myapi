require('module-alias/register');
require('dotenv').config();
const express = require('express');
const app = express();
const compression = require('compression');
const cors = require('cors');
const mongoose = require('mongoose');
const cacheControl = require('@/middlewares/cacheControl');
const accessLogger = require('@/middlewares/accessLogger');
const errorHandler = require('@/middlewares/errorHandler');
const errorLogger = require('@/middlewares/errorLogger');

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

app.use('/api', accessLogger);
app.use('/api', require('./routes'));
app.use('/api', cacheControl);
app.use('/api', errorHandler);
app.use('/api', errorLogger);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});