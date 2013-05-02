
var tokenize = require('js-tokenizer')
var h        = require('hyperscript')
var a        = require('adiff')
var splice   = require('element-splice')

module.exports = function () {
  var ta, cursor = h('span.cursor', {style: {
    position: 'absolute'
  }}, '_')

  var pre = h('pre.code', {onclick: function () {
      ta.focus()
    },
    style: {
      //not sure why this doesn't work...
      //  position:'absolute',
      //  left: '0px', top: '0px',
      //  width: '100%', height: '100%',
      overflow: 'auto',
      //this works, but then I don't know where to put the cursor.
      //      'white-space': 'pre-wrap'
      //so, currently there is no wrapping...
    }
  }, cursor)

  function move () {
    var rect = cursor.getBoundingClientRect()
    var lines = ta.value.substring(0, ta.selectionEnd).split('\n')
    var last = lines.length - 1

    var computed = getComputedStyle(pre)
    cursor.style.top = parseInt(computed['padding-top'])
      + (last * rect.height) + 'px'

    cursor.style.left = parseInt(computed['padding-left'])
      + (lines[last].length * rect.width) + 'px'

    ;['font-size',
      'padding-top',
      'padding-left',
      'padding-right',
      'padding-bottom'
    ].forEach(function (e) {
      ta.style[e] = computed[e]
    })

    //obviously, doing stuff like this everytime you press a button is pretty dumb.
    //fix later!
    var lines = ta.value.split('\n')
    var height = lines.length
    var width  = lines.sort(function (a, b) { return b.length - a.length }).shift().length

    var h = Math.max(height * rect.height, 400)
    var w = Math.max(width * rect.width  , rect.width*80)

    pre.style.height = h + 'px'
    pre.style.width  = w  + 'px'
    ta.style.height = h + 'px'
    ta.style.width  = w  + 'px'
 }

  var prev = []
  function update () {
    pre.removeChild(cursor)

    //this is an improvement on what it was like before.
    //still, maybe there is a faster way to detect what has been typed?
    //hmm, compare the selection start,end from lasttime!
    var tokens = tokenize(ta.value || '', true)
    var patch = a.diff(prev, tokens)

    patch.forEach(function (p) {
      p = p.slice(0, 2).concat(p.slice(2).map(function (e) {
        return h('span.'+tokenize.type(e), e)
      }))

      splice(pre, p)
    })

    pre.appendChild(cursor)
    prev = tokens
    move()
  }

  ta = h('textarea.code', {
    oninput: update,
    onkeydown: move,
    onkeyup: move,
    onclick: move,
    style: {
     'z-index'     : 1
    , position     : 'absolute'
    , background   : 'transparent'
    , color        : 'transparent'
    , 'font-family': 'monospace'
    , margin       : '0px'
    , padding      : '0px'
    , border      : 'none'
    , 'font-size'  : getComputedStyle(pre)['font-size']
    , resize: 'none'
    , left: '0px', top: '0px'
    },
    wrap: 'off'
  })

  process.nextTick(update)

  //default highlighting. move this to a css file...
  var style = h('style',
    '.punct               {color: grey}'
  , '.string1, .string2   {color: yellow}'
  , '.number              {color: orange}'
  , '.keyword             {color: green}'
  , '.comment1, .comment2 {color: blue}'
  , '.regexp              {color: lightblue}'
  , '.invalid             {background: red}'
  , '.name                {color: #ccc}'
  , '.code                {background: #333; padding: 10px}'
  , '.cursor              {background: hsla(0, 0%, 100%, 0.5)}'
  )

  return h('div',  pre, ta, style,  
    {style: {
      position: 'relative',
    }}
  )
}

