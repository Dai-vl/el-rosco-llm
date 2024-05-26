import { useEffect } from 'react'
import { PlayerStates } from '../utils/utils'

function LetterElement({ i, letter, state, isActive, playerState }) {
	//Calculate the angle for each letter element and the animation name
	const angle = 270 + i * 15
	const animationName = `activeLetter-${i}`
  
	//Animation for placing the letter and scaling it
	useEffect(() => {
		if(!isActive || playerState !== PlayerStates.PLAYING) 
			return
		const keyframes = `
			@keyframes ${animationName} {
				0% {
					background-color: #2995EA;
					transform: rotate(${angle}deg) translate(11em) rotate(${-angle}deg) scale(0.9);
				}
				50% {
					background-color: #94C6EC;
					transform: rotate(${angle}deg) translate(11em) rotate(${-angle}deg) scale(1.1);
				}
				100% {
					background-color: #2995EA;
					transform: rotate(${angle}deg) translate(11em) rotate(${-angle}deg) scale(0.9);
				}
			}
		`
		const styleElement = document.createElement('style')
		styleElement.appendChild(document.createTextNode(keyframes))
		document.head.appendChild(styleElement)

		return () => {
			document.head.removeChild(styleElement)
		}
	}, [isActive])
  
	const dynamicClass = playerState === PlayerStates.PLAYING ? 'active' : 'waiting'
  
	return (
		<li
			className = {dynamicClass}
			style = {{
				animation: isActive ? `${animationName} 1.5s infinite` : 'none',
				transform: isActive ? 'none' : `rotate(${angle}deg) translate(11em) rotate(-${angle}deg)`,
				backgroundColor: state === 0 ? '#2995EA' : state === 1 ? 'green' : '#DC3535'
			}}
		>
			{letter}
		</li>
	)
}

export default LetterElement