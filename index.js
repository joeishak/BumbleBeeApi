let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let app = express();
let router = require('./router.js');
let mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:27017/auth');
//App Set Up
app.use(morgan('combined'));
app.use(bodyParser.json({typer:'*/*'}));
// Setting the headers for all routes to be CORS compliant
app.use(function(req,res,next) {
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");
res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
next();
});
router(app);

//Server Setup
const port = process.env.PORT || 3090;
let server = http.createServer(app);
server.listen(port);
console.log('Server listening on port',port);
