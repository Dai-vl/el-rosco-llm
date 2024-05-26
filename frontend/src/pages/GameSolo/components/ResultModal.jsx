/* eslint-disable indent */
import { useNavigate } from 'react-router-dom'
import Modal from 'react-modal'

import { PlayerStates} from '../../../utils/utils'

import '../styles/ResultModal.css'

function ResultModal({playerState, questions, theme}) {
	const history = useNavigate()

	const mainMenu = () => {
		history('/')
	}

	return(
		<Modal
			isOpen = {playerState === PlayerStates.END}
			onRequestClose = {() => {}}
			contentLabel = "Fin del juego"
		>
			<form className = 'result-modal' onSubmit = {mainMenu}>
				<h1>Game finished </h1>
                <p>- Theme: {theme == '' ? 'General culture' : theme}</p>
				<p className = 'correct'>- Correct questions: <span>{questions.filter((obj) => obj.state === 1).length}/24</span></p>
				<p className = 'incorrect'>- Incorrect questions: <span>{questions.filter((obj) => obj.state === 2).length}/24</span></p>
				<p className = 'unanswered'>- Unaswered questions: <span>{questions.filter((obj) => obj.state === 0).length}/24</span></p>
				<button>Main menu</button>
			</form>
		</Modal>
	)
}

export default ResultModal