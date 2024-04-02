const { Server } = require('socket.io');
const util = require('util');
const { setRunningCountry, setVotingStatuses, findCountryCodeByRunningOrder, findCountryNameByCode, findJudgeNameByCode, addSocketID, removeSocketID } = require('./cache');

var SocketIO = (
    function () {
        var ioInstance = null;

        function createSocketIO(server) {
            var io = new Server(server, {
                cors: {
                    origin: "*"
                }
            });

            io.on("connection", (socket) => {
                console.log("New connection");
                socket.emit("hi", "hello");

                socket.on("connecting", (credentials) => {
                    console.log("Connecting " + socket.id + " with judge code " + credentials.judgeCode);
                    addSocketID(socket.id, credentials.judgeCode);
                });

                socket.on("disconnect", () => {
                    console.log("Disconnect " + socket.id);
                    removeSocketID(socket.id);
                });                

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
            getSocketIO: function (server = null) {
                if (ioInstance == null && server != null) {
                    ioInstance = createSocketIO(server);
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