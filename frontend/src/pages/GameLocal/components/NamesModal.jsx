import { useState } from 'react'

import Modal from 'react-modal'
import { PlayerStates } from '../../../utils/utils'

import '../styles/NamesModal.css'

function NamesModal({setPlayer1Name, setPlayer2Name, setInitTime, setPlayer1State, setStartGame}){
	const [modalIsOpen, setModalIsOpen] = useState(true)
	const [player1InputValue, setPlayer1InputValue] = useState('')
	const [player2InputValue, setPlayer2InputValue] = useState('')
	const [timeValue, setTimeValue] = useState(200)
	const [errMessage, setErrMessage] = useState('')

	const handlePlayer1InputChange = (event) => {
		setPlayer1InputValue(event.target.value)
	}

	const handlePlayer2InputChange = (event) => {
		setPlayer2InputValue(event.target.value)
	}

	const handleTimeChange = (event) => {
		setTimeValue(event.target.value)
	}

	const closeModal = (event) => {
		event.preventDefault()
		if(player1InputValue === ''){
			setErrMessage('Player 1 can\'t be empty')
			return
		}
		if(player1InputValue.length > 20){
			setErrMessage('Player 1 can\'t have more than 20 characters')
			return
		}
		if(player2InputValue === ''){
			setErrMessage('Player 2 can\'t be empty')
			return
		}
		if(player2InputValue.length > 20){
			setErrMessage('Player 2 can\'t have more than 20 characters')
			return
		}

		setErrMessage('')
		setPlayer1Name(player1InputValue)
		setPlayer2Name(player2InputValue)
		setInitTime(timeValue)
		setPlayer1State(PlayerStates.PLAYING)
		setStartGame(true)
		setModalIsOpen(false)
	}

	return(
		<Modal
			isOpen = {modalIsOpen}
			onRequestClose = {closeModal}
			contentLabel = "Choose names and time to play"
			style={{
				overlay: {
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: vars => vars.theme === 'dark' ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
				},
			}}
		>
			<form className = 'names-modal' onSubmit = {closeModal}>
				<h1 style={{ color: 'dodgerblue', fontSize: '1.5em' }}>Choose names and time to play</h1>
				<div className = 'names-selector'>
					<div className = 'name-selector'>
						<h2 className = 'player1-label'>Player 1</h2>
						<input 
							autoFocus
							type = 'text'
							placeholder = 'Player 1 name'
							value = {player1InputValue}
							onChange = {handlePlayer1InputChange}
						/>
					</div>
					<div className = 'name-selector'>
						<h2 className = 'player2-label'>Player 2</h2>
						<input 
							type = 'text'
							placeholder = 'Player 2 name'
							value = {player2InputValue}
							onChange = {handlePlayer2InputChange}
						/>
					</div>
				</div>
				<div className = 'time-div'>
					<label htmlFor = "time-options">Time for each participant (sec.):</label>
					<select id = "time-options" name = "time-options" value = {timeValue} 
						onChange = {handleTimeChange}>
						<option value = "200">200</option>
						<option value = "300">300</option>
						<option value = "400">400</option>
						<option value = "500">500</option>
					</select>
				</div>
				<p>{errMessage}</p>
				<button>Ok</button>
			</form>
		</Modal>
	)
}

export default NamesModal