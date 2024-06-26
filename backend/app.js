import config from './utils/config.js';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import middleware from './utils/middleware.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose';
import questionRouter from './controllers/questions.js';

const app = express();

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI2)

mongoose.connect(config.MONGODB_URI2)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connecting to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)


app.use('/api/questions',questionRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app