import Question from '../models/question.js'
import OpenAI from 'openai'
import axios from 'axios'

const openai = new OpenAI({
	apiKey: process.env.API_KEY
})

//Funcion para obtener una respuesta de ChatGPT
export const geBotResponse = async (promptUser, botDir) => {
	//Pedir la palabra
	const pal = await llamadaAPIBot(promptUser, 8, 0.2, botDir);
	let palabra = pal.contenido.toLowerCase();
	return palabra;
}

const llamadaAPIBot = async (promptUser, tokens, temperatura, modelo) => {
    const llam = await openai.chat.completions.create({
        model: modelo,
        temperature: temperatura,
        messages: [
			{
				role: 'user',
				content: promptUser,
			},
        ],
        max_tokens: tokens,
    });
    return {
        contenido: llam.choices[0].message.content
    }
}

//Función para preguntar a ChatGPT si la palabra sirve o no
export const getResponse = async (promptUser, ejemploSalida) => {
    //Pedir la palabra
    const pal = await llamadaAPI(promptUser, ejemploSalida, 2, 0.5, "gpt-3.5-turbo");
    
    let palabra = pal.contenido.toLowerCase();

    if(palabra == 1){ 
        return 1
    }
    else{
        return 2
    }
};

//Función para llamar a la API
const llamadaAPI = async (promptUser, promptAssistant, tokens, temperatura, modelo) => {
	const llam = await openai.chat.completions.create({
		model: modelo,
		temperature: temperatura,
		messages: [
			{
				role: 'user',
				content: promptUser,
			},
			{
				role: 'assistant',
				content: promptAssistant,
			},
		],
		max_tokens: tokens,
	})
	return {
		contenido: llam.choices[0].message.content
	}
}

//Función para buscar palabras que sean válidas
const getWord = async (letra, promptPedirPalabra, ejemploSalidaPalabra) => {
	//Variables
	let palValida = 'N'
	let empiezaCon = ''
	let palabra = ''

	//Pedir la palabra
	const pal = await llamadaAPI(promptPedirPalabra, ejemploSalidaPalabra, 10, 1.1, 'gpt-3.5-turbo')
    
	palabra = pal.contenido.toLowerCase()
	console.log(palabra)

	//********************************************//
	//Vemos si existe en Wikipedia
	palabra = palabra.trim()
	const apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + palabra
	const respuesta  = await axios.get(apiUrl)

	if(!respuesta.data.pages.length){
		console.log('NO está en el inglés')
		return {
			word: palabra,
			empieza: empiezaCon,
			valida: palValida
		}
	}
	else{
		console.log('SI está en el inglés')
	}

	//Si no contiene la letra, error y salir
	if(!palabra.includes(letra)){
		console.log('Error: Palabra que no contiene la letra '+ letra)
        
		return {
			word: palabra,
			empieza: empiezaCon,
			valida: palValida
		}
	}
	palabra = palabra.trim()
	//Si contiene algún espacio
	if(palabra.includes(" ")){
		console.log('Error: Palabra compuesta')
        
		return {
			word: palabra,
			empieza: empiezaCon,
			valida: palValida
		}
	}
	palValida = 'Y'

	//Si empieza por la letra, empiezaCon = 'Y', si no, empiezaCon = 'N'
	if(palabra.startsWith(letra)){
		empiezaCon = 'Y'
		console.log('Empieza por ' + letra)
	}
	else{
		empiezaCon = 'N'
		console.log('No empieza por ' + letra)
	}

	return {
		word: palabra,
		empieza: empiezaCon,
		valida: palValida
	}
}

//Función para buscar definiciones que sean válidas
const getDesc = async (palabra, promptPedirDesc, ejemploSalidaDesc, theme) => {
	//Variables
	let descripcion
	let descValida = 'N'
	let bucle = 0

	//Bucle para pedir definiciones hasta que sea válida
	while(descValida == 'N' && bucle < 3){
		//Pedir definición
		const desc = await llamadaAPI(promptPedirDesc, ejemploSalidaDesc, 100, 0.5, 'gpt-3.5-turbo')

		descripcion = desc.contenido
        
		console.log(descripcion)

		descripcion = borrarHastaPalabra(descripcion,palabra)

		descripcion = descripcion.trim()

		const caracter = descripcion.charAt(0).toUpperCase()

		descripcion = caracter + descripcion.substring(1)

		const descMinus = descripcion.toLowerCase()

		console.log(descripcion)

		//Si la definición contiene la palabra, error y volver a pedir
		if(descMinus.includes(palabra.toLowerCase())){
			console.log('Error: La definición contiene la palabra ' + palabra)
			bucle++
			continue
		}

		//Si la definición no contiene la palabra, comprobar si es válida
		let promptComprobarDefinición
		if(theme == ''){
			promptComprobarDefinición= 'Now: Answer yes or no:\nWord: ' + palabra + '\nDescription: ' + descripcion + '\nDoes the description accurately represent the provided word?'
		}
		else{
			promptComprobarDefinición= 'Now: Answer yes or no:\nWord: ' + palabra + '\nDescription: ' + descripcion + '\nDoes the description accurately represent the provided word? Is the definition related with ' + theme + '?'
		}
		const promptEjemploComprobarDefinición = 'Sí.'

		const comprobarDefinicion = await llamadaAPI(promptComprobarDefinición, promptEjemploComprobarDefinición, 2, 0.5, 'gpt-3.5-turbo')

		console.log(comprobarDefinicion.contenido)

		//Si la definición es válida, descValida = 'Y', si no, descValida = 'N'
		const arraySoluciones = ['Sí', 'Si.', 'Yes.', 'Yes']

		

		if(arraySoluciones.indexOf(comprobarDefinicion.contenido) !== -1){ 
			descValida = 'Y'
			console.log('Palabra válida')
		}
		else{
			descValida = 'N'
			bucle++
		}
	} 

	return {
		desc: descripcion,
		valida: descValida
	}
}

const borrarHastaPalabra = (str, palabra) => {
	const strMinuscula = str.toLowerCase()
	const palabraMinuscula = palabra.toLowerCase()
	const indice = strMinuscula.indexOf(palabraMinuscula)
	if (indice !== -1) {
		return str.substring(indice+1 + palabra.length)
	} else {
		return str
	}
}

//Función para buscar palabras que sean válidas
const getFamous = async (letra, promptPedirFamoso, ejemploSalidaPalabra, theme) => {
	//Variables
	let valido = 'N'
	let empiezaCon = ''
	let nombre = ''
	let apellido;

	//Pedir la palabra
	let famous = await llamadaAPI(promptPedirFamoso, ejemploSalidaPalabra, 10, 1.1, 'gpt-3.5-turbo')
    famous = famous.contenido.trim().split(' ')
	nombre = famous[0]
	apellido = famous[1]
	
	console.log(nombre + ' ' + apellido)

	//********************************************//
	const apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + nombre + '_' + apellido
	const respuesta  = await axios.get(apiUrl)

	if(!respuesta.data.pages.length){
		console.log('NO aparece en wikipedia')
		return {
			word: nombre + ' ' + apellido,
			empieza: empiezaCon,
			valida: valido
		}
	}
	else{
		console.log('SI aparece en wikipedia')
	}
    
	//********************************************//
	//Si no contiene la letra, error y salir
	if(nombre.toLowerCase().includes(letra)){
		valido = 'Y'
		if(nombre.toLowerCase().startsWith(letra)){
			empiezaCon = 'Y'
			console.log('Empieza por ' + letra)
		}
		else{
			empiezaCon = 'N'
			console.log('No empieza por ' + letra)
		}
	
		return {
			word: nombre,
			nombre: nombre,
			apellido: apellido,
			empieza: empiezaCon,
			valida: valido
		}
	}
	
	if(apellido.toLowerCase().includes(letra)){
		valido = 'Y'
		if(apellido.toLowerCase().startsWith(letra)){
			empiezaCon = 'Y'
			console.log('Empieza por ' + letra)
		}
		else{
			empiezaCon = 'N'
			console.log('No empieza por ' + letra)
		}
	
		return {
			word: apellido,
			nombre: nombre,
			apellido: apellido,
			empieza: empiezaCon,
			valida: valido
		}
	}

	console.log('Error: Ni nombre ni apellido contienen la letra '+ letra)
        
	return {
		word: nombre + ' ' + apellido,
		nombre: nombre,
		apellido: apellido,
		empieza: empiezaCon,
		valida: valido
	}
}

//Función para buscar definiciones que sean válidas
const getInfo = async (palabra, fullName, promptPedirInfo, theme) => {
	//Variables
	let info
	let infoValida = 'N'
	let bucle = 0

	//Bucle para pedir definiciones hasta que sea válida
	while(infoValida == 'N' && bucle < 3){
		//Pedir definición
		const informacion = await llamadaAPI(promptPedirInfo, '', 100, 0.5, 'gpt-3.5-turbo')

		info = informacion.contenido
		
		info = borrarDesdePalabra(info, '?')
		console.log(info)

		//Si la definición contiene la palabra, error y volver a pedir
		if(info.includes(palabra)){
			console.log('Error: La definición contiene la palabra ' + palabra)
			bucle++
			continue
		}

		const promptComprobarInfo = 'Answer yes or no. Does this question give accurately information about ' + fullName +'? Is ' + fullName + '\'s work related with ' + theme
									+ '? Is the answer to this question ' + palabra + '?\nQuestion: ' + info + '\n'
		const promptEjemploComprobarInfo  = 'Sí.'

		console.log(promptComprobarInfo)
		const comprobarDefinicion = await llamadaAPI(promptComprobarInfo, promptEjemploComprobarInfo , 2, 0.5, 'gpt-3.5-turbo')

		console.log(comprobarDefinicion.contenido)

		//Si la definición es válida, descValida = 'Y', si no, descValida = 'N'
		const arraySoluciones = ['Sí', 'Si.', 'Yes.', 'Yes']

		if(arraySoluciones.indexOf(comprobarDefinicion.contenido) !== -1){ 
			infoValida = 'Y'
			console.log('Palabra válida')
		}
		else{
			infoValida = 'N'
			bucle++
		}
	} 

	return {
		info: info,
		valida: infoValida 
	}
}

const borrarDesdePalabra = (str, palabra) => {
	const strMinuscula = str.toLowerCase()
	const palabraMinuscula = palabra.toLowerCase()
	const indice = strMinuscula.indexOf(palabraMinuscula)
	if (indice !== -1) {
		return str.substring(0, indice + 1)
	} else {
		return str
	}
}

const generateQuestionGPT = async (letter, theme, example) => {
	console.log('Generando con ChatGPT 3.5')
	let newQuestion
	let iterations = 0
	while(true){
		if(iterations < 3) {
			const promptPedirPregunta = 'Generate only, without any unnecessary message and without punctuation, a word that exists in English, that starts with the letter '+ letter +' that is common and has to do with '
										+ (theme == '' ? 'anything' : theme) 
			const palStruct = await getWord(letter, promptPedirPregunta, example)
			if (palStruct.valida == 'N'){
				iterations++
				continue
			}

			const promptPedirDesc = 'Generate a definition of the word '+ palStruct.word +' in 20 words. Include essential information about its meaning and common use. It has to do with ' + theme + '.'
			const defStruct = await getDesc(palStruct.word,promptPedirDesc, '', theme)
			if (defStruct.valida == 'N'){
				iterations++
				continue  
			}  

			// Crea una instancia del modelo y guarda en la base de datos
			newQuestion = new Question({
				letter: letter,
				word: palStruct.word,
				description: defStruct.desc,
				startsWith: palStruct.empieza,
				Idioma: 'Eng'
			})

			return newQuestion
		}
		else{
			const promptPedirFamoso = 'Give me the name and surname of a famous individual who is related with ' + theme + '. The name or surname must start with ' + letter + '. Give only this two words.'
			const famousStruct = await getFamous(letter, promptPedirFamoso, '', theme)
			if (famousStruct.valida == 'N'){
				iterations++
				continue
			}

			if(famousStruct.word.includes('.')){
				continue
			}
			const fullName = famousStruct.nombre + ' ' + famousStruct.apellido
			const promptPedirInfo = 'Give me a question of 30 words about ' + fullName  + '. It has to do with ' + theme + '. The answer of the question must be ' + famousStruct.word
			const infoStruct = await getInfo(famousStruct.word, fullName, promptPedirInfo, theme)
			if (infoStruct.valida == 'N'){
				iterations++
				continue  
			}   

			const descripcion = infoStruct.info + ' Give the ' + ((famousStruct.word === famousStruct.nombre) ? 'name' : 'surname')
			newQuestion = new Question({
				letter: letter,
				word: famousStruct.word,
				description: descripcion,
				startsWith: famousStruct.empieza,
				Idioma: 'Eng'
			})

			return newQuestion
		}
	}
}

const generateQuestionTrained = async (letter, theme) => {
	console.log('Generando con modelo entrenado')
	let newQuestion
	while(true){
		const promptPedirPregunta = 'Give me a word, definition and difficulty (Easy, Medium or Hard) for '+ letter +' related to ' + (theme == '' ? 'anything' : theme);
		const response = await llamadaAPI(promptPedirPregunta, '', 150, 1, 'ft:gpt-3.5-turbo-0125:tfg:pruebapreguntas6:9GthMKlS:ckpt-step-284')

		const array = response.contenido.split('|')

		if(!array[0].toLowerCase().includes(letter)){
			console.log('La palabra NO contiene la letra')
			continue
		}

		const apiUrl = 'https://en.wikipedia.org/w/rest.php/v1/search/page?q=' + array[0]
		const respuesta  = await axios.get(apiUrl)
		if(!respuesta.data.pages.length){
			console.log('NO aparece en wikipedia')
			continue
		}
		else{
			console.log('SI aparece en wikipedia')
		}

		let promptComprobarDefinición
		if(theme == ''){
			promptComprobarDefinición= 'Now: Answer yes or no:\nWord: ' + array[0] + '\nDescription: ' + array[1] + '\nDoes the description accurately represent the provided word?'
		}
		else{
			promptComprobarDefinición= 'Now: Answer yes or no:\nWord: ' + array[0] + '\nDescription: ' + array[1] + '\nDoes the description accurately represent the provided word? Is the definition related with ' + theme + '?'
		}
		const promptEjemploComprobarDefinición = 'Sí.'
		const comprobarDefinicion = await llamadaAPI(promptComprobarDefinición, promptEjemploComprobarDefinición, 2, 0.5, 'gpt-3.5-turbo')
		const arraySoluciones = ['Sí', 'Si.', 'Yes.', 'Yes']
		if(arraySoluciones.indexOf(comprobarDefinicion.contenido) !== -1){ 
			console.log('Palabra válida')
		}
		else{
			console.log('Palabra no válida')
			continue
		}

		newQuestion = new Question({
			letter: letter,
			word: array[0].trim(),
			description: array[1],
			startsWith: (array[0].toLowerCase().startsWith(letter) ? 'Y' : 'N'),
			Idioma: 'Eng'
		})
		break;
	}
	return newQuestion
}

export async function generateQuestion(letter, theme, example, trained){
	let response
	trained == 0
		? response = await generateQuestionGPT(letter, theme, example)
		: response = await generateQuestionTrained(letter, theme)
	return response
}




