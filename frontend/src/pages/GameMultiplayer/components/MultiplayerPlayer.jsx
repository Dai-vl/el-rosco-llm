import { PlayerStates } from '../../../utils/utils'
import  LetterWheel  from  '../../../commonComponents/LetterWheel'
import  MultiplayerTimer  from './MultiplayerTimer'
import  WrongAnswerModal  from '../../../commonComponents/WrongAnswerModal'
import  { useState, useEffect } from 'react'

import '../styles/MultiplayerPlayer.css'

const MultiplayerPlayer = ({ playerName, playerState, questions, questionPos ,time, onPlayerEnd, otherRightAnswer,socket, otherWAmodalOpen, setOtherWAmodalOpen}) => {
	
	const [showOtherRightAnswer, setShowOtherRightAnswer] = useState(false)
	
	let firstPart = ''
	let secondPart = ''
	if (questions && questions[questionPos]) {
		[firstPart, secondPart] = questions[questionPos].description.split(':')
	}

	useEffect(() => {
		if (otherRightAnswer) {
			setShowOtherRightAnswer(true)
		}
	}, [otherRightAnswer])
	

	return (
		<div className = 'player'>
			<WrongAnswerModal isOpen = {otherWAmodalOpen ? otherWAmodalOpen.opened : false} onAnswerWrong = {() => setOtherWAmodalOpen({opened:false, answer: ''})} correctAnswer = {otherWAmodalOpen ? otherWAmodalOpen.answer : ''} />
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
				<div className = 'player-info'>
					<MultiplayerTimer initialTime = {time} isActive = {playerState === PlayerStates.PLAYING} onTimerEnd = {onPlayerEnd} socket={socket} local={0}/>
					<p className = 'correct-answers'>{questions.map(question => question.state).filter(item => (item === 1)).length}</p>
				</div>
				<div className = 'player-answer'>
					{showOtherRightAnswer && <p> Last correct answer: {otherRightAnswer}</p>}
				</div>
			</div>
			
		</div>
	)
}



export default MultiplayerPlayer