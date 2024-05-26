import { Letters } from '../../../utils/utils'

function GenerateWheelLetter({ i, letter, question, setShow}) {
	const onClick = () => {
		if(question.state === 0)
			return
		setShow({
			letter: Letters[i],
			definition: question.definition,
			answer: question.answer,
			show: false
		})
	}
	
	//Calculate the angle for each letter element and the animation name
	const angle = 270 + i * 15
	return (
		<li
			style = {{
				transform: `rotate(${angle}deg) translate(13em) rotate(-${angle}deg)`,
				backgroundColor: question.state === 0 ? 'gray' : '#2995EA'
			}}
			onClick = {onClick}
		>
			{letter}
		</li>
	)
}

export default GenerateWheelLetter