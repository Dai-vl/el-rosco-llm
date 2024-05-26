import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
	? process.env.MONGODB_URI_TEST
	: process.env.MONGODB_URI

const MAX_PLAYERS = 2;
const MONGODB_URI2 = process.env.MONGODB_URIv2;
const API_KEY = process.env.API_KEY;

export default {
	PORT, MONGODB_URI, MAX_PLAYERS, MONGODB_URI2, API_KEY
}