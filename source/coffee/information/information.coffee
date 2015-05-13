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

  open: (event)=>
    event.preventDefault()
    @body.addClass 'info__popup'

  close: (event)=>
    event.preventDefault()
    @body.removeClass 'info__popup'

  resizer: =>
    @vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    max = Math.max .6625*@vh, 340

    @info.css
      'min-height': max+'px'
      'line-height': max+'px'

$(document).ready ->
  new Information

Modernizr.addTest 'mix-blend-mode', ()->
    return Modernizr.testProp 'mixBlendMode'
