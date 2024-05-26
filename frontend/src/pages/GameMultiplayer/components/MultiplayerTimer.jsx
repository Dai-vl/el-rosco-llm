import { useEffect, useState, useRef } from 'react'

import '../../../styles/Timer.css'

function MultiplayerTimer({initialTime, isActive, onTimerEnd, socket, local}){

	const [time, setTime] = useState(initialTime)
	const timeRef = useRef(time)

	useEffect(() => {
		timeRef.current = time
	}, [time])

	useEffect(() => {
		setTime(initialTime)
	}, [initialTime])

	useEffect(() => {
		let timer
		let socketTimer

		if (isActive && time > 0 && local) {
			timer = setInterval(() => {
				setTime(prevTime => {
					if (prevTime > 0) {
						return prevTime - 1
					}
					return prevTime
				})
			}, 1000)
		}

		socketTimer = setInterval(() => {
			if (isActive && local) {
				socket.emit('timeUpdate', timeRef.current)
			}
		}, 1000)

		return () => {
			clearInterval(timer)
			clearInterval(socketTimer)
		}
	}, [isActive])

	useEffect(() => {
		if(time === 0 && local === 1){
			console.log('Time\'s up!')
			onTimerEnd()
		}
	}, [time])

	return(
		<>
			<p className = 'time'>{time !== null && time !== undefined ? time : 'Loading...'}</p>
		</>
	)
}

export default MultiplayerTimer