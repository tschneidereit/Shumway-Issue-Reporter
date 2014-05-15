var express = require("express");
var pg = require("pg");
var url = require('url');
var app = express();
app.use(express.logger());

app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.post('/input', function(req, res) {
  var ua = req.headers['user-agent'].split(' ').pop();
  var params = req.query;
  res.render('input', {
    shumwayVersion: params.shubuild || 'n/a', 
    firefoxVersion: params.ffbuild || 'n/a',
    url: params.url || '',
    swf: params.swf || '',
    exceptions: req.body.exceptions});
});
app.post('/submit', function(req, res) {
  var params = req.body;
  var values = ['now', params.url, params.swf, 
                params.shumwayVersion, params.firefoxVersion, 
                params.email, params.description, params.exceptions];
  var columns = 'submission, pageUrl, swfUrl, shumwayVersion, firefoxVersion, email, ' +
                'description, exceptions';
  var query = 'INSERT INTO issues (' + columns + ') VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning *;';
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query(query, values, function(err, result) {
      done();
      if(err) {
        console.log(err);
        res.render('submit-error');
      } else {
        console.log(JSON.stringify(result));
        res.render('submit', {id: result.rows[0].id});
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
          var exceptions = result.rows[0].exceptions;
        try {
          exceptions = JSON.stringify(JSON.parse(exceptions), null, 2);
        } catch (e) {
          exceptions = 'no valid stacks';
        }
        result.rows[0].exceptions = exceptions;
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