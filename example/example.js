var reconnect = require('reconnect')
var rEdit = require('r-edit')
var r = require('../')()
var editor = new rEdit()

document.body.appendChild(r)
editor.on('update', console.log.bind(console))
var ta = r.querySelector('textarea')
ta.focus()
editor.wrap(ta)

reconnect(function (stream) {
  stream.pipe(editor.createStream()).pipe(stream)
}).connect('/bed')
