import { useNavigate } from 'react-router-dom'

import AnimatedWheel from './components/AnimatedWheel'
import DarkMode from '../../commonComponents/DarkMode'

import './styles/HomePage.css'

function HomePage() {
	const history = useNavigate()

	const local = () => {
		history('/local')
	}

	const multi = () => {
		history('/multi')
	}

	const bot = () => {
		history('/bot')
	}
	
	const generarPreguntas = () => {
		history('/generateQuestions')
	}

	return (
		<div className = 'configuration'>
			<div className="dark-mode-container">
				<DarkMode />
			</div>
			<h1 className = 'title'>El Rosco LLM</h1>
			<AnimatedWheel/>
			<div className = 'configuration-buttons'>
				<button onClick = {local}>Local</button>
				<button onClick = {multi}>Multiplayer</button>
				<button onClick = {bot}>Bot</button>
			</div>
			<button onClick = {generarPreguntas}>Generate questions</button>
		</div>
	)
}

export default HomePage