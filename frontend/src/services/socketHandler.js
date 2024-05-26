import { PlayerStates } from '../utils/utils'
import Swal from 'sweetalert2'

export function handleSocketMessages(socket, state) {
	if(!socket) return

	const {
		setAllPlayersConnected,
		setTime,
		playerState,
		setPlayerState,
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
	} = state

	socket.on('connected', () => {
		console.log('connected')
	})

	socket.on('fullRoom', () => {
		console.log('room is full')
		setAllPlayersConnected(true)
	})

	socket.on('roomCapacityReached', () => {
		alert('That room is already full')
		navigate('/')
	})

	socket.on('timeSet', (time, firstPlayerId) => {
		setTime(time)
		setOtherTimer(time)
		if(socket.id === firstPlayerId){
			setPlayerState(PlayerStates.PLAYING)

			setOtherPlayerState(PlayerStates.WAITING)
		}
		else{
		

			setOtherPlayerState(PlayerStates.PLAYING)
			setPlayerState(PlayerStates.WAITING)
		}
	})
	socket.on('receiveQuestions', (questions) => {
		setOtherQuestions(questions)
	})
	
	socket.on('turnChanged', (currentPlayer) => {
		console.log('Cambio de turno')
		if(socket.id === currentPlayer){
			setPlayerState(PlayerStates.PLAYING)
			if(otherPlayerStateRef.current !== PlayerStates.END){

				setOtherPlayerState(PlayerStates.WAITING)  
			}   
		}
		else{
			if(otherPlayerStateRef.current !== PlayerStates.END)

			setOtherPlayerState(PlayerStates.PLAYING)
			if(playerState !== PlayerStates.END)
				setPlayerState(PlayerStates.WAITING)
		}
	})

	socket.on('questionPosChanged', (newQuestionPos) => {
		setQuestionPos(newQuestionPos)
	})

	socket.on('wrongAnswerReceived', (questionPos, realAnswer) => {
		setOtherQuestions(prevState => {
			const newState = [...prevState]
			newState[questionPos].state = 2 // wrong answer state
			return newState
		})
		setOtherWAmodalOpen(
			{
				opened: true,
				answer: realAnswer
			})
	})
	
	socket.on('correctAnswerReceived', (questionPos, answer) => {
		setOtherQuestions(prevState => {
			const newState = [...prevState]
			newState[questionPos].state = 1 // correct answer state
			return newState
		})
		setOtherRightAnswer(answer)
	})

	socket.on('timeUpdated', (time) => {
		setOtherTimer(time)
	})

	socket.on('closeWrongAnswerModalReceived', () => {
		setOtherWAmodalOpen(
			{
				opened: false,
				answer: ''
			})
		
	})

	socket.on('playerEnded', () => {

		setOtherPlayerState(PlayerStates.END)
		setOtherTimer(0)
	})

	socket.on('gameEnded', (winner) => {
		setPlayerState(PlayerStates.END)
		setOtherPlayerState(PlayerStates.END)

		if(winner === 'Empate')
			console.log('El juego ha terminado, ha sido un empate')
		else if(winner === socket.id){
			console.log('El juego ha terminado, has ganado')
		}
		else
			console.log('El juego ha terminado, has perdido')
	})

	socket.on('otherPlayerName', (name) => {
		setOtherPlayerName(name)
	})

	socket.on('connect_error', (err) => {
		console.log(err.message)
	
		console.log(err.description)
	
		console.log(err.context)
	})

	
	socket.on('otherPlayerLeft', () => {
		console.log('El otro jugador ha abandonado la partida')
		setPlayerState(PlayerStates.END)
		// Desconecta al jugador inmediatamente
		socket.disconnect()
		// Muestra el mensaje y redirige al usuario después de 5 segundos
		Swal.fire({
			title: 'The other player left the game',
			icon: 'info',
			timer: 5000,
		}).then(() => {
			navigate('/')
		})
	})
	
}