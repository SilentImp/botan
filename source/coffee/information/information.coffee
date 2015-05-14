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
    @close_button = $ '.information__close'

    @map = $ '.information__map-wrapper'
    @map_container = $ '.information__map-full'
    @map_open_button = $ '.information__map'
    @map_close_button = $ '.information__close-map'

    @resizer()
    $(window).on 'resize', @resizer

    @open_button.on 'click', @open
    @close_button.on 'click', @close
    @lightbox.on 'click', @close
    @map_open_button.on 'click', @showMap
    @map_close_button.on 'click', @hideMap

    @location = new google.maps.LatLng(50.46117, 30.51004)
    @gm = new google.maps.Map @map.get(0),
      center: @location
      zoom: 16
      mapTypeControl: false
      panControl: true
      zoomControl: true
      scaleControl: true
      mapTypeId: google.maps.MapTypeId.ROADMAP

    @infowindow = new google.maps.InfoWindow
      content: '<h2 class="marker__title">bOtaN</h2><p class="marker__text">г. Киев, ул. Воздвиженская, 9-19</p>'

    @marker = new google.maps.Marker
      position: @location
      map: @gm
      title: 'bOtaN'

    @infowindow.open @gm, @marker

    google.maps.event.addListener @marker, 'click', =>
      @infowindow.open @gm, @marker

  showMap: =>
    @body.addClass 'info__map'
    @map_container.addClass 'visible'

  hideMap: (event)=>
    event.preventDefault()
    @body.removeClass 'info__map'
    @map_container.removeClass 'visible'

  open: =>
    event.preventDefault()
    @body.addClass 'info__popup'

    @close_button.css
      'display': 'block'

    @close_button.stop().animate
        'opacity': '1'
      ,
        'duration': @time

    @info.css
      'display': 'block'
      'width': '100%'

    @info.stop().animate
        'left': '0'
      ,
        'duration': @time

  close: (event)=>
    event.preventDefault()
    @body.removeClass 'info__popup'
    @close_button.stop().animate
        'opacity': '0'
      ,
        'duration': @time

    @info.stop().animate
        'left': '100%'
      ,
        'duration': @time
        'complete': @endHideMapAnimation

  endHideMapAnimation: =>
    @close_button.css
      'display': 'none'
    @info.css
      'display': 'none'
      'width': '0'


  resizer: =>
    @vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    max = Math.max .6625*@vh, 300

    @info.css
      'height': (max-80)+'px'
      'line-height': (max-80)+'px'

$(document).ready ->
  new Information

Modernizr.addTest 'mix-blend-mode', ()->
    return Modernizr.testProp 'mixBlendMode'

Modernizr.addTest 'background-blend-mode', ()->
    return Modernizr.testProp 'backgroundBlendMode'
