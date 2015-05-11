class book
  constructor: ->
    @book = $ '.book'
    if @book.length == 0
      return

    @body = $ 'body'
    @next = @book.find '.book__next'
    @next_text = @next.find 'span'
    @prev = @book.find '.book__prev'
    @prev_text = @prev.find 'span'
    @pages = @book.find '.book__pages'
    @page = @pages.find '.book__page'

    @one_page_width = 1240
    @page_count = @page.length
    @page_number = 0
    @clickable = true
    @time = 400

    @buttonState()
    @resizer()

    @touch = $('html').hasClass 'touch'
    @toucher = null
    if @touch
      @toucher = new Hammer(@book[0])
      @toucher.on 'swipeleft', @moveNext
      @toucher.on 'swiperight', @movePrev

    @next.on 'click', @moveNext
    @prev.on 'click', @movePrev

    $(window).on 'resize', @resizer

  resizer: =>
    @body.addClass 'no-transitions'

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @page.removeClass 'book__page_current'

      # for element in @page
      #   transitionEnd(element).unbind()

      @left = $ @page.get(0)
      @right = $ @page.get(1)
      @left.addClass 'book__page_left'
      @right.addClass 'book__page_right'

    else
      @page.removeClass 'book__page_left book__page_right'

      @current = $ @page.get(0)
      @current.addClass 'book__page_current'

      # for element in @page
      #   transitionEnd(element).bind @unblockButtons

    window.setTimeout =>
        @body.removeClass 'no-transitions'
      , 300

  unblockButtons: =>
    @clickable = true

  buttonState: =>

    if @page_number == 0
      @prev.toggleClass 'book__prev_disabled', true
    else
      @prev.toggleClass 'book__prev_disabled', false

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      last_page =  @page_count-2
    else
      last_page =  @page_count-1

    if @page_number >= last_page
      @next.toggleClass 'book__next_disabled', true
    else
      @next.toggleClass 'book__next_disabled', false

    @prev_text.text NumberToWords(@page_number-1)
    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @next_text.text NumberToWords(@page_number+2)
    else
      @next_text.text NumberToWords(@page_number+1)


  moveNext: =>
    if !@clickable
      return
    @clickable = false
    if @page_number == @page_count-1
      return

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @page_number = Math.min @page_number+2, @page_count-1
      @forward_part_1()
    else
      tmp = @current.next()
      @page_number++
      if tmp.length > 0
        tmp.addClass 'book__page_current'
        @current.removeClass 'book__page_current'
        @current = tmp
      window.setTimeout @unblockButtons, @time

    @buttonState()

  forward_part_1: =>

    @right_tmp = @right.next().next()
    @part_one_flag = true

    # transitionEnd(@right[0]).bind(@forward_part_2)
    window.setTimeout @forward_part_2, @time

    @right.addClass('book__page_right-old')

  forward_part_2: =>

    if !@part_one_flag
      return
    @part_one_flag = false

    @right.removeClass 'book__page_right-old book__page_right'
    # transitionEnd(@right[0]).unbind()
    if @right_tmp.length == 1
      @right_tmp.addClass 'book__page_right'
      @right = @right_tmp
    else
      @right = null

    @forward_part_3()

  forward_part_3: =>

    @left_tmp = @left.next().next()
    @part_three_flag = true

    # transitionEnd(@left_tmp[0]).bind(@forward_part_4)
    window.setTimeout @forward_part_4, @time

    @left.addClass 'book__page_left-old'
    @left_tmp.addClass 'book__page_left-new'

  forward_part_4: =>

    if !@part_three_flag
      return
    @part_three_flag = false

    @left.removeClass 'book__page_left-old book__page_left'
    @left = @left_tmp
    @left.addClass('book__page_left').removeClass 'book__page_left-new'


    # transitionEnd(@left_tmp[0]).unbind()
    window.setTimeout =>
        @clickable = true
      ,0


  movePrev: =>
    if !@clickable
      return
    @clickable = false
    if @page_number == 0
      return

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @page_number = Math.max @page_number-2, 0
      @prev_part_1()
    else
      @page_number--
      tmp = @current.prev()
      if tmp.length > 0
        tmp.addClass 'book__page_current'
        @current.removeClass 'book__page_current'
        @current = tmp
      window.setTimeout @unblockButtons, @time

    @buttonState()

  prev_part_1: =>
    @left_tmp = @left.prev().prev()

    @part_one_flag = true
    # transitionEnd(@right[0]).bind(@prev_part_2)
    window.setTimeout @prev_part_2, @time

    @left.addClass('book__page_left-prev').removeClass 'book__page_left'
    @left_tmp.addClass 'book__page_left'

  prev_part_2: =>
    if !@part_one_flag
      return
    @part_one_flag = false

    @left.removeClass('book__page_left-prev')
    @left = @left_tmp

    @prev_part_3()

  prev_part_3: =>
    @right_tmp = @right.prev().prev()
    @right_tmp.addClass('book__page_right-prev')

    window.setTimeout(@prev_part_4, 0)

  prev_part_4: =>
    @right_tmp.addClass('book__page_right-prev-placed').removeClass('book__page_right-prev')

    @part_five_flag = true
    # transitionEnd(@right[0]).bind(@prev_part_5)
    window.setTimeout @prev_part_5, @time

  prev_part_5: =>
    if !@part_five_flag
      return
    @part_five_flag = false

    @right_tmp.removeClass('book__page_right-prev-placed').addClass('book__page_right')
    @right.removeClass('book__page_right')
    @right = @right_tmp

    # transitionEnd(@right_tmp[0]).unbind()
    window.setTimeout =>
        @clickable = true
      ,0




$(document).ready ->
  new book
