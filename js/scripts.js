window.NumberToWords = (function () {
    var words = [
          ['титульная', 'первая',
          'вторая', 'третья', 'четвертая', 'пятая',
          'шестая', 'седьмая', 'восьмая', 'девятая', 'десятая',
          'одиннадцатая', 'двенадцатая', 'тринадцатая',
          'четырнадцатая', 'пятнадцатая', 'шестнадцатая',
          'семнадцатая', 'восемнадцатая', 'девятнадцатая'],
          [,,
            ['двадцатая', 'двадцать'],
            ['тридцатая', 'тридцать'],
            ['сороковая', 'сорок'],
            ['пятидесятая','пятьдесят'],
            ['шестидесятая','шестьдесят'],
            ['семидесятая','семьдесят'],
            ['восьмидесятая','восемьдесят'],
            ['девяностая','девяносто']
          ]
        ];

        gap = String.fromCharCode(32),
        overdo = 'слишком много';

    function Convert(aNum) {
        var p, a, sub, diff;

        aNum = parseInt(aNum, 10);

        if (aNum < 20) {
            return a = words[0][aNum];
        }else if (aNum < 100) {
            diff = aNum % 10
            p = parseInt(aNum / 10, 10);

            if(diff == 0){
              sub = 0;
            }else{
              sub = 1;
            }
            if(diff>0){
            return Join(words[1][p][sub], words[0][diff]);
            }
            return words[1][p][sub];
        }else{
          return aNum;
        }

    };
    function Join() {
        return Array.prototype.join.call(arguments, gap);
    };
    return (function (aNum) {
        var b = (aNum > 999999999);
        return (b) ? overdo : Convert(aNum);
    });
})();

var book,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

book = (function() {
  function book() {
    this.prev_part_5 = bind(this.prev_part_5, this);
    this.prev_part_3 = bind(this.prev_part_3, this);
    this.prev_part_2 = bind(this.prev_part_2, this);
    this.prev_part_1 = bind(this.prev_part_1, this);
    this.movePrev = bind(this.movePrev, this);
    this.forward_part_3 = bind(this.forward_part_3, this);
    this.forward_part_2 = bind(this.forward_part_2, this);
    this.forward_part_1 = bind(this.forward_part_1, this);
    this.end_animation = bind(this.end_animation, this);
    this.moveNext = bind(this.moveNext, this);
    this.buttonState = bind(this.buttonState, this);
    this.resizer = bind(this.resizer, this);
    this.book = $('.book');
    if (this.book.length === 0) {
      return;
    }
    this.body = $('body');
    this.next = this.book.find('.book__next');
    this.next_text = this.next.find('span');
    this.prev = this.book.find('.book__prev');
    this.prev_text = this.prev.find('span');
    this.pages = this.book.find('.book__pages');
    this.shadow = this.book.find('.shadow-left__wrapper');
    this.one_page_width = 1240;
    this.page_number = 0;
    this.clickable = true;
    this.desk = null;
    this.time = 200;
    this.resizer();
    this.touch = $('html').hasClass('touch');
    this.toucher = null;
    if (this.touch) {
      this.toucher = new Hammer(this.book[0]);
      this.toucher.on('swipeleft', this.moveNext);
      this.toucher.on('swiperight', this.movePrev);
    }
    this.next.on('click', this.moveNext);
    this.prev.on('click', this.movePrev);
    key('right', this.moveNext);
    key('left', this.movePrev);
    $(window).on('resize', this.resizer);
  }

  book.prototype.resizer = function() {
    var empty;
    this.body.addClass('no-transitions');
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      if (this.desk === false || this.desk === null) {
        this.desk = true;
        empty = this.book.find('.book__page_empty:first-child');
        empty.removeClass('book__page_left book__page_right book__page_current');
        if (empty.length === 0) {
          this.pages.prepend(this.empty);
          this.page_number++;
        }
        if ((this.page_number % 2) === 0) {
          this.left = this.book.find('.book__page_current');
          this.right = this.left.next();
        } else {
          this.right = this.book.find('.book__page_current');
          this.left = this.right.prev();
        }
        this.page_number = this.page_number - (this.page_number % 2);
        if (this.left.length === 0) {
          this.left = this.book.find('.book__page:eq(0)');
          this.right = this.book.find('.book__page:eq(1)');
          this.page_number = 0;
        }
        this.left.addClass('book__page_left');
        this.right.addClass('book__page_right');
        if (this.page_number > 0) {
          this.shadow.addClass('shadow-left_open');
        } else {
          this.shadow.removeClass('shadow-left_open');
        }
        this.book.find('.book__page_current').removeClass('book__page_current');
      }
    } else {
      if (this.desk === true || this.desk === null) {
        this.desk = false;
        this.clickable = true;
        empty = this.book.find('.book__page_empty:first-child');
        if (empty.length > 0) {
          this.empty = empty.clone(true);
          this.empty.removeClass('book__page_left book__page_right book__page_current');
          empty.remove();
          this.page_number--;
        }
        this.current = this.book.find('.book__page_left');
        if (this.current.length === 0) {
          this.current = this.book.find('.book__page:eq(0)');
          this.page_number = 0;
        }
        this.current.addClass('book__page_current');
        this.book.find('.book__page_left, .book__page_left-prev, .book__page_left-old, .book__page_left-new, .book__page_right, .book__page_right-old, .book__page_right-prev').removeClass('book__page_left book__page_left-prev book__page_left-old book__page_left-new book__page_right book__page_right-old book__page_right-prev');
      }
    }
    this.page = this.book.find('.book__page');
    this.page_count = this.page.length;
    this.buttonState();
    return window.setTimeout((function(_this) {
      return function() {
        return _this.body.removeClass('no-transitions');
      };
    })(this), 600);
  };

  book.prototype.buttonState = function() {
    var last_page;
    if (this.page_number === 0) {
      this.prev.toggleClass('book__prev_disabled', true);
    } else {
      this.prev.toggleClass('book__prev_disabled', false);
    }
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      last_page = this.page_count - 2;
    } else {
      last_page = this.page_count - 1;
    }
    if (this.page_number >= last_page) {
      this.next.toggleClass('book__next_disabled', true);
    } else {
      this.next.toggleClass('book__next_disabled', false);
    }
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      this.prev_text.text(NumberToWords(this.page_number - 2));
      return this.next_text.text(NumberToWords(this.page_number + 1));
    } else {
      this.prev_text.text(NumberToWords(this.page_number - 1));
      return this.next_text.text(NumberToWords(this.page_number + 1));
    }
  };

  book.prototype.moveNext = function() {
    if (!this.clickable) {
      return;
    }
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)') && this.page_number >= this.page_count - 3) {
      return;
    }
    if (Modernizr.mq('(max-width: ' + (this.one_page_width - 1) + 'px) and (min-width: 801px)') && this.page_number >= this.page_count - 1) {
      return;
    }
    if (Modernizr.mq('(max-width: 800px)') && (this.page_number >= this.page_count - 1)) {
      this.clickable = false;
      this.book.addClass('book_last');
      setTimeout((function(_this) {
        return function() {
          _this.book.removeClass('book_last');
          return _this.clickable = true;
        };
      })(this), 400);
      return;
    }
    this.clickable = false;
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      this.page_number = Math.min(this.page_number + 2, this.page_count - 1);
      this.forward_part_1();
    } else {
      this.current_tmp = this.current.next();
      this.page_number++;
      this.current_tmp.css({
        'margin-left': '0',
        'visibility': 'visible',
        'z-index': 1
      });
      this.current.stop().animate({
        'margin-left': '-100%'
      }, {
        'duration': this.time,
        'complete': this.end_animation,
        'easing': 'linear'
      });
    }
    return this.buttonState();
  };

  book.prototype.end_animation = function() {
    this.current.removeClass('book__page_current').removeAttr('style');
    this.current = this.current_tmp;
    this.current.addClass('book__page_current').removeAttr('style');
    return this.clickable = true;
  };

  book.prototype.forward_part_1 = function() {
    this.right_tmp = this.right.next().next();
    if (this.right_tmp.length === 1) {
      this.right_tmp.css({
        'margin-left': '50%',
        'visibility': 'visible',
        'z-index:': 1,
        'border-left-style': 'none',
        'border-right-style': 'solid'
      });
    }
    this.left.css({
      'z-index': 3,
      'visibility': 'visible'
    });
    return this.right.css({
      'z-index': 2
    }).stop().animate({
      'margin-left': 0
    }, {
      'duration': this.time,
      'complete': this.forward_part_2,
      'easing': 'linear'
    });
  };

  book.prototype.forward_part_2 = function() {
    this.right.removeClass('book__page_right').removeAttr('style');
    this.right = this.right_tmp;
    this.right.addClass('book__page_right').removeAttr('style');
    this.left.css({
      'z-index': 1
    });
    if (this.page_number > 0) {
      this.shadow.stop().animate({
        'width': '100%',
        'opacity': 1
      }, {
        'duration': this.time,
        'easing': 'linear'
      });
    }
    this.left_tmp = this.left.next().next();
    this.left_tmp.css({
      'z-index': 2,
      'margin-left': '50%',
      'visibility': 'visible',
      'border-left-style': 'solid',
      'border-right-style': 'none'
    });
    return this.left_tmp.stop().animate({
      'margin-left': '0'
    }, {
      'duration': this.time,
      'complete': this.forward_part_3,
      'easing': 'linear'
    });
  };

  book.prototype.forward_part_3 = function() {
    this.left.removeClass('book__page_left').removeAttr('style');
    this.left = this.left_tmp;
    this.left.addClass('book__page_left').removeAttr('style');
    return this.clickable = true;
  };

  book.prototype.movePrev = function() {
    if (!this.clickable) {
      return;
    }
    if (Modernizr.mq('(max-width: 800px)') && (this.page_number === 0)) {
      this.clickable = false;
      this.book.addClass('book_first');
      setTimeout((function(_this) {
        return function() {
          _this.book.removeClass('book_first');
          return _this.clickable = true;
        };
      })(this), 400);
    }
    if (this.page_number === 0) {
      return;
    }
    this.clickable = false;
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      this.page_number = Math.max(this.page_number - 2, 0);
      this.prev_part_1();
    } else {
      this.page_number--;
      this.current_tmp = this.current.prev();
      this.current_tmp.css({
        'margin-left': '-100%',
        'visibility': 'visible',
        'z-index': 3
      });
      this.current_tmp.stop().animate({
        'margin-left': '0'
      }, {
        'duration': this.time,
        'complete': this.end_animation,
        'easing': 'linear'
      });
    }
    return this.buttonState();
  };

  book.prototype.prev_part_1 = function() {
    this.left_tmp = this.left.prev().prev();
    this.left_tmp.css({
      'z-index': 1,
      'visibility': 'visible',
      'margin-left': 0,
      'border-left-style': 'solid',
      'border-right-style': 'none'
    });
    this.right.css({
      'z-index': 3
    });
    if (this.page_number === 0) {
      this.shadow.stop().animate({
        'width': 0,
        'opacity': 0
      }, {
        'duration': this.time,
        'easing': 'linear'
      });
    }
    return this.left.css({
      'z-index': 2
    }).stop().animate({
      'margin-left': '50%'
    }, {
      'duration': this.time,
      'complete': this.prev_part_2,
      'easing': 'linear'
    });
  };

  book.prototype.prev_part_2 = function() {
    this.left.removeClass('book__page_left').removeAttr('style');
    this.left = this.left_tmp;
    this.left.addClass('book__page_left').removeAttr('style');
    this.left.css({
      'z-index': 3
    });
    this.right.css({
      'z-index': 1
    });
    this.right_tmp = this.right.prev().prev();
    this.right_tmp.css({
      'z-index': 2,
      'margin-left': '0',
      'visibility': 'visible',
      'border-left-style': 'none',
      'border-right-style': 'solid'
    });
    return this.right_tmp.stop().animate({
      'margin-left': '50%'
    }, {
      'duration': this.time,
      'complete': this.prev_part_3,
      'easing': 'linear'
    });
  };

  book.prototype.prev_part_3 = function() {
    this.right.removeClass('book__page_right').removeAttr('style');
    this.right = this.right_tmp;
    this.right.addClass('book__page_right').removeAttr('style');
    return this.clickable = true;
  };

  book.prototype.prev_part_5 = function() {
    if (!this.part_five_flag) {
      return;
    }
    this.part_five_flag = false;
    this.right_tmp.removeClass('book__page_right-prev-placed').addClass('book__page_right');
    this.right.removeClass('book__page_right');
    this.right = this.right_tmp;
    return window.setTimeout((function(_this) {
      return function() {
        return _this.clickable = true;
      };
    })(this), 0);
  };

  return book;

})();

$(document).ready(function() {
  return new book;
});

var Information,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Information = (function() {
  function Information() {
    this.resizer = bind(this.resizer, this);
    this.close = bind(this.close, this);
    this.open = bind(this.open, this);
    this.info = $('.information');
    this.lightbox = $('.information__lightbox');
    if (this.info.length === 0 || this.lightbox.length === 0) {
      delete this.info;
      delete this.lightbox;
      return;
    }
    this.body = $('body');
    this.open_button = this.body.find('>header .info');
    this.close_button = this.info.find('.information__close');
    this.resizer();
    $(window).on('resize', this.resizer);
    this.open_button.on('click', this.open);
    this.close_button.on('click', this.close);
    this.lightbox.on('click', this.close);
  }

  Information.prototype.open = function(event) {
    event.preventDefault();
    return this.body.addClass('info__popup');
  };

  Information.prototype.close = function(event) {
    event.preventDefault();
    return this.body.removeClass('info__popup');
  };

  Information.prototype.resizer = function() {
    var max;
    this.vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    console.log(this.vh);
    max = Math.max(.6625 * this.vh, 300);
    return this.info.css({
      'height': (max - 80) + 'px',
      'line-height': (max - 80) + 'px'
    });
  };

  return Information;

})();

$(document).ready(function() {
  return new Information;
});

Modernizr.addTest('mix-blend-mode', function() {
  return Modernizr.testProp('mixBlendMode');
});
