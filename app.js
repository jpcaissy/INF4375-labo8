/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , MongoClient = require('mongodb').MongoClient
  , wiki = require('./routes/wiki')
  , format = require('util').format;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/wikis', wiki.findAll);
app.get('/wiki/:id', wiki.findById);
app.get('/wiki/:title', wiki.findByTitle);
app.post('/wiki', wiki.addWiki);
app.put('/wiki/:id', wiki.updateWiki);
app.delete('/wiki/:id', wiki.deleteWiki);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
