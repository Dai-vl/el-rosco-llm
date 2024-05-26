	// socketHandler.js

	import logger from '../utils/logger.js';
	import Room from './Room.js';

	const socketHandler = (io) => {

			const rooms = {};
			const socketRoom = {};

			io.on('connection', (socket) => {
					logger.info('New connection');

					socket.emit('connected', 'Welcome to the chat!');

					socket.on('newRoom', (roomName,  playerName) => {    
							logger.info(`Creating new room: ${roomName}`);
							let room = rooms[roomName];
							console.log(room)
							if(!room){
								room = new Room(roomName, 2);
								rooms[roomName] = room;
							}
							room.addPlayer(socket, playerName);
							socketRoom[socket.id] = room;
							logger.info(`New room created: ${roomName}`);
							console.log(rooms)
					});

					socket.on('joinRoom', (roomName, playerName) => {
							logger.info(`Joining room: ${roomName}`);
							let room = rooms[roomName];

							if(!room){
								room = new Room(roomName, 2);
								rooms[roomName] = room;
							}

							if(room.isFull()){
									socket.emit('roomCapacityReached', 'The room has reached its capacity');
									return;
							}
							room.addPlayer(socket, playerName);
							socketRoom[socket.id] = room;
							logger.info(`Joined room: ${roomName}`);
					});

					socket.on('setTime', ({time}) => {
							logger.info(`Setting time to: ${time}`);
							const room = socketRoom[socket.id];
							room.setTimeAndFirstPlayer(time);
					});

					socket.on('sendQuestions', (questions) => {
						logger.info(`Sending questions`);
						const room = socketRoom[socket.id];
						room.sendQuestions(questions, socket.id);
					});

				socket.on('changeTurn', () => {
						logger.info(`Changing turn`);
						const room = socketRoom[socket.id];
						room.changeTurn();
				});

				socket.on('changeQuestionPos', newQuestionPos => {	
						logger.info(`Changing question position`);
						const room = socketRoom[socket.id];
						room.changeQuestionPos(newQuestionPos, socket.id);
				});

				socket.on('wrongAnswer', (questionPos, realAnswer) => {
						logger.info(`Wrong answer`);
						const room = socketRoom[socket.id];
						room.wrongAnswer(questionPos,realAnswer, socket.id);
				});

				socket.on('correctAnswer', (questionPos, answer) => {
						logger.info(`Correct answer`);
						const room = socketRoom[socket.id];
						room.correctAnswer(questionPos,answer,socket.id);
				});

				socket.on('timeUpdate', (time) => {
						logger.info(`Time update to: ${time}`);
						const room = socketRoom[socket.id];
						room.timeUpdate(time, socket.id);
				});

				socket.on('closeWrongAnswerModal', () => {
						logger.info(`Closing wrong answer modal`);
						const room = socketRoom[socket.id];
						room.closeWrongAnswerModal(socket.id);
				});

				socket.on('playerEnd', () => {
						logger.info(`Player ended`);
						const room = socketRoom[socket.id];
						room.playerEnd(socket.id);
				});

				socket.on('endGame', () => {
						logger.info(`Game ended`);
						const room = socketRoom[socket.id];
						room.endGame();
				});

				socket.on('disconnect', () => {
						logger.info('User disconnected');
						const room = socketRoom[socket.id];
						if (room) {
								room.removePlayer(socket.id);
								if (room.isEmpty()) {
									console.log('Deleting room')
										delete rooms[room.name];
								}
						}
				});

			}); 

			io.on('connect_error', (error) => {
					logger.error(`Connection error: ${error}`);
			});
	}

	export default socketHandler;