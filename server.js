#!/usr/bin/env node

const http = require('http');
const opn = require('opn');
var colors = require('colors');

var port = 8080;
var openBrowser = false;
var startServer = true;

for (var i = 2; i < process.argv.length; i++) {
  var option = process.argv[i];

  if (process.argv[i-1] == "--port" || process.argv[i-1] == "-p") {
    continue;
  }

  if (option == "--help" || option == "-h") {
    console.log([
      '',
      'Usage: node server.js [options]',
      '',
      '  -h, --help            Displays usage information',
      '  -p, --port <port>     Port to use. Default is 8080',
      '  -o, --open            Opens the browser if the server successfully starts.',
      ''
    ].join('\n'));
    startServer = false;
  }

  if (option == "--port" || option == "-p") {
    port = Number(process.argv[i+1]);
  }

  if (option == "--open" || option == "-o") {
    openBrowser = true;
  }
}

if (startServer == true) {
  var server = http.createServer(function(req, res) {
    res.write([
      'Server Started',
      'Port number: ' + port,
      'Open: ' + openBrowser,
    ].join('\n'));
    res.end();
  });

  var url = "http://localhost:" + port.toString();

  if (openBrowser == true) {
    opn(url, function(err) {
      if (err) throw err;
    });
  }

  console.log([
    "Server successfully started".green,
    "",
    "Your server is running at " + ("http://localhost:" + port).underline.cyan,
    "Press " + "Ctrl + C".grey + " to stop the server.",
    ""
  ].join('\n'));


  server.listen(port);

}
