var mcping = require('mc-ping-updated');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var sockets = {};

var mcservers = [{name: "BungeeCord", ip: "localhost", port: "25565", state: "off", players: "0"},
                 {name: "Hub", ip: "internal.estinet.net", port: "25400", state: "off", players: "0"},
                 {name: "Minigame Hub", ip: "internal.estinet.net", port: "25450", state: "off", players: "0"},
                 {name: "Survival", ip: "internal.estinet.net", port: "8100", state: "off", players: "0"},
                 {name: "Creative", ip: "internal.estinet.net", port: "8101", state: "off", players: "0"},
                 {name: "Factions", ip: "internal.estinet.net", port: "8102", state: "off", players: "0"},
                 {name: "Skyblock", ip: "internal.estinet.net", port: "8103", state: "off", players: "0"},
                 {name: "gWars", ip: "internal.estinet.net", port: "8104", state: "off", players: "0"},
                 {name: "Development", ip: "internal.estinet.net", port: "8105", state: "off", players: "0"},
                 {name: "Survival2", ip: "dolphinbox.net", port: "25500", state: "off", players: "0"}];
var web = "https://estinet.net";

setInterval(checkStatus, 5000);
function checkStatus(){
    mcservers.forEach(function(data, index){
        mcping(data.ip, parseInt(data.port), function(err, res) {
            //console.log(err + " " + res + " " + data.ip + " " + data.port + " " + index);
            if (err) {
                mcservers[index].state = "off";
            } else {
                mcservers[index].state = "on";
                mcservers[index].players = res.players.online;
            }
        }, 3000);
    });

    console.log(mcservers);
}
app.use(express.static('views'));
app.use(function(req, res, next){
    console.log('[ERROR] Client error 404');
    res.sendFile(__dirname + '/views/404.html');
});

//Socket.io
io.on('connection', function(socket){
    console.log('[INFO] New Socket.io client connection.');
    socket.emit('data', mcservers);
    sockets[socket.id] = socket;
});
io.on('disconnect', function(socket){
    delete sockets[socket.id];
});


server.listen(80);