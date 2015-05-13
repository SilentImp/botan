class Information
  constructor: ->
    @info = $ '.information'
    @lightbox = $ '.information__lightbox'

    if @info.length == 0 || @lightbox.length == 0
      delete @info
      delete @lightbox
      return

    @body = $ 'body'
    @open_button = @body.find '>header .info'
    @close_button = @info.find '.information__close'

    @resizer()
    $(window).on 'resize', @resizer

    @open_button.on 'click', @open
    @close_button.on 'click', @close
    @lightbox.on 'click', @close

  open: (event)=>
    event.preventDefault()
    @body.addClass 'info__popup'

  close: (event)=>
    event.preventDefault()
    @body.removeClass 'info__popup'

  resizer: =>
    @vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    console.log @vh

    max = Math.max .6625*@vh, 300

    @info.css
      'height': (max-80)+'px'
      'line-height': (max-80)+'px'

$(document).ready ->
  new Information

Modernizr.addTest 'mix-blend-mode', ()->
    return Modernizr.testProp 'mixBlendMode'
