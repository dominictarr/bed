
var shoe = require('shoe')
var ecstatic = require('ecstatic')
var http = require('http')

var rEdit = require('r-edit')

var r = new rEdit()

shoe(function (stream) {
  stream.on('data', console.log)
  stream.pipe(r.createStream()).pipe(stream)
}).install(
  http.createServer(ecstatic(__dirname)).listen(3000)
, '/bed')

