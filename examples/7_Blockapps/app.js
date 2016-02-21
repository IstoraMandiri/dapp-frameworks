var express = require('express');
var exphbs = require('express-handlebars');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');

var yaml = require('js-yaml');
var path = require('path');
var fs = require('fs');

var home = require('./app/routes/home.js');
var login = require('./app/routes/login.js');
var contract = require('./app/routes/contract.js');
var examples = require('./app/routes/examples.js');
var keys = require('./app/routes/keys.js');

var blocRootDir = path.normalize(path.join(__dirname, '..'));
var configFile = yaml.safeLoad(fs.readFileSync('config.yaml'));

var app = express();

app.use(logger('dev'));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use(session({
    resave: true, 
    saveUninitialized: true,
    secret: 'session-to-track-global-wallet-pass-in-memory', 
    cookie: { maxAge: 60000 }
    })
);

app.use('/', home);
app.use('/login', login);
app.use('/contracts', contract);
app.use('/examples', examples);
app.use('/keys', keys);

app.use('/static', express.static('app/static'));
app.use('/images', express.static('images'));

var server = app.listen(3000, 'localhost', function () {
  var host = server.address().address;
  var port = server.address().port;
  
  console.log('bloc is listening on http://%s:%s', host, port);
});
