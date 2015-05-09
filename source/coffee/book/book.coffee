class book
  constructor: ->
    @book = $ '.book'
    if @book.length == 0
      return

    @next = @book.find '.book__next'
    @next_text = @next.find 'span'
    @prev = @book.find '.book__prev'
    @prev_text = @prev.find 'span'

    @pages = @book.find '.book__pages'
    @page = @pages.find '.book__page'
    @page_count = @page.length
    delete @page

    @page_number = 0
    @position = 0
    @resizer()
    @buttonText()

    @touch = $('html').hasClass 'touch'
    @toucher = null

    if @touch
      @toucher = new Hammer(@book[0])
      @toucher.on 'swipeleft', @moveNext
      @toucher.on 'swiperight', @movePrev
    else
      @next.on 'click', @moveNext
      @prev.on 'click', @movePrev

    $(window).on 'resize', @resizer

  resizer: =>
    if Modernizr.mq '(min-width: 1000px)'
      if @step == 50
        @step = 100
        @delimiter = Math.ceil @page_count/2
        @position = Math.floor(@position/100)*100
    else
      @delimiter = @page_count
      @step = 50

    @repos()

  buttonText: =>
    @prev_text.text(NumberToWords(@page_number-1));
    @next_text.text(NumberToWords(@page_number+(@step/50)));

  moveNext: =>
    if @position == (@delimiter-1)*-100
      return
    @position-=100;
    @page_number++;

    if @position == (@delimiter-1)*-100
      @next.toggleClass 'book__next_disabled', true

    @prev.toggleClass 'book__prev_disabled', false
    @repos()

  movePrev: =>
    if @position == 0
      return
    @position+=100;
    @page_number--;

    if @position == 0
      @prev.toggleClass 'book__prev_disabled', true

    @next.toggleClass 'book__next_disabled', false
    @repos()

  repos: =>
    @pages.css 'left', @position+'%'
    @buttonText()

$(document).ready ->
  new book
