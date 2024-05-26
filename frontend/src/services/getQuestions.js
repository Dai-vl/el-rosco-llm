import axios from 'axios'

export const getQuestionsLocal = () =>	{

	return axios.get('http://localhost:3003/api/questions/local')
		.then(response => response.data)
	// return axios.get('https://tfg-backend-njze.onrender.com/api/questions/local')
	// 	.then(response => response.data)
}

// export const getQuestionsOnline = () => {
// 	return axios.get('https://tfg-backend-njze.onrender.com/api/questions/solo')
// 		.then(response => response.data)
// }

export const getQuestionsOnline = () => {
	return axios.get('http://localhost:3003/api/questions/solo')
		.then(response => response.data)
}