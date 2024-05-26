import MultiTableModal from './components/MultiTableModal'
import { getQuestionsOnline } from '../../services/getQuestions'
import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { handleSocketMessages } from '../../services/socketHandler'
import MultiplayerView from './components/MultiplayerView'

import { useNavigate } from 'react-router-dom'
const SERVER_URL = 'http://localhost:3003' 

function GameMultiplayer() {

	const navigate = useNavigate()

	const [allPlayersConnected, setAllPlayersConnected] = useState(false)
	const [roomID, setRoomID] = useState('')
	const [socket, setSocket] = useState(null)
	const [mode, setMode] = useState('')
	const [time, setTime] = useState(null)
	
	const [playerName, setPlayerName] = useState('')
	const [playerState, setPlayerState] = useState(null)
	
	const [otherPlayerName, setOtherPlayerName] = useState('')
	const [otherPlayerState, setOtherPlayerState] = useState(null)
	const [questionPos, setQuestionPos] = useState(0)
	const [otherRightAnswer, setOtherRightAnswer] = useState('')
	const [otherTimer, setOtherTimer] = useState(null)

	const [questions, setQuestions] = useState(null)
	const [otherQuestions, setOtherQuestions] = useState(null)

	const [otherWAmodalOpen, setOtherWAmodalOpen] = useState(null)

	const otherPlayerStateRef = useRef(otherPlayerState)
	

	useEffect(() => {
		otherPlayerStateRef.current = otherPlayerState
	}, [otherPlayerState])
	
	const state  = {
		setAllPlayersConnected, 
		setTime,
		setPlayerState,
		playerState,
		setOtherPlayerName, 
		otherPlayerStateRef,
		setOtherPlayerState,
		questions, 
		setQuestions,
		setOtherQuestions,
		setQuestionPos,
		setOtherRightAnswer,
		setOtherTimer,
		setOtherWAmodalOpen,
		navigate
	}

	useEffect(() => {

		const fetchData = async () => {
			const questions = await getQuestionsOnline()

			let questionsArray = []
			let index = 0

			for (const key in questions) {
				questionsArray.push({'state': 0, 'description': '', 'word': ''})
				questionsArray[index].state = 0
				questionsArray[index].description = 
					(questions[key][0].startsWith === 'Y'
						? 'Starts with ' + key 
						: 'Contains ' + key ) 
					+ ': ' + questions[key][0].description
				questionsArray[index].word = questions[key][0].word

				++index
			}

			setQuestions(questionsArray)
		}

		const newSocket = io.connect(SERVER_URL ,
			{
				transports: ['websocket'],
			})
		
		setSocket(newSocket)

		handleSocketMessages(newSocket, state)
		
		fetchData()

		return () => newSocket.close()
	}, [])

	const hasEmittedQuestions = useRef(false)

	useEffect(() => {
		if (questions && allPlayersConnected && !hasEmittedQuestions.current) {
			console.log('sending questions', questions)
			socket.emit('sendQuestions', questions)
			hasEmittedQuestions.current = true
		}
	}, [questions, allPlayersConnected])

	return (
		<>
			<MultiTableModal roomID={roomID} setRoomID={setRoomID} playerName={playerName} setPlayerName={setPlayerName} socket={socket} mode={mode} setMode={setMode}/>
			{allPlayersConnected 
				? (<MultiplayerView
					socket={socket}
					roomID={roomID}
					mode={mode}
					time={time}
					playerName={playerName}
					playerState={playerState}
					setPlayerState={setPlayerState}
					otherPlayerName={otherPlayerName}
					otherPlayerState={otherPlayerState}
					questions={questions}
					setQuestions={setQuestions}
					questionPos={questionPos}
					otherQuestions={otherQuestions}
					otherRightAnswer={otherRightAnswer}
					otherTimer={otherTimer}
					otherWAmodalOpen={otherWAmodalOpen}
					setOtherWAmodalOpen={setOtherWAmodalOpen}
				/>)
				: (<h1>waiting for players</h1>)
			}
		</>
	)
}

export default GameMultiplayer