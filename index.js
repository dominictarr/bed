
var tokenize = require('js-tokenizer')
var h           = require('hyperscript')

module.exports = function () {
  var ta, cursor = h('span.cursor', {style: {position: 'absolute'}}, '_')
  var pre = h('pre.code', {onclick: function () {
      ta.focus()
    },
    style: {
      overflow: 'auto',
      //this works, but then I don't know where to put the cursor.
      //      'white-space': 'pre-wrap'
      //so, currently there is no wrapping...
    }
  }, cursor)

  function move () {
    var rect = cursor.getBoundingClientRect()
    var lines = ta.value.substring(0, ta.selectionStart).split('\n')
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
    var lines = ta.value.split('\n')
    var height = lines.length
    var width  = lines.sort(function (a, b) { return b.length - a.length }).shift().length
    //ta.rows = Math.max(height - 1, 1)
    //ta.cols = Math.max(width - 1, 1)

    console.log(height, width)

    pre.style.height = height * rect.height + 'px'
    pre.style.width  = width * rect.width  + 'px'
    ta.style.height = height * rect.height + 'px'
    ta.style.width  = width * rect.width  + 'px'
 }

  function update () {
    pre.innerHTML = ''
    pre.appendChild(cursor)
    tokenize(this.value || '', true).forEach(function (e) {
      pre.appendChild(h('span.'+tokenize.type(e), e))
    })
    move()
  }

  ta = h('textarea', {
    oninput: update,
    onkeydown: move,
    onkeyup: move,
    style: {
     'z-index'     : 1
    , position     : 'absolute'
    , background   : 'transparent'
    , color        : 'transparent'
    , 'font-family': 'monospace'
    , margin       : '0px'
    , padding      : '0px'
    , -border      : 'none'
    , 'font-size'  : getComputedStyle(pre)['font-size']
    , resize: 'none'
    },
    wrap: 'off'
  })

  update.call(ta)

  //default highlighting. move this to a css file...
  var style = h('style',
    '.punct               {color: grey}'
  , '.string1, .string2   {color: yellow}'
  , '.number              {color: orange}'
  , '.keyword             {color: green}'
  , '.comment1, .comment2 {color: blue}'
  , '.regexp              {color: purple}'
  , '.invalid             {background: red}'
  , '.name                {color: #ccc}'
  , '.code                {background: #333; padding: 10px}'
  , '.cursor              {background: hsla(0, 0%, 100%, 0.5)}'
  )

  return h('div', style, ta, pre,  {style: {position: 'relative'}})
}
