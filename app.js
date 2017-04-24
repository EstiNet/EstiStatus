var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var mcping = require('mc-ping-updated');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

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
        mcping('example.com', 25565, function(err, res) {
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

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
