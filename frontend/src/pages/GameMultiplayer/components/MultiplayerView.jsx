import LocalPlayer from './LocalPlayer'
import MultiplayerPlayer from './MultiplayerPlayer'
import TimeSettingModal from './TimeSettingModal'
import { PlayerStates } from '../../../utils/utils'

import '../styles/MultiplayerView.css'
import { useEffect } from 'react'
import WinnerModal from './WinnerModal'

const MultiplayerView = ({ 
	socket,
	roomID,
	mode,
	time,
	playerName,
	playerState,
	setPlayerState,
	otherPlayerName,
	otherPlayerState,
	setOtherPlayerState,
	questionPos,
	questions,
	setQuestions,
	otherQuestions,
	otherRightAnswer,
	otherTimer,
	otherWAmodalOpen,
	setOtherWAmodalOpen
}) => {


	const changeTurn = (lastPlayerState) => {
		if(otherPlayerState != PlayerStates.END){
			socket.emit('changeTurn', { roomID  })
		}
		else if(lastPlayerState === PlayerStates.END){ 
			socket.emit('endGame')
		}

		else if (lastPlayerState === PlayerStates.CHANGING){
			setPlayerState(PlayerStates.PLAYING)
		}
	}

	useEffect	(() => {
	},[otherQuestions]
	)

	return (
		<>
			{time === null 
				? (mode === 'new'  
					? <TimeSettingModal socket={socket} />
					: <h1>Esperando a que el anfitrión establezca el tiempo</h1>)
				: !otherQuestions
					? <h1>Cargando preguntas...</h1>
					: <>
						<LocalPlayer
							initialTime={time}
							playerName={playerName}
							playerState={playerState}
							setPlayerState={setPlayerState}
							changeTurn={changeTurn}
							questions={questions}
							setQuestions={setQuestions}
							socket={socket}
						/>
						<MultiplayerPlayer
							playerName={otherPlayerName}
							playerState={otherPlayerState}
							questions={otherQuestions}
							questionPos={questionPos}
							time={otherTimer}
							otherRightAnswer={otherRightAnswer}
							onPlayerEnd={() => setOtherPlayerState(PlayerStates.END)}
							socket={socket}
							otherWAmodalOpen={otherWAmodalOpen}
							setOtherWAmodalOpen={setOtherWAmodalOpen}
						/>
						<WinnerModal
							player1State={playerState}
							player2State={otherPlayerState}
							questions1={questions}
							questions2={otherQuestions}
							player1Name={playerName}
							player2Name={otherPlayerName}
						/>
					</>
			}
		</>
	)
}

export default MultiplayerView