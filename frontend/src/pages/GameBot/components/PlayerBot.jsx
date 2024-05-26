import { useState } from 'react'
import LetterWheel from '../../../commonComponents/LetterWheel'
import Timer from '../../../commonComponents/Timer'
import AnswerBot from './AnswerBot'
import WrongAnswerModal from '../../../commonComponents/WrongAnswerModal'
import { Letters, PlayerStates, findValueFromArray } from '../../../utils/utils'

import '../styles/PlayerBot.css'
import { checkAnswerLocal } from '../../../services/checkAnswer'
import { getBotAnswerService } from '../../../services/getBotAnswer'

function PlayerBot({initialTime, playerName, playerState, setPlayerState, changeTurn, questions, setQuestions, level}) {
	const [questionPos, setQuestionsPos] = useState(0)
	const [openWAModal, setWAModalOpen] = useState(false)
	const [rightAnswer, setRightAnswer] = useState('')
	const [firstPart, secondPart] = questions[questionPos].description.split(':')

	const getBotAnswer = async (bot) => {
		const answer = await getBotAnswerService(firstPart, secondPart, bot)
		return answer
	}

	const verifyAnswer = async (myAnswer) => {
		if (myAnswer.split(' ').length > 1) 
			skip()
		const answer = questions[questionPos].word
		let isCorrect = 2
		let isValid = true
		if(myAnswer.toLowerCase() === answer.toLowerCase()){
			isCorrect = 1
		}
		if(!myAnswer.toUpperCase().includes(Letters[questionPos])){
			isValid = false
		}
		let startsWith = firstPart.includes('Starts with') ? true : false
		if(startsWith & !myAnswer.toUpperCase().startsWith(Letters[questionPos])){
			isValid = false
		}
		if (isValid && isCorrect === 2) {
			const respuesta = await checkAnswerLocal(answer, myAnswer, secondPart)
			if (respuesta == 1) {
				isCorrect = 1
			}
		}

		let newState
		setQuestions(prevState => {
			newState = [...prevState]
			newState[questionPos].state = isCorrect
			return newState
		})

		let newPos = findValueFromArray(newState.map(question => question.state), 0, questionPos)
		if(isCorrect === 2){
			setRightAnswer(answer)
			setPlayerState(PlayerStates.CHANGING)
			setWAModalOpen(true)
		}
		else if(newPos == -1)
			onPlayerEnd()
		
		setQuestionsPos(Math.max(0,newPos))
		return
	}
	

	const onAnswerWrong = () => {
		if(!questions.map(question => question.state).includes(0))
			onPlayerEnd()
		else
			changeTurn()
		setWAModalOpen(false)
	}

	const skip = () => {
		changeTurn()
		setQuestionsPos(preValue => findValueFromArray(questions.map(question => question.state), 0, preValue + 1))
	}

	const onPlayerEnd = () => {
		changeTurn()
		setPlayerState(PlayerStates.END)
	}

	return(
		<div className = 'player-bot'>
			<WrongAnswerModal isOpen = {openWAModal} onAnswerWrong = {onAnswerWrong} correctAnswer = {rightAnswer} />
			<h1 className = 'player-name-bot'>{playerName}</h1>
			{playerState === PlayerStates.PLAYING
				? <p className = 'question-bot'>
					<span style = {{ color: 'dodgerblue' }}><strong>{firstPart}:</strong></span>
					{secondPart}
				</p> 
				: ''
			}
			<LetterWheel 
				playerState = {playerState} 
				questionsState = {questions.map(question => question.state)} 
				questionPos = {questionPos}
			/>
			<div className = 'bottom-player-bot'>
				{playerState === PlayerStates.PLAYING
					? <button className = 'skip-bot' onClick = {skip} disabled>Skip</button>
					: <p></p>
				}
				<div className = 'player-info-bot'>
					<Timer initialTime = {initialTime} isActive = {playerState === PlayerStates.PLAYING} onTimerEnd = {onPlayerEnd}/>
					<p className = 'correct-answers-bot'>{questions.map(question => question.state).filter(item => (item === 1)).length}</p>
				</div>
			</div>
			{playerState === PlayerStates.PLAYING
				? <AnswerBot getBotAnswer = {getBotAnswer} verifyAnswer = {verifyAnswer} question={questions[questionPos].description} level = {level} skip = {skip}/>
				: ''
			}
		</div>
	)
}

export default PlayerBot