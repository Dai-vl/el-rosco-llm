import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Modal from 'react-modal'

import '../styles/MultiTableModal.css'

function MultiTableModal({roomID, setRoomID, playerName, setPlayerName, socket, mode, setMode}){

	const history = useNavigate()
	const [modalIsOpen, setModalIsOpen] = useState(true)

	const handleNewGame = (event) => {
		event.preventDefault()
		setMode('new')
		const code = Math.random().toString(36).substring(2, 8).toUpperCase()
		setRoomID(code)		
		const name = document.getElementById('name_input').value
		setPlayerName(name)
		
	}

	const handleJoinGame = (event) => {
		event.preventDefault()
		setMode('join')
		const name = document.getElementById('name_input').value
		setPlayerName(name)
		
	}

	const handlePlay = (event) => {
		event.preventDefault()
		
		if(mode === 'join'){
			
			const code = document.getElementById('tag_input').value
			setRoomID(code)
			socket.emit('joinRoom', code, playerName)
		}
		else {
			
			socket.emit('newRoom', roomID, playerName)
		}
		setModalIsOpen(false) 
		
	}

	const handleExit = (event) => {
		event.preventDefault()
		history('/')
		setModalIsOpen(false)
	}

	const closeModal = (event) => {
		event.preventDefault()
		setModalIsOpen(false)
	}

	return (
		<Modal 
			isOpen = {modalIsOpen}
			shouldCloseOnOverlayClick={false}
			onRequestClose = {closeModal}
			contentLabel = "Búsqueda de partida"
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
			<div className = 'modalContainer'>
				<h1 className = 'title'>Game Mode</h1>
				{mode ? (
					<div>
						{mode === 'new' ? (
							<p style = {{ textAlign: 'center' }}>Your game tag is:<br/><br/>
								<strong style = {{ color: 'dodgerblue', fontSize: '1.5em' }}>{roomID}</strong></p>
						) : (
							<div style = {{ textAlign: 'center' }} className = 'code-input'>
								<p>Write your game tag:</p>
								<form>
									<input id='tag_input' type = "text" name = "roomID" 
										placeholder = 'Game tag'
									/>
								</form>
							</div>
						)}
						<div className = 'buttons'>
							<button onClick = {handlePlay}>Play</button>
							<button onClick = {handleExit}>Exit</button>
						</div>
					</div>
				) : (
					<>
						<div style = {{ textAlign: 'center' }} className = 'code-input'>
							<p>Write your player name:</p>
							<input 
								id='name_input'
								type = "text" 
								placeholder = 'Player name'
							/>
						</div>

						<div className = 'buttons'>
							<button onClick = {handleNewGame}>New</button>
							<button onClick = {handleJoinGame}>Join</button>
						</div>
					</>
				)}
			</div>
		</Modal>
	)
}

export default MultiTableModal