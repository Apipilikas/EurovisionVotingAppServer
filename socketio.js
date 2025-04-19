const { Server } = require('socket.io');
const { SocketMappingCache } = require('./cache');
const { SocketIOResponse } = require('./utils/responses/socketioResponse');
const { votingSchema } = require('./schemas/votingSchema');

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
                    //  Check if is admin
                    let runningOrder = nextRunningCountry.runningCountry;
                    votingSchema.runningCountry = runningOrder;
                    
                    let countryRecord = votingSchema.countryModel.records.findByFieldName("runningOrder", runningOrder);
                    if (countryRecord != null) {
                        countryRecord.setValue("votingStatus", nextRunningCountry.votingStatus);
    
                        let data = {nextRunningCountry : countryRecord.serializeForDisplay()};
                        let response = SocketIOResponse.create(data, "Next country is %s", countryRecord.getValue("name"));
                        
                        io.sockets.emit("nextCountry", response.toJSON());
                    }
                });

                socket.on("votingStatus", (votingStatus) => {
                    let countryRecord = votingSchema.countryModel.records.findByPrimaryKey(votingStatus.countryCode);
                    countryRecord.setValue("votingStatus", votingStatus.votingStatus);
                    countryRecord.acceptChanges();
                    
                    let data = {votingStatus : votingStatus.votingStatus, country : countryRecord.serializeForDisplay()};
                    let response = SocketIOResponse.create(data, "Voting status for %s is now %s", countryRecord.getValue("name"), votingStatus.status);

                    socket.broadcast.emit("votingStatus", response.toJSON());
                });

                socket.on("general", (generalResponse) => {
                    let response = SocketIOResponse.create(generalResponse, generalResponse.message);
                    
                    socket.broadcast.emit("general", response.toJSON());
                });
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
            sendVote: function(judgeRecord, countryRecord, points) {
                let countryName = countryRecord.getValue("name");
                let judgeName = judgeRecord.getValue("name");

                let data = {voting : {judge: judgeRecord.serializeForDisplay(), country: countryRecord.serializeForDisplay(), points: points}};
                let response = SocketIOResponse.create(data, "%s has voted %s points for %s", judgeName, points, countryName);

                this.getSocketIO().sockets.emit("votes", response.toJSON());
            },
        };
})();

module.exports = {SocketIO};