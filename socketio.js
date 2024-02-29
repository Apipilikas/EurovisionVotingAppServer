const { Server } = require('socket.io');
const util = require('util');
const { runningCountry, setRunningCountry, setVotingStatuses, findCountryCodeByRunningOrder, findCountryNameByCode, findJudgeNameByCode } = require('./cache');

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
                    let nextCountryName = findCountryNameByCode(nextCountryCode);
                    setVotingStatuses([nextCountryCode], nextRunningCountry.votingStatus);
                    
                    nextRunningCountry.runningCountryCode = nextCountryCode;
                    nextRunningCountry.message = {};
                    nextRunningCountry.message.text = util.format("Next country is %s", nextCountryName);
                    nextRunningCountry.message.innerHTML = util.format("Next country is <span>%s</span>", nextCountryName);
                    
                    socket.broadcast.emit("nextCountry", nextRunningCountry);
                });

                socket.on("votingStatus", (votingStatus) => {
                    setVotingStatuses(votingStatus.countries, votingStatus.status);
                    votingStatus.messages = [];
                    votingStatus.countries.forEach(countryCode => {
                        let countryName = findCountryNameByCode(countryCode);
                        let status = votingStatus.status;

                        let text = util.format("Voting status for %s is now %s", countryName, status);
                        let innerHTML = util.format("Voting status for <span>%s</span> is now <span>%s</span>", countryName, status);

                        votingStatus.messages.push({text : text, innerHTML : innerHTML});
                    });
                    
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
                let countryName = findCountryNameByCode(countryCode);
                let judgeName = findJudgeNameByCode(judgeCode);

                let text = util.format("%s has voted %s points for %s", judgeName, points, countryName);
                let innerHTML = util.format("<span>%s</span> has voted <span>%s</span> points for <span>%s</span>", judgeName, points, countryName);
                let message = {text : text, innerHTML : innerHTML};

                this.getSocketIO().sockets.emit("votes", {judgeCode: judgeCode, countryCode: countryCode, points: points, totalVotes : totalVotes, message : message});
            },
        };
})();

module.exports = {SocketIO};