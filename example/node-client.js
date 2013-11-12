var reconnect = require('reconnect/sock')
var rEdit = require('r-edit')
var fs = require('fs')
var host = 'localhost'

var edit = rEdit()
edit.on('update', update)

var file = 'blah.js'
var writing = false, waiting = false

function update () {
  if(writing) return waiting = true
  writing = true; waiting = false
  setTimeout(function () {
    console.log(edit.toJSON().join(''))
    fs.writeFile(file, edit.toJSON().join(''), function () {
      writing = null
      if(waiting) return update()
    })
  }, 1000)
}

reconnect(function (stream) {
  stream
    .pipe(edit.createStream())
    .on('data', console.log.bind(console))
    .pipe(stream)
}).connect('http://' +host+':3000/bed')
