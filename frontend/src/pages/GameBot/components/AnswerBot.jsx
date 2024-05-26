import { useState, useEffect } from 'react'
import '../styles/AnswerBot.css'
import * as constants from '../constants'

function AnswerBot({ getBotAnswer, verifyAnswer, question, level, skip }) {
	const [displayedResponse, setDisplayedResponse] = useState('')

	useEffect(() => {
		const fetchBotAnswer = async () => {
			setDisplayedResponse('')
			const wordCount = question.split(' ').length
			writeResponse('Thinking...', constants.THINKING_WRITING_BASE)
			await delay(wordCount * constants.THINKING_DELAY_BASE)
			var random = Math.random()
			const probabilitySkip = constants.PROBABILITY_SKIP[level] || constants.PROBABILITY_SKIP.Default
			if (random < probabilitySkip){
				setDisplayedResponse(constants.SKIP)
				await delay(constants.DISPLAY_RESPONSE_DELAY * constants.SKIP.length)
				return skip()
			}
			random = Math.random()
			const probabilityWrong = constants.PROBABILITY_WRONG[level] || constants.PROBABILITY_WRONG.Default
			let bot
			if (random < probabilityWrong){
				bot = constants.MISTAKE_NAME
			} else {
				bot = constants.PRODIGY_NAME
			} 
			const answer = await getBotAnswer(bot)
			setDisplayedResponse('')
			writeResponse(answer, constants.RESPONSE_WRITING_BASE)
			await delay(answer.length * constants.DISPLAY_RESPONSE_DELAY)
			verifyAnswer(answer)
		}

		fetchBotAnswer()
	}, [getBotAnswer])

	const writeResponse = async (answer, time) => {
		for (let i = 0; i < answer.length; i++) {
			await delay(time)
			setDisplayedResponse(prev => prev + answer[i])
		}
	}

	const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

	return (
		<div className='answer'>
			<h1>{displayedResponse}</h1>
		</div>
	)
}

export default AnswerBot
