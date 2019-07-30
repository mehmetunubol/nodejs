const express = require('express');
const app = express();
const env = require('dotenv');
const path = require('path');
global.appRoot = path.resolve(__dirname);
const logger = require(appRoot  + '/logger');


env.config();

// logger.debug('Debugging info');
// logger.error('Error info');

// Import routes
const authRoute = require(appRoot + '/routes/auth.js');
const webRoute = require(appRoot + '/routes/blog.js');


// Middlewares
app.use(express.json());

// Route Middlewares
app.use('/user', authRoute);
app.use('/', webRoute);


app.listen(process.env.APP_PORT, () => logger.info('Server is running on ' + process.env.APP_PORT));
