const { Server } = require('socket.io');

const socketIOPort = process.env.SOCKETIO_PORT;

var SocketIO = (
    function () {
        var io = null;

        function createSocketIO() {
            console.log("Creating new instance");
            var ioObject = new Server(socketIOPort, {
                cors: {
                    origin: "*"
                }
            });

            ioObject.on("connection", (socket) => {
                console.log("New connection");
                socket.emit("hi", "hello");
                

                socket.on("nextCountry", (arg) => {
                    socket.broadcast.emit("nextCountry", arg);
                });
            });

            return ioObject;
        }

        return {
            getSocketIO: function () {
                if (io == null) {
                    io = createSocketIO();
                }
                return io;
            },
            sendVote: function(points) {
                this.getSocketIO().sockets.emit("points", points);
            }
        };
})();

module.exports = {SocketIO};