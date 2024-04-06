const { Server } = require('socket.io');
const util = require('util');
const { SocketMappingCache, RunningCountryCache, VotingStatusesCache, CountriesCache, JudgesCache } = require('./cache');
const { SocketIOResponse } = require('./utils/responses');

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
                    SocketMappingCache.addSocketID(socket.id, credentials.judgeCode);
                });

                socket.on("disconnect", () => {
                    console.log("Disconnect " + socket.id);
                    SocketMappingCache.removeSocketID(socket.id);
                });                

                socket.on("nextCountry", (nextRunningCountry) => {
                    let runningOrder = nextRunningCountry.runningCountry;
                    RunningCountryCache.setRunningCountry(runningOrder);
                    
                    let nextCountry = CountriesCache.findCountryByRunningOrder(runningOrder);
                    VotingStatusesCache.setVotingStatuses([nextCountry.code], nextRunningCountry.votingStatus);
                    nextRunningCountry.country = nextCountry;

                    let data = {nextRunningCountry : nextRunningCountry};
                    let response = SocketIOResponse.create(data, "Next country is %s", nextCountry.name);
                    
                    io.sockets.emit("nextCountry", response.toJSON());
                });

                socket.on("votingStatus", (votingStatus) => {
                    VotingStatusesCache.setVotingStatuses(votingStatus.countries, votingStatus.status);
                    let messages = [];
                    votingStatus.countries.forEach(countryCode => {
                        let countryName = CountriesCache.findCountryNameByCode(countryCode);
                        let status = votingStatus.status;

                        let message = SocketIOResponse.createMessage("Voting status for %s is now %s", countryName, status);
                        // let text = util.format("Voting status for %s is now %s", countryName, status);
                        // let innerHTML = util.format("Voting status for <span>%s</span> is now <span>%s</span>", countryName, status);

                        messages.push(message.toJSON());
                    });
                    
                    let data = {votingStatus : {countries : votingStatus.countries, status : votingStatus.status}};
                    let response = new SocketIOResponse(data, messages, true);

                    socket.broadcast.emit("votingStatus", response.toJSON());
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
                let countryName = CountriesCache.findCountryNameByCode(countryCode);
                let judgeName = JudgesCache.findJudgeNameByCode(judgeCode);

                let data = {voting : {judgeCode: judgeCode, countryCode: countryCode, points: points, totalVotes : totalVotes}};
                let response = SocketIOResponse.create(data, "%s has voted %s points for %s", judgeName, points, countryName);

                this.getSocketIO().sockets.emit("votes", response.toJSON());
            },
        };
})();

module.exports = {SocketIO};