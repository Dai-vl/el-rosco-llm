import { useState } from 'react'
import LetterWheel from './LetterWheel'
import Timer from './Timer'
import Answer from './Answer'
import WrongAnswerModal from './WrongAnswerModal'
import { Letters, PlayerStates, findValueFromArray } from '../utils/utils'

import '../styles/Player.css'
import { checkAnswerLocal } from '../services/checkAnswer'

function Player({initialTime, playerName, playerState, setPlayerState, changeTurn, questions, setQuestions}) {
	const [questionPos, setQuestionsPos] = useState(0)
	const [openWAModal, setWAModalOpen] = useState(false)
	const [rightAnswer, setRightAnswer] = useState('')

	const [firstPart, secondPart] = questions[questionPos].description.split(':')

	const verifyAnswer = async (myAnswer) => {
		const answer = questions[questionPos].word.toLowerCase()
		let isCorrect = 2
		let isValid = true
		if(myAnswer.toLowerCase() === answer){
			isCorrect = 1
		}
		else{

			if(firstPart.includes('Starts with')){
				isValid = myAnswer.toUpperCase().startsWith(Letters[questionPos])
			}
			else{
				isValid = myAnswer.toUpperCase().includes(Letters[questionPos]) && !myAnswer.toUpperCase().startsWith(Letters[questionPos])
			}
			
			if (isValid) {
				const respuesta = await checkAnswerLocal(answer, myAnswer, secondPart)
				if (respuesta == '1') {
					isCorrect = 1
				}
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
		<div className = 'player'>
			<WrongAnswerModal isOpen = {openWAModal} onAnswerWrong = {onAnswerWrong} correctAnswer = {rightAnswer} />
			<h1 className = 'player-name'>{playerName}</h1>
			{playerState === PlayerStates.PLAYING
				? <p className = 'question'>
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
			<div className = 'bottom-player'>
				{playerState === PlayerStates.PLAYING
					? <button className = 'skip' onClick = {skip}>Skip</button>
					: <p></p>
				}
				<div className = 'player-info'>
					<Timer initialTime = {initialTime} isActive = {playerState === PlayerStates.PLAYING} onTimerEnd = {onPlayerEnd}/>
					<p className = 'correct-answers'>{questions.map(question => question.state).filter(item => (item === 1)).length}</p>
				</div>
			</div>
			{playerState === PlayerStates.PLAYING
				? <Answer verifyAnswer = {verifyAnswer}/>
				: ''
			}
		</div>
	)
}

export default Player