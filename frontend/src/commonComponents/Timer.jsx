import { useEffect, useState } from 'react'

import '../styles/Timer.css'

function Timer({initialTime, isActive, onTimerEnd}){
	const [time, setTime] = useState(initialTime) 
	useEffect(() => {
		let timer
	
		if (isActive && time > 0) {
			timer = setInterval(() => {
				setTime(prevTime => {
					if (prevTime > 0) {
						return prevTime - 1
					}
					return prevTime
				})
			}, 1000)
		}

		if(time === 0){
			clearInterval(timer)
			onTimerEnd()
		}
	
		return () => {
			clearInterval(timer)
		}
	}, [time, isActive])

	return(
		<>
			<p className = 'time'>{time !== null && time !== undefined ? time : 'Loading...'}</p>
		</>
	)
}

export default Timer