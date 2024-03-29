const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

const middlewares = require('./middlewares'); //import the error handling middlewares.

const logs = require('./api/logs'); //import the API handling file assign to logs.

const app = express();
app.use(cors());
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('connected to MongoDB');
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message);
	});

app.use(morgan('common'));
app.use(helmet()); //helps secure Express apps by setting various HTTP headers.

// {
// 	origin: 'https://travel-blush.vercel.app/api/logs',
// }

app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		message: 'hello world',
	});
});

app.use('/api/logs', logs); // use the api routes in the logs.js file, default path is 1337/api/logs

app.use(middlewares.notFound);

app.use(middlewares.errorHandler);

const port = process.env.PORT || 1337;
app.listen(port, () => {
	console.log(`Listen to port ${port}.`);
});
