class book
  constructor: ->
    @book = $ '.book'
    if @book.length == 0
      return

    @next = @book.find '.book__next'
    @prev = @book.find '.book__prev'
    @pages = @book.find '.book__pages'
    @page = @pages.find '.book__page'
    @page_count = @page.length
    delete @page

    @position = 0
    @resizer()

    @next.on 'click', @moveNext
    @prev.on 'click', @movePrev

    $(window).on 'resize', @resizer

  resizer: =>
    if Modernizr.mq '(min-width: 1000px)'
      @step = 100
      @delimiter = Math.ceil @page_count/2
      @position = Math.floor(@position/100)*100
    else
      @delimiter = @page_count
      @step = 50
    @repos()

  moveNext: =>
    if @position == (@delimiter-1)*-100
      return
    @position-=100;

    if @position == (@delimiter-1)*-100
      @next.toggleClass 'book__next_disabled', true
    @prev.toggleClass 'book__prev_disabled', false
    @repos()

  movePrev: =>
    if @position == 0
      return
    @position+=100;
    if @position == 0
      @prev.toggleClass 'book__prev_disabled', true
    @next.toggleClass 'book__next_disabled', false
    @repos()

  repos: =>
    @pages.css 'left', @position+'%'



$(document).ready ->
  new book
