import axios from 'axios'

export const checkAnswerLocal = (param1, param2, param3) => {
	const data = {
		param1: param1,
		param2: param2,
		param3: param3
	}
	
	return axios.post('http://localhost:3003/api/questions/check', data)
		.then(response => response.data)
		.catch(error => {
			console.error(error.response.data)
		})

	// return axios.post('https://tfg-backend-njze.onrender.com/api/questions/check', data)
	// 	.then(response => response.data)
	// 	.catch(error => {
	// 		console.error(error.response.data);
	// });
}