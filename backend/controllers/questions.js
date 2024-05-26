import { Router } from 'express';
const questionRouter = Router();
import Question from '../models/question.js'
import axios from 'axios';
import OpenAI from 'openai'
import {validResponsePrompt, getBotResponsePrompt, getBadBotResponsePrompt, prodigyBotDir, mistakeBotDir, prodigyBotName, mistakeBotName} from '../constants.js'
import {generateQuestion, getResponse, geBotResponse} from '../services/ChatGPT_API.js'


const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'x', 'y', 'z']


const openai = new OpenAI({
    apiKey: process.env.API_KEY 
});

questionRouter.get('/', async (request, response) => {
	const questions = await Question.find({})
	response.json(questions)
})


questionRouter.get('/local',async (request, response) => {
	const result = {}
 
	for (const letter of letters) {
		// Realiza una consulta para obtener dos preguntas aleatorias con la letra actual
		const questions = await Question.aggregate([
			{ $match: { $and: [ { letter }, { language: 'Eng' } ]}},
			{ $sample: { size: 2 } }
		])
 
		// Agrega las preguntas aleatorias al objeto de resultado
		result[letter] = questions
	}
	 
	response.json(result)
})

questionRouter.get('/get-questions-level',async (request, response) => {
	const result = {}
	const {level} = request.query
	let other_level = 'Medium'

	for (const letter of letters) {
		let questions = []
		// Realiza una consulta para obtener dos preguntas aleatorias con la letra actual
		questions = await Question.aggregate([
			{ $match: { $and: [{ letter }, { language: 'Eng' }, { level: level }] } },
			{ $sample: { size: 2 } }
		]);
	
		// Si no se encuentran preguntas con el nivel especificado, realizar la consulta con el nivel alternativo
		if (questions.length !== 2) {
			questions = await Question.aggregate([
				{ $match: { $and: [{ letter }, { language: 'Eng' }, { level: other_level }] } },
				{ $sample: { size: 2 } }
			]);
		}
	
		// Agrega las preguntas aleatorias al objeto de resultado
		result[letter] = questions
	}
	response.json(result)
})

questionRouter.get('/solo',async (request, response) => {
	const result = {}

	for (const letter of letters) {
		// Realiza una consulta para obtener dos preguntas aleatorias con la letra actual
		const questions = await Question.aggregate([
			{ $match: { letter } },
			{ $sample: { size: 1 } }
		])

		// Agrega las preguntas aleatorias al objeto de resultado
		result[letter] = questions
	}

	response.json(result)
})

questionRouter.get('/generate', async (request, response) => {
	const question = await generateQuestion(request.query.letter, request.query.theme, request.query.example, request.query.trained )
	response.json(question)
})

questionRouter.post('/check',async (request, response) => {
	let result
	const {param1, param2, param3} = request.body //real solution, proposed solution, definition
	let apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + param2.trim().toLowerCase() 
	let respuesta  = await axios.get(apiUrl)
	if(!respuesta.data.pages.length){
        result = 2
    }
	else
		result = await getResponse(validResponsePrompt(param1, param2, param3) ,"");	

	response.send(String(result))
})

questionRouter.post('/answerBot',async (request, response) => {
	let result
	const {firstPart, secondPart, bot} = request.body

	switch (bot) {
		case prodigyBotName:
			var botDir = prodigyBotDir
			var prompt = getBotResponsePrompt(firstPart, secondPart)
			break
		case mistakeBotName:
			var botDir = mistakeBotDir
			var prompt = getBadBotResponsePrompt(firstPart, secondPart)
			break
		default:
			var botDir = prodigyBotDir
			var prompt = getBotResponsePrompt(firstPart, secondPart)
			break
	}
	result = await geBotResponse(prompt, botDir);
	response.send(String(result))
})

export default questionRouter
