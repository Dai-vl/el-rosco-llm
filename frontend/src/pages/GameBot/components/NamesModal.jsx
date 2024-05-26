import { useState } from 'react'

import Modal from 'react-modal'
import { PlayerStates } from '../../../utils/utils'

import '../styles/NamesModal.css'

function NamesModal({setPlayerName, setInitTime, setLevel, setPlayer1State, setStartGame}){
	const [modalIsOpen, setModalIsOpen] = useState(true)
	const [playerInputValue, setPlayerInputValue] = useState('')
	const [timeValue, setTimeValue] = useState(500) 
	const [levelValue, setLevelValue] = useState('Medium')
	const [errMessage, setErrMessage] = useState('')

	const handlePlayerInputChange = (event) => {
		setPlayerInputValue(event.target.value)
	}

	const handleTimeChange = (event) => {
		setTimeValue(event.target.value)
	}

	const handleLevelChange = (event) => {
		setLevelValue(event.target.value)
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
		setLevel(String(levelValue))
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
				<h1 style={{ color: 'dodgerblue', fontSize: '3em' }}>Choose name</h1>
				<div className = 'names-selector'>
					<div className = 'name-selector'>
						<input 
							autoFocus
							type = 'text'
							placeholder = 'Player name'
							value = {playerInputValue}
							onChange = {handlePlayerInputChange}
						/>
					</div>
				</div>
				<div className = 'level-selector'>
					<label htmlFor = "level-options">Level:</label>
					<select id = "level-options" name = "level-options" value = {levelValue} onChange = {handleLevelChange}>
						<option value = "Easy">Easy</option>
						<option value = "Medium">Medium</option>
						<option value = "Hard">Hard</option>
					</select>
				</div>
				<div className = 'time-div'>
					<label htmlFor = "time-options">Time for each participant (sec.):</label>
					<select id = "time-options" name = "time-options" value = {timeValue} onChange = {handleTimeChange}>
						<option value = "500">500</option>
						<option value = "600">600</option>
						<option value = "800">800</option>
						<option value = "1000">1000</option>
					</select>
				</div>
				<p>{errMessage}</p>
				<button>Ok</button>
			</form>
		</Modal>
	)
}

export default NamesModal