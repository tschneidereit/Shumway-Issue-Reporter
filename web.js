var express = require("express");
var pg = require("pg");
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
    shumwayVersion: params.shubuild || 'n/a', 
    firefoxVersion: params.ffbuild || 'n/a',
    url: params.url || '',
    swf: params.swf || ''});
});
app.get('/submit', function(req, res) {
  var params = url.parse(req.url, true).query;
  var values = [0, 'now', params.url, params.swf, 
                params.shumwayVersion, params.firefoxVersion, 
                params.email, params.description];
  var query = 'INSERT INTO issues VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, values, function(err, result) {
      done();
      if(err) {
        console.log(err);
        res.render('submit-error');
      } else {
        res.render('submit');
      }
    });
  });
});
app.get('/list', function(req, res) {
  var query = 'SELECT * FROM issues;';
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, function(err, result) {
      done();
      if(err) {
        console.log(err);
        res.render('list-error');
      } else {
        console.log(JSON.stringify(result));
        res.render('list', {entries:result.rows});
      }
    });
  });
});
app.get('/entry/:id', function(req, res) {
  var query = 'SELECT * FROM issues WHERE id=$1;';
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, [req.params.id], function(err, result) {
      done();
      if(err) {
        console.log(err);
        res.render('entry-error');
      } else {
        console.log(JSON.stringify(result.rows));
        res.render('entry', {entry:result.rows[0], stylesDir: '../style/'});
      }
    });
  });
});

app.get('*', function(request, response) {
  response.send('Not found!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});