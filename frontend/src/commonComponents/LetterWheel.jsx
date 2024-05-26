import LetterElement from './LetterElement'
import { PlayerStates, Letters } from '../utils/utils'

import '../styles/LetterWheel.css'

function LetterWheel({playerState, questionsState, questionPos}) {
	return (
		<ul className = 'wheel'>
			{Letters.map((letter, index) => (
				<LetterElement 
					key = {letter} 
					i = {index} 
					letter = {letter} 
					state = {questionsState[index]} 
					isActive = {questionPos === index && playerState === PlayerStates.PLAYING}
					playerState = {playerState}
				/>
			))}
		</ul>
	)
}

export default LetterWheel