
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GameLocal from './pages/GameLocal'
import GameMultiplayer from './pages/GameMultiplayer'
import GenerateQuestions from './pages/GenerateQuestions'
import GameBot from './pages/GameBot'
import ErrorPage from './commonComponents/ErrorPage'

import './styles/App.css'


const App = () => {
  
	return (
		<>
			<Routes>
				<Route path="/" element={<HomePage />} errorElement={<ErrorPage/>}/>
				<Route path="/local" element={<GameLocal/>} errorElement={<ErrorPage/>}/>
				<Route path="/multi" element={<GameMultiplayer/>} errorElement={<ErrorPage/>} />
				<Route path="/bot" element={<GameBot/>} errorElement={<ErrorPage/>} />
				<Route path="/generateQuestions" element={<GenerateQuestions />} errorElement={<ErrorPage/>} />
			</Routes>
		</>
	)
}

export default App
