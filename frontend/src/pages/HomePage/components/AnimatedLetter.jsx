function AnimatedLetter({i, letter}){
	//Set the animation name
	const animationName = `animatedLetter-${i}`
	const state = Math.floor(Math.random() * 3)
  
	return (
		<li
			style={{
				backgroundColor: state === 0 ? '#2995EA' : state === 1 ? 'green' : '#DC3535',
				animation:`${animationName} 30s infinite linear`
			}}
		>
			{letter}
		</li>
	)
}

export default AnimatedLetter
