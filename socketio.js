const { Server } = require('socket.io');
const { runningCountry, setRunningCountry, setVotingStatuses } = require('./global');

const socketIOPort = process.env.SOCKETIO_PORT;

var SocketIO = (
    function () {
        var ioInstance = null;

        function createSocketIO() {
            var io = new Server(socketIOPort, {
                cors: {
                    origin: "*"
                }
            });

            io.on("connection", (socket) => {
                console.log("New connection");
                socket.emit("hi", "hello");
                

                socket.on("nextCountry", (nextRunningCountry) => {
                    setRunningCountry(nextRunningCountry.runningCountry);

                    socket.broadcast.emit("nextCountry", nextRunningCountry);
                });

                socket.on("votingStatus", (votingStatus) => {
                    setVotingStatuses(votingStatus.countries, votingStatus.status);

                    socket.broadcast.emit("votingStatus", votingStatus);
                })
            });

            return io;
        }

        return {
            getSocketIO: function () {
                if (ioInstance == null) {
                    ioInstance = createSocketIO();
                }
                return ioInstance;
            },
            sendVote: function(judgeCode, countryCode, points) {
                this.getSocketIO().sockets.emit("points", {judgeCode: judgeCode, countryCode: countryCode, points: points});
            },
        };
})();

module.exports = {SocketIO};