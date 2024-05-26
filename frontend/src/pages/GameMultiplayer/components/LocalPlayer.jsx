import { useState } from 'react'
import LetterWheel from '../../../commonComponents/LetterWheel'
import MultiplayerTimer from './MultiplayerTimer'
import Answer from '../../../commonComponents/Answer'
import WrongAnswerModal from '../../../commonComponents/WrongAnswerModal'
import { Letters, PlayerStates, findValueFromArray } from '../../../utils/utils'

import '../../../styles/Player.css'
import { checkAnswerLocal } from '../../../services/checkAnswer'

function LocalPlayer({initialTime, playerName, playerState, setPlayerState, changeTurn, questions, setQuestions, socket}) {

	const [questionPos, setQuestionsPos] = useState(0)
	const [openWAModal, setWAModalOpen] = useState(false)
	const [rightAnswer, setRightAnswer] = useState('')

	const [firstPart, secondPart] = questions[questionPos].description.split(':')

	const verifyAnswer = async (myAnswer) => {
		const answer = questions[questionPos].word
		let isCorrect = 2
		let isValid = true
		if(myAnswer.toLowerCase() === answer){
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
			if (respuesta == '1') {
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

		if(isCorrect === 1){
			socket.emit('correctAnswer', questionPos, answer)
		}

		if(isCorrect === 2){
			setRightAnswer(answer)
			setPlayerState(PlayerStates.CHANGING)
			setWAModalOpen(true)
			socket.emit('wrongAnswer', questionPos, answer)
		}
		else if(newPos == -1)
			onPlayerEnd()
		
		const nextQuestionPos = Math.max(0,newPos)
		setQuestionsPos(nextQuestionPos)
		socket.emit('changeQuestionPos',  nextQuestionPos )
		return
	}
	
	const onAnswerWrong = () => {
		socket.emit('closeWrongAnswerModal')
		if(!questions.map(question => question.state).includes(0))
			onPlayerEnd()
		else
			changeTurn(playerState)
		setWAModalOpen(false)
	}

	const skip = () => {
		changeTurn(playerState)
		const newQuestionPos = findValueFromArray(questions.map(question => question.state), 0, questionPos + 1)
		setQuestionsPos(newQuestionPos)
		socket.emit('changeQuestionPos',  newQuestionPos )
	}

	const onPlayerEnd = () => {
		setPlayerState(PlayerStates.END)
		socket.emit('playerEnd')
		changeTurn(PlayerStates.END)
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
					<MultiplayerTimer initialTime = {initialTime} isActive = {playerState === PlayerStates.PLAYING} onTimerEnd = {onPlayerEnd} socket={socket} local={1}/>
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

export default LocalPlayer