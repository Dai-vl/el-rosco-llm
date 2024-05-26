import GenerateWheelLetter from './GenerateWheelLetter'
import { Letters } from '../../../utils/utils'
import '../styles/GenerateWheel.css'

function GenerateWheel({questions, setShow}) {
	return (
		<ul className = 'generate-wheel'>
			{Letters.map((letter, index) => (
				<GenerateWheelLetter 
					key = {letter}
					i = {index}
					letter = {letter}
					question = {questions[index]}
					setShow = {setShow}
				/>
			))}
		</ul>
	)
}




export default GenerateWheel