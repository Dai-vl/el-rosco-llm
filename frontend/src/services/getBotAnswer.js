import axios from 'axios'

export const getBotAnswerService = (firstPart, secondPart, bot) => {
	const data = {
		firstPart: firstPart,
		secondPart: secondPart,
		bot: bot
	}
	
	return axios.post('http://localhost:3003/api/questions/answerBot', data)
		.then(response => response.data)
		.catch(error => {
			console.error(error.response.data)
		})

	// return axios.post('https://tfg-backend-njze.onrender.com/api/questions/answerBot', data)
	// .then(response => response.data)
	// .catch(error => {
	// console.error(error.response.data);
	// });
}