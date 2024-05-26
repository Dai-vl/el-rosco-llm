import { useEffect, useState } from 'react'

import Modal from 'react-modal'
import Player from '../../commonComponents/Player'
import NameModal from './components/NameModal'
import ResultModal from './components/ResultModal'
import { PlayerStates, Letters } from '../../utils/utils'

import '../../styles/Player.css'

Modal.setAppElement('#root')

function GameSolo({ generatedQuestions, theme }) {
	const [playerName, setPlayerName] = useState('')
	const [playerState, setPlayerState] = useState(PlayerStates.WAITING)
	const [initTime, setInitTime] = useState(60)
	const [startGame, setStartGame] = useState(false)
	const [questions, setQuestions] = useState([])

	useEffect(() => {
		let questions = []
		console.log(generatedQuestions)
		for (let i = 0; i < Letters.length; ++i) {
			questions.push({'state': 0, 'description': '', 'word': ''})
			questions[i].state = 0
			questions[i].description = 
					(generatedQuestions[i].startsWith === 'Y'
						? 'Starts with ' + Letters[i]
						: 'Contains ' + Letters[i] ) 
					+ ': ' + generatedQuestions[i].definition
			questions[i].word = generatedQuestions[i].answer
		}
		console.log(questions)
		setQuestions(questions)
	}, [])

	const changeTurn = () => {
		setPlayerState(PlayerStates.PLAYING)
	}

	return (
		<>
			<NameModal 
				setPlayerName = {setPlayerName} 
				setInitTime = {setInitTime} 
				setPlayerState = {setPlayerState} 
				setStartGame = {setStartGame}
			/> 
			{startGame ? ( 
				<>
					<Player
						className = "p1"
						initialTime = {initTime}
						playerName = {playerName}
						playerState = {playerState}
						setPlayerState = {setPlayerState}
						changeTurn = {changeTurn}
						questions = {questions}
						setQuestions = {setQuestions}
					/>
					<ResultModal
						playerState = {playerState}
						questions = {questions}
						theme = {theme} 
					/>
				</>
			) : (
				<p>Loading questions...</p>
			)}
		</>
	)
}

export default GameSolo