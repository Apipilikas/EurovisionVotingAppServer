const { Server } = require('socket.io');
const { runningCountry, setRunningCountry, setVotingStatuses, findCountryCodeByRunningOrder } = require('./cache');

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
                    let runningOrder = nextRunningCountry.runningCountry;
                    setRunningCountry(runningOrder);
                    let nextCountryCode = findCountryCodeByRunningOrder(runningOrder);
                    
                    setVotingStatuses([nextCountryCode], nextRunningCountry.votingStatus);

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
            sendVote: function(judgeCode, countryCode, points, totalVotes) {
                this.getSocketIO().sockets.emit("votes", {judgeCode: judgeCode, countryCode: countryCode, points: points, totalVotes : totalVotes});
            },
        };
})();

module.exports = {SocketIO};