/*******************************************
** Author: Zach Reed
** Description: ESO database server
********************************************/
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express(); // returns application
var handlebars = require('express-handlebars').create({defaultLayout:'main'}); // default .handlebars in view to main
app.engine('handlebars', handlebars.engine); // app.engine(ext, callback) renders template callback as ext
app.use(bodyParser.urlencoded({extended:true})); // see https://www.npmjs.com/package/body-parser

app.use('/static', express.static('public')); // directory for static files
app.set('view engine', 'handlebars'); // file ext set to .handlebars
app.set('port', 7660); // set port
app.set('mysql', mysql);

// handlebar pages with respective js file to render
app.use('/r_browse', require('./r_browse.js'));
app.use('/q_browse', require('./q_browse.js'));
app.use('/c_browse', require('./c_browse.js'));
app.use('/a_browse', require('./a_browse.js'));		
app.use('/qc_browse', require('./qc_browse.js'));
app.use('/', express.static('public')); 
				
app.get('/home',function(req, res){ // check for get load
	var context = {};
	res.render('home', context);
});				
				
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});