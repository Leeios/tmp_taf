var idUser = 0;

exports.socket = function(socket) {

	socket.username = idUser.toString();
	console.log('User ' + idUser++ + ' connected');
	var address = socket.handshake.address;
	console.log("New connection from " + address.address + ":" + address.port);
	socket.on('player', function (message) {
		console.log('Client ' + socket.username + ' send :');
		console.log(message);
		socket.broadcast.emit('opp', {
			username: socket.username,
			message: message
		});
	});
}
