import Question from './Question'
import '../styles/APInterface.css'

function APInterface({setPlay, trained, setTrained, generateQuestions, theme, setTheme, example, setExample, show, setShow, 
	llamadaActiva, juegoPreparado})
{
	const handleTheme = (event) => {
		setTheme(event.target.value)
	}

	const handleExample = (event) => {
		setExample(event.target.value)
	}

	const handleTrained = () => {
		if(!llamadaActiva)
			setTrained(prevState => (prevState + 1) % 2)
	}

	const initGame = () => {
		setPlay(true)
	}

	return(
		<div className = 'interface'>
			<form onSubmit = {generateQuestions} className = 'api_communication'>
				<div>
					<label>Write the theme: </label>
					<input
						type ='text'
						placeholder = ''
						value = {theme}
						onChange = {handleTheme}
						readOnly = {llamadaActiva}
					/>
				</div>
				<div>
					<label>Write the example: </label>
					<input
						type = 'text'
						placeholder = ''
						value = {example}
						onChange = {handleExample}
						readOnly = {llamadaActiva}
					/>
				</div>
				<div className = 'trained'>
					<label>Trained model</label>
					<input 
						type = 'checkbox'
						checked = {trained == 1}
						onChange = {handleTrained}
						readOnly = {llamadaActiva}
					/>
				</div>
				<button disabled = {llamadaActiva}>Generate questions</button>
			</form>
			<Question show = {show} setShow = {setShow}/>
			<button disabled = {!juegoPreparado} onClick = {initGame}>Play</button>
		</div>
	)
}

export default APInterface