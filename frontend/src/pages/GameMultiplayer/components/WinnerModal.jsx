import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { PlayerStates } from '../../../utils/utils'

import '../styles/WinnerModal.css'

function WinnerModal({player1State, player2State, questions1, questions2, player1Name, player2Name}){
	const history = useNavigate()

	const mainMenu = () => {
		history('/')
	}

	const determineWinner = () => {
		if(questions1.map(question => question.state).filter(item => (item === 1)).length > questions2.map(question => question.state).filter(item => (item === 1)).length)
			return player1Name + ' is the winner!!!'
		else if(questions1.map(question => question.state).filter(item => (item === 1)).length < questions2.map(question => question.state).filter(item => (item === 1)).length)
			return player2Name + ' is the winner!!!'
		else if(questions1.map(question => question.state).filter(item => (item === 2)).length < questions2.map(question => question.state).filter(item => (item === 2)).length)
			return player1Name + ' is the winner!!!'
		else if(questions1.map(question => question.state).filter(item => (item === 2)).length > questions2.map(question => question.state).filter(item => (item === 2)).length)
			return player2Name + ' is the winner!!!'
		else
			return 'Tie'
	}

	return(
		<Modal
			isOpen = {player1State === PlayerStates.END&& player2State === PlayerStates.END}
			onRequestClose = {() => {}}
			contentLabel = "Game finished"
		>
			<form className = 'winner-modal'  onSubmit = {mainMenu}>
				<h1>GAME FINISHED</h1>
				<h2>{determineWinner()}</h2>
				<table>
					<tr>
						<th></th>
						<th>Correct</th>
						<th>Incorrect</th>
						<th>Not answered</th>
					</tr>
					<tr>
						<th>{player1Name}</th>
						<th className = 'p1'>{((questions1.map(question => question.state).filter(item => (item === 1)).length)/24*100).toFixed()}%</th>
						<th className = 'p1'>{((questions1.map(question => question.state).filter(item => (item === 2)).length)/24*100).toFixed()}%</th>
						<th className = 'p1'>{((questions1.map(question => question.state).filter(item => (item === 0)).length)/24*100).toFixed()}%</th>
					</tr>
					<tr>
						<th>{player2Name}</th>
						<th className = 'p2'>{((questions2.map(question => question.state).filter(item => (item === 1)).length)/24*100).toFixed()}%</th>
						<th className = 'p2'>{((questions2.map(question => question.state).filter(item => (item === 2)).length)/24*100).toFixed()}%</th>
						<th className = 'p2'>{((questions2.map(question => question.state).filter(item => (item === 0)).length)/24*100).toFixed()}%</th>
					</tr>
				</table>
				<button>Main menu</button>
			</form>
		</Modal>
	)
}

export default WinnerModal