import '../styles/Question.css'

function Question({show, setShow}){
	const showAnswer = () => {
		setShow((prevState) => ({
			...prevState,
			show: true
		}))
	}
	return(
		<div className = 'questions'>
			<div className = 'letter'>
				<p>Letter: </p>
				<label>{show.letter}</label>
			</div>
			<div className = 'definition'>
				<p>{show.definition == '' ? 'Click on a blue letter to see the generated question' : 'Definition:'}</p>
				<p>{show.definition}</p>
			</div>
			<div className = 'show'>
				<button onClick = { showAnswer }>Show</button>
				<label>{show.show ? show.answer : ''}</label>
			</div>
		</div>
	)
}

export default Question