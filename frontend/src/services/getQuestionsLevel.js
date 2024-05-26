import axios from 'axios'

export const getQuestionsLevel = (level) =>	{
	const data = {
		level: level
	}
	return axios.get('http://localhost:3003/api/questions/get-questions-level', {params : data})
		.then(response => response.data)
	// return axios.get('https://tfg-backend-njze.onrender.com/api/questions/get-questions-level', {params : data})
	// .then(response => response.data)
}
