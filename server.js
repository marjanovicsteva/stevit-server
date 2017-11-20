#!/usr/bin/env node

const fs = require('fs');
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
  } else if (option == "--port" || option == "-p") {
    if (Number(process.argv[i+1]).toString() == "NaN") {
      port = Number(process.argv[i+1]);
      startServer = false;
      console.error("ERROR: Server failed to start".red);
      console.log("Invalid value for port.");
    } else {
      port = process.argv[i+1];
    }
  } else if (option == "--open" || option == "-o") {
    openBrowser = true;
  } else {
    console.error("Invalid option: " + option);
    console.log("Type `stevit-server --help` for more information about available options.");
    startServer = false;
  }
}

if (startServer == true) {
  var fileArray = [];
  var server = http.createServer(function(req, res) {
    var dir = fs.readdir(process.cwd(), function(err, list) {
      if (err) throw err;
      for (var i = 0; i < list.length; i++) {
        if (list[i].startsWith('.')) {}
        else {
          if (fileArray.indexOf(list[i]) === -1) {
            fileArray.push(list[i]);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('Meow'); // I just want to display anything at the point
            res.end();
          }

        }
      }
    });
    if (req.url.endsWith('.html') || req.url.endsWith('.htm')) {

      fs.readFile(req.url.substr(1), function(err, data) {
        if (err) throw err;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      })

    } else {
      res.write([
        'Server is up.',
        'Path: ' + process.cwd(),
        'Port: ' + port,
        'Open: ' + openBrowser
      ].join('\n'));
      res.end();
    }

  });

  var url = "http://localhost:" + port.toString();

  if (openBrowser == true) {
    opn(url, function(err) {
      if (err) throw err;
    });
  }

  server.listen(port, () => {
    console.log([
      "Server successfully started".green,
      "",
      "Your server is running at " + ("http://localhost:" + port).underline.cyan,
      "Press " + "Ctrl + C".grey + " to stop the server.",
      ""
    ].join('\n'));
  });

}
