var express = require('express');
var app = express();

var options = {
  index: "index.html"
};

app.use('/', express.static('app', options));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('my app is listening at http://%s:%s', host, port);
});