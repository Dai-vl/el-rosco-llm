import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import Player from '../../commonComponents/Player'
import NamesModal from './components/NamesModal'
import WinnerModal from '../../commonComponents/WinnerModal'
import { PlayerStates } from '../../utils/utils'

import {getQuestionsLocal} from '../../services/getQuestions'

import '../../styles/Player.css'

Modal.setAppElement('#root')

function GameLocal() {
	const [player1Name, setPlayer1Name] = useState('')
	const [player2Name, setPlayer2Name] = useState('')
	const [initTime, setInitTime] = useState(60)
	const [startGame, setStartGame] = useState(false)

	const [player1State, setPlayer1State] = useState(PlayerStates.WAITING)
	const [player2State, setPlayer2State] = useState(PlayerStates.WAITING)
	
	const [dataLoaded, setDataLoaded] = useState(false)
	const [questions1, setQuestions1] = useState([])
	const [questions2, setQuestions2] = useState([])


	useEffect(() => {
		async function fetchData() {
			const questions = await getQuestionsLocal()
			console.log('fetching questions')
			let questions1Local = []
			let questions2Local = []

			let index = 0
			for (const key in questions) {
				questions1Local.push({'state': 0, 'description': '', 'word': ''})
				questions1Local[index].state = 0
				questions1Local[index].description = 
					(questions[key][0].startsWith === 'Y'
						? 'Starts with ' + key 
						: 'Contains ' + key ) 
					+ ': ' + questions[key][0].description
				questions1Local[index].word = questions[key][0].word

				questions2Local.push({'state': 0, 'description': '', 'word': ''})
				questions2Local[index].state = 0
				questions2Local[index].description = 
					(questions[key][1].startsWith === 'Y'
						? 'Starts with ' + key 
						: 'Contains ' + key ) 
					+ ': ' + questions[key][1].description
				questions2Local[index].word = questions[key][1].word

				++index
			}
			setQuestions1(questions1Local)
			setQuestions2(questions2Local)

			setDataLoaded(true)
		}
		fetchData()
	}, [])

	const changeTurn = () => {
		if(player1State === PlayerStates.END)
			setPlayer2State(PlayerStates.PLAYING)
		else if(player2State === PlayerStates.END)
			setPlayer1State(PlayerStates.PLAYING)
		else if(player1State === PlayerStates.CHANGING || player1State === PlayerStates.PLAYING){
			setPlayer1State(PlayerStates.WAITING)
			setPlayer2State(PlayerStates.PLAYING)
		}
		else if(player2State === PlayerStates.CHANGING || player2State === PlayerStates.PLAYING){
			setPlayer2State(PlayerStates.WAITING)
			setPlayer1State(PlayerStates.PLAYING)
		}
	}

	return (
		<>
			<NamesModal setPlayer1Name = {setPlayer1Name} setPlayer2Name = {setPlayer2Name} setInitTime = {setInitTime} setPlayer1State = {setPlayer1State} setStartGame = {setStartGame}/> 
			{dataLoaded && startGame ? ( 
				<>
					<Player
						className = "p1"
						initialTime = {initTime}
						playerName = {player1Name}
						playerState = {player1State}
						setPlayerState = {setPlayer1State}
						changeTurn = {changeTurn}
						questions = {questions1}
						setQuestions = {setQuestions1}
					/>
					<Player
						className = "p2"
						initialTime = {initTime}
						playerName = {player2Name}
						playerState = {player2State}
						setPlayerState = {setPlayer2State}
						changeTurn = {changeTurn}
						questions = {questions2}
						setQuestions = {setQuestions2}
					/>
					<WinnerModal
						player1State = {player1State}
						player2State = {player2State}
						questions1 = {questions1}
						questions2 = {questions2}
						player1Name = {player1Name}
						player2Name = {player2Name}
					/>
				</>
			) : (
				<p>Loading questions...</p>
			)}
		</>
	)
}

export default GameLocal