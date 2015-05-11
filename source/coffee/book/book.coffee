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
    @shadow = @book.find '.shadow-left__wrapper'

    @one_page_width = 1240
    @page_number = 0
    @clickable = true
    @desk = null
    @time = 200

    @resizer()

    @touch = $('html').hasClass 'touch'
    @toucher = null
    if @touch
      @toucher = new Hammer(@book[0])
      @toucher.on 'swipeleft', @moveNext
      @toucher.on 'swiperight', @movePrev

    @next.on 'click', @moveNext
    @prev.on 'click', @movePrev
    key 'right', @moveNext
    key 'left', @movePrev

    $(window).on 'resize', @resizer

  resizer: =>
    @body.addClass 'no-transitions'

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'

      if @desk == false || @desk == null
        @desk = true

        empty = @book.find '.book__page_empty:first-child'
        empty.removeClass 'book__page_left book__page_right book__page_current'
        if empty.length == 0
          @pages.prepend @empty
          @page_number++

        if (@page_number%2) == 0
          @left = @book.find '.book__page_current'
          @right = @left.next()
        else
          @right = @book.find '.book__page_current'
          @left = @right.prev()

        @page_number = @page_number - (@page_number%2)

        if @left.length == 0
          @left = @book.find('.book__page:eq(0)')
          @right = @book.find('.book__page:eq(1)')
          @page_number = 0

        @left.addClass 'book__page_left'
        @right.addClass 'book__page_right'

        if @page_number > 0
          @shadow.addClass 'shadow-left_open'
        else
          @shadow.removeClass 'shadow-left_open'

        @book.find('.book__page_current').removeClass 'book__page_current'

    else

      if @desk == true || @desk == null
        @desk = false
        @clickable = true

        empty = @book.find '.book__page_empty:first-child'
        if empty.length > 0
          @empty = empty.clone true
          @empty.removeClass 'book__page_left book__page_right book__page_current'
          empty.remove()
          @page_number--

        @current = @book.find '.book__page_left'
        if @current.length == 0
          @current = @book.find('.book__page:eq(0)')
          @page_number = 0


        @current.addClass 'book__page_current'

        @book.find('
          .book__page_left,
          .book__page_left-prev,
          .book__page_left-old,
          .book__page_left-new,
          .book__page_right,
          .book__page_right-old,
          .book__page_right-prev
        ').removeClass('
          book__page_left
          book__page_left-prev
          book__page_left-old
          book__page_left-new
          book__page_right
          book__page_right-old
          book__page_right-prev
        ');

    @page = @book.find '.book__page'
    @page_count = @page.length

    @buttonState()
    window.setTimeout =>
        @body.removeClass 'no-transitions'
      , 600


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

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @prev_text.text NumberToWords(@page_number-2)
      @next_text.text NumberToWords(@page_number+1)
    else
      @prev_text.text NumberToWords(@page_number-1)
      @next_text.text NumberToWords(@page_number+1)


  moveNext: =>


    if !@clickable
      return

    if Modernizr.mq('(min-width: '+@one_page_width+'px)') && @page_number >= @page_count-3
      return

    if Modernizr.mq('(max-width: '+@one_page_width+'px) and (min-width: 801px)') && @page_number >= @page_count-2
      return

    if Modernizr.mq('(max-width: 800px)') && (@page_number >= @page_count-2)
      @clickable = false
      @book.addClass 'book_last'
      setTimeout =>
          @book.removeClass 'book_last'
          @clickable = true
        , 400
      return

    @clickable = false

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'
      @page_number = Math.min @page_number+2, @page_count-1
      @forward_part_1()
    else
      @current_tmp = @current.next()
      @page_number++

      @current_tmp.css
        'margin-left': '0'
        'visibility': 'visible'
        'z-index': 1

      @current.stop().animate
          'margin-left': '-100%'
        ,
          'duration': @time
          'complete': @end_animation
          'easing': 'linear'

    @buttonState()

  end_animation: =>
    @current.removeClass('book__page_current').removeAttr 'style'
    @current = @current_tmp
    @current.addClass('book__page_current').removeAttr 'style'
    @clickable = true

  forward_part_1: =>

    @right_tmp = @right.next().next()
    if @right_tmp.length == 1
      @right_tmp.css
        'margin-left': '50%'
        'visibility': 'visible'
        'z-index:': 1
        'border-left-style': 'none'
        'border-right-style': 'solid'

    @left.css
      'z-index': 3
      'visibility': 'visible'

    @right.css
        'z-index': 2
      .stop().animate
          'margin-left': 0
        ,
          'duration': @time
          'complete': @forward_part_2
          'easing': 'linear'

  forward_part_2: =>

    @right.removeClass('book__page_right').removeAttr 'style'
    @right = @right_tmp
    @right.addClass('book__page_right').removeAttr 'style'

    @left.css
      'z-index': 1

    if @page_number > 0
      @shadow.stop().animate
          'width': '100%'
          'opacity': 1
        ,
          'duration': @time
          'easing': 'linear'


    @left_tmp = @left.next().next()

    @left_tmp.css
      'z-index': 2
      'margin-left': '50%'
      'visibility': 'visible'
      'border-left-style': 'solid'
      'border-right-style': 'none'

    @left_tmp.stop().animate
        'margin-left': '0'
      ,
        'duration': @time
        'complete': @forward_part_3
        'easing': 'linear'

  forward_part_3: =>
    @left.removeClass('book__page_left').removeAttr 'style'
    @left = @left_tmp
    @left.addClass('book__page_left').removeAttr 'style'
    @clickable = true


  movePrev: =>

    if !@clickable
      return

    if Modernizr.mq('(max-width: 800px)')&&(@page_number == 0)
      @clickable = false
      @book.addClass 'book_first'
      setTimeout =>
          @book.removeClass 'book_first'
          @clickable = true
        , 400

    if @page_number == 0
      return

    @clickable = false

    if Modernizr.mq '(min-width: '+@one_page_width+'px)'

      @page_number = Math.max @page_number-2, 0
      @prev_part_1()

    else
      @page_number--
      @current_tmp = @current.prev()
      @current_tmp.css
        'margin-left': '-100%'
        'visibility': 'visible'
        'z-index': 3
      @current_tmp.stop().animate
          'margin-left': '0'
        ,
          'duration': @time
          'complete': @end_animation
          'easing': 'linear'

    @buttonState()

  prev_part_1: =>
    @left_tmp = @left.prev().prev()

    @left_tmp.css
      'z-index' : 1
      'visibility' : 'visible'
      'margin-left' : 0
      'border-left-style': 'solid'
      'border-right-style': 'none'

    @right.css
        'z-index': 3


    if @page_number == 0
      @shadow.stop().animate
          'width': 0
          'opacity': 0
        ,
          'duration': @time
          'easing': 'linear'

    @left.css
        'z-index': 2
      .stop().animate
          'margin-left': '50%'
        ,
          'duration': @time
          'complete': @prev_part_2
          'easing': 'linear'

  prev_part_2: =>

    @left.removeClass('book__page_left').removeAttr 'style'
    @left = @left_tmp
    @left.addClass('book__page_left').removeAttr 'style'

    @left.css
      'z-index': 3

    @right.css
      'z-index': 1

    @right_tmp = @right.prev().prev()

    @right_tmp.css
      'z-index': 2
      'margin-left': '0'
      'visibility': 'visible'
      'border-left-style': 'none'
      'border-right-style': 'solid'

    @right_tmp.stop().animate
        'margin-left': '50%'
      ,
        'duration': @time
        'complete': @prev_part_3
        'easing': 'linear'


  prev_part_3: =>
    @right.removeClass('book__page_right').removeAttr 'style'
    @right = @right_tmp
    @right.addClass('book__page_right').removeAttr 'style'
    @clickable = true

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
