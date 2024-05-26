export const PlayerStates = {
	PLAYING: '0',
	WAITING: '1',
	CHANGING: '2',
	END: '3'
}

export const Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'Z']

export const findValueFromArray = (array, targetValue, startIndex) => {
	const firstSearch = array.slice(startIndex).indexOf(targetValue)
	
	if(firstSearch !== -1) {
		return firstSearch + startIndex 
	}

	const secondSearch = array.slice(0, startIndex).indexOf(targetValue)
	if (secondSearch !== -1) {
		return secondSearch
	}
	
	return -1 // Value not found in the array
}