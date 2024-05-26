import { useState } from 'react'
import axios from 'axios'

import { Letters } from '../../utils/utils'
import GenerateWheel from './components/GenerateWheel.jsx'
import APInterface from './components/APInterface.jsx'
import GameSolo from '../GameSolo/index.jsx'

function GenerateQuestions() {
	const [play, setPlay] = useState(false)
	const [theme, setTheme] = useState('')
	const [example, setExample] = useState('')
	const [questions, setQuestions] = useState(() => {
		const array = []
		for(let i = 0; i < Letters.length; ++i){
			array.push({state: 0, definition: null, answer: null, startsWith: 'N'})
		}
		return array
	})
	const [show, setShow] = useState({
		letter: '',
		definition: '',
		answer: '',
		show: false
	})
	const [trained, setTrained] = useState(0)
	const [llamadaActiva, setLlamadaActica] = useState(false)
	
	const generateQuestions = async (event) => {
		try{
			event.preventDefault()
			setLlamadaActica(true)
			setQuestions(() => {
				const array = []
				for(let i = 0; i < Letters.length; ++i){
					array.push({state: 0, definition: null, answer: null})
				}
				return array
			})
			setShow({
				letter: '',
				definition: '',
				answer: '',
				show: false
			})

			console.log(trained)
	
			for(let i = 0; i < Letters.length; ++i){
				const params = {
					theme: theme,
					example: example,
					letter: Letters[i].toLowerCase(),
					trained : trained
				}
	
				const response = await axios.get('http://localhost:3003/api/questions/generate', {params})
				setQuestions(prevState => {
					const newState = [...prevState]
					newState[i].state = 1
					newState[i].definition = response.data.description
					newState[i].answer = response.data.word
					newState[i].startsWith = response.data.startsWith
					return newState
				})
			}
		}
		catch(error){
			console.error('Error en la generación de preguntas:', error)
		}
		finally{
			setLlamadaActica(false)
		}
	}

	return (
		<>
			{play ? ( 
				<GameSolo generatedQuestions = {questions} theme = {theme}/>
			) : (
				<>
					<APInterface
						setPlay = {setPlay}
						trained = {trained}
						setTrained = {setTrained}
						generateQuestions = {generateQuestions} 
						theme = {theme} setTheme = {setTheme} 
						example = {example} setExample = {setExample}
						show = {show} setShow = {setShow}
						llamadaActiva = {llamadaActiva}
						juegoPreparado = {questions.every(obj => obj.state === 1)}
					/>
					<GenerateWheel questions = {questions} setShow = {setShow}/>
				</>
			)}
		</>
	)
}

export default GenerateQuestions