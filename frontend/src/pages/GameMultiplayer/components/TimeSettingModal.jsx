import Modal from 'react-modal'
import { useState } from 'react'
import '../styles/TimeSettingModal.css'

const TimeSettingModal = ({ socket }) => {
	const [modalIsOpen, setModalIsOpen] = useState(true)

	const handleTimeSetting = (time) => {
		socket.emit('setTime', {time})

		setModalIsOpen(false)
	}

	return (
		<Modal 
			isOpen={modalIsOpen}
			onRequestClose={() => setModalIsOpen(false)}
			shouldCloseOnOverlayClick={false}
			contentLabel="Establecer tiempo"
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
			<h2>Time for each participant (sec.):</h2>
			<div className='timeGrid'>
				<button onClick={() => handleTimeSetting(200)}>200 seconds</button>
				<button onClick={() => handleTimeSetting(300)}>300 seconds</button>
				<button onClick={() => handleTimeSetting(400)}>400 seconds</button>
				<button onClick={() => handleTimeSetting(500)}>500 seconds</button>
			</div>
		</Modal>
	)
}

export default TimeSettingModal