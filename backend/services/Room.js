class Room {
	constructor(name) {

			const maxPlayers = 2;
			this.name = name;
			this.players = [];
			this.time = null;
			this.maxPlayers = maxPlayers;
			this.currentPlayer = null;
			this.scores = {};
			this.fails = {};
			this.names = {};
	} 

	addPlayer(socket, playerName) {
			this.players.push(socket);
			socket.join(this.name);
			this.scores[socket.id] = 0;
			console.log(socket.id, 'has joined the room', this.name);
			this.fails[socket.id] = 0;
			this.names[socket.id] = playerName;

			if (this.players.length === this.maxPlayers) {
				console.log('Nombre jugadores',this.names)
        this.players.forEach(player => {
            player.emit('fullRoom', 'The room is now full');
						console.log("room llena")
            // Enviar el nombre del otro jugador a cada jugador
            const otherPlayerId = this.players.find(p => p.id !== player.id).id;
            player.emit('otherPlayerName', this.names[otherPlayerId]);
						console.log('otherPlayerName: ', this.names[otherPlayerId])
        });
    	}
	}

	setTimeAndFirstPlayer(time) {
			this.time = time;
			this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)];
			console.log('Jugador actual: ', this.currentPlayer.id);

			this.players.forEach(player => player.emit('timeSet', time, this.currentPlayer.id));
	}

	sendQuestions(questions, senderId) {
    this.players
        .filter(player => player.id !== senderId)
        .forEach(player => { 	
					console.log(`Sending questions to player with id: ${player.id}`);
					player.emit('receiveQuestions', questions);
			});

	}

	changeTurn(){
			this.currentPlayer = this.players.find(player => player.id !== this.currentPlayer.id);
			console.log('Jugador actual: ', this.currentPlayer.id);
			this.players.forEach(player => player.emit('turnChanged', this.currentPlayer.id));
	}

	changeQuestionPos(newQuestionPos, senderId){
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('questionPosChanged', newQuestionPos));
	}

	wrongAnswer(questionPos,realAnswer, senderId){
			this.fails[senderId] += 1;
			console.log(this.fails[senderId])
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('wrongAnswerReceived', questionPos, realAnswer));
	}

	correctAnswer(questionPos,answer, senderId){
		console.log(senderId, 'has answered correctly')
			this.scores[senderId] += 1;
			console.log("ids: " + this.players.map(player => player.id));
			console.log("senderId: " + senderId);
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('correctAnswerReceived', questionPos, answer));
			
	}

	timeUpdate(time, senderId){
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('timeUpdated', time));
	}

	closeWrongAnswerModal(senderId){
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('closeWrongAnswerModalReceived'));
	}

	playerEnd(senderId){
			this.players
					.filter(player => player.id !== senderId)
					.forEach(player => player.emit('playerEnded'));
	}

	endGame(){
		const winner = this.getHighestScorer();
    this.players.forEach(player => player.emit('gameEnded', winner));
	}
	
	getHighestScorer() {
		const playerIds = Object.keys(this.scores);
    const player1Id = playerIds[0];
    const player2Id = playerIds[1];

    if (this.scores[player1Id] > this.scores[player2Id]) {
        // El jugador 1 tiene más aciertos
        return player1Id;
    } 
		else if (this.scores[player1Id] < this.scores[player2Id]) {
        // El jugador 2 tiene más aciertos
        return player2Id;
        
				// Los jugadores tienen el mismo número de aciertos, comprobar los fallos
    } 
		else if (this.fails[player1Id] < this.fails[player2Id]){
            // El jugador 1 tiene menos fallos
            return player1Id;
		}
    else if (this.fails[player1Id] > this.fails[player2Id]) {
            // El jugador 2 tiene menos fallos
            return player2Id;
  	}
		else {
            return 'Empate';
    }
	}	

	removePlayer(socketId) {
    const otherPlayer = this.players.find(player => player.id !== socketId);
    this.players = this.players.filter(player => player.id !== socketId);

    // Si hay otro jugador, emitir un evento para informarle que el otro jugador ha dejado la partida
    if (otherPlayer) {
        otherPlayer.emit('otherPlayerLeft');
    }
	}

	isEmpty() {
		return this.players.length === 0;
	}

	isFull() {
		return this.players.length === this.maxPlayers;
	}
}

export default Room;