var express = require("express");
var url = require('url');
var app = express();
app.use(express.logger());

app.use(express.static(__dirname + '/public'));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get('/input', function(req, res) {
  var ua = req.headers['user-agent'].split(' ').pop();
  var params = url.parse(req.url, true).query;
  res.render('input', {
    shumwayVersion: params.shubuild || 'not specified', 
    firefoxVersion: params.ffbuild || 'not specified',
    url: params.url || '',
    swf: params.swf || ''});
});
app.put('/submit', function(request, response) {
  response.send('submit!');
});
app.get('/list', function(request, response) {
  response.send('List!');
});
app.get('/entry', function(request, response) {
  response.send('Entry!');
});

app.get('*', function(request, response) {
  response.send('Not found!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});