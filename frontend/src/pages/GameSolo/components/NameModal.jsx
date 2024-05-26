import { useState } from 'react'

import Modal from 'react-modal'
import { PlayerStates } from '../../../utils/utils'

import '../styles/NameModal.css'

function NameModal({setPlayerName, setInitTime, setPlayerState, setStartGame}){
	const [modalIsOpen, setModalIsOpen] = useState(true)
	const [playerInputValue, setPlayerInputValue] = useState('')
	const [timeValue, setTimeValue] = useState(200)
	const [errMessage, setErrMessage] = useState('')

	const handlePlayerInputChange = (event) => {
		setPlayerInputValue(event.target.value)
	}

	const handleTimeChange = (event) => {
		setTimeValue(event.target.value)
	}

	const closeModal = (event) => {
		event.preventDefault()
		if(playerInputValue === ''){
			setErrMessage('Player can\'t be empty')
			return
		}
		if(playerInputValue.length > 20){
			setErrMessage('Player can\'t have more than 20 characters')
			return
		}

		setErrMessage('')
		setPlayerName(playerInputValue)
		setInitTime(timeValue)
		setPlayerState(PlayerStates.PLAYING)
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
			<form className = 'name-modal' onSubmit = {closeModal}>
				<h1 style={{ color: 'dodgerblue', fontSize: '1.5em' }}>Choose names and time to play</h1>
				<input 
					autoFocus
					type = 'text'
					placeholder = 'Player name'
					value = {playerInputValue}
					onChange = {handlePlayerInputChange}
				/>
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

export default NameModal