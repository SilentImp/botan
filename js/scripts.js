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
    this.prev_part_4 = bind(this.prev_part_4, this);
    this.prev_part_3 = bind(this.prev_part_3, this);
    this.prev_part_2 = bind(this.prev_part_2, this);
    this.prev_part_1 = bind(this.prev_part_1, this);
    this.movePrev = bind(this.movePrev, this);
    this.forward_part_4 = bind(this.forward_part_4, this);
    this.forward_part_3 = bind(this.forward_part_3, this);
    this.forward_part_2 = bind(this.forward_part_2, this);
    this.forward_part_1 = bind(this.forward_part_1, this);
    this.moveNext = bind(this.moveNext, this);
    this.buttonState = bind(this.buttonState, this);
    this.unblockButtons = bind(this.unblockButtons, this);
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
    this.shadow = this.book.find('.shadow-left');
    this.one_page_width = 1240;
    this.page_number = 0;
    this.clickable = true;
    this.desk = null;
    this.time = 300;
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
    $(window).on('resize', this.resizer);
  }

  book.prototype.resizer = function() {
    var empty;
    this.body.addClass('no-transitions');
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      if (this.desk === true) {
        return;
      }
      this.desk = true;
      empty = this.book.find('.book__page_empty:first-child');
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
    } else {
      if (this.desk === false) {
        return;
      }
      this.desk = false;
      empty = this.book.find('.book__page_empty:first-child');
      if (empty.length > 0) {
        this.empty = empty.clone(true);
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
    this.page = this.book.find('.book__page');
    this.page_count = this.page.length;
    this.buttonState();
    return window.setTimeout((function(_this) {
      return function() {
        return _this.body.removeClass('no-transitions');
      };
    })(this), 300);
  };

  book.prototype.unblockButtons = function() {
    return this.clickable = true;
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
    var tmp;
    if (!this.clickable) {
      return;
    }
    this.clickable = false;
    if (this.page_number === this.page_count - 1) {
      return;
    }
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      this.page_number = Math.min(this.page_number + 2, this.page_count - 1);
      if (this.page_number > 0) {
        this.shadow.addClass('shadow-left_open');
      }
      this.forward_part_1();
    } else {
      tmp = this.current.next();
      this.page_number++;
      if (tmp.length > 0) {
        tmp.addClass('book__page_current');
        this.current.removeClass('book__page_current');
        this.current = tmp;
      }
      window.setTimeout(this.unblockButtons, this.time);
    }
    return this.buttonState();
  };

  book.prototype.forward_part_1 = function() {
    this.right_tmp = this.right.next().next();
    this.part_one_flag = true;
    window.setTimeout(this.forward_part_2, this.time);
    return this.right.addClass('book__page_right-old');
  };

  book.prototype.forward_part_2 = function() {
    if (!this.part_one_flag) {
      return;
    }
    this.part_one_flag = false;
    this.right.removeClass('book__page_right-old book__page_right');
    if (this.right_tmp.length === 1) {
      this.right_tmp.addClass('book__page_right');
      this.right = this.right_tmp;
    } else {
      this.right = null;
    }
    return this.forward_part_3();
  };

  book.prototype.forward_part_3 = function() {
    this.left_tmp = this.left.next().next();
    this.part_three_flag = true;
    window.setTimeout(this.forward_part_4, this.time);
    this.left.addClass('book__page_left-old');
    return this.left_tmp.addClass('book__page_left-new');
  };

  book.prototype.forward_part_4 = function() {
    if (!this.part_three_flag) {
      return;
    }
    this.part_three_flag = false;
    this.left.removeClass('book__page_left-old book__page_left');
    this.left = this.left_tmp;
    this.left.addClass('book__page_left').removeClass('book__page_left-new');
    return window.setTimeout((function(_this) {
      return function() {
        return _this.clickable = true;
      };
    })(this), 0);
  };

  book.prototype.movePrev = function() {
    var tmp;
    if (!this.clickable) {
      return;
    }
    this.clickable = false;
    if (this.page_number === 0) {
      return;
    }
    if (Modernizr.mq('(min-width: ' + this.one_page_width + 'px)')) {
      this.page_number = Math.max(this.page_number - 2, 0);
      if (this.page_number === 0) {
        this.shadow.removeClass('shadow-left_open');
      }
      this.prev_part_1();
    } else {
      this.page_number--;
      tmp = this.current.prev();
      if (tmp.length > 0) {
        tmp.addClass('book__page_current');
        this.current.removeClass('book__page_current');
        this.current = tmp;
      }
      window.setTimeout(this.unblockButtons, this.time);
    }
    return this.buttonState();
  };

  book.prototype.prev_part_1 = function() {
    this.left_tmp = this.left.prev().prev();
    this.part_one_flag = true;
    window.setTimeout(this.prev_part_2, this.time);
    this.left.addClass('book__page_left-prev').removeClass('book__page_left');
    return this.left_tmp.addClass('book__page_left');
  };

  book.prototype.prev_part_2 = function() {
    if (!this.part_one_flag) {
      return;
    }
    this.part_one_flag = false;
    this.left.removeClass('book__page_left-prev');
    this.left = this.left_tmp;
    return this.prev_part_3();
  };

  book.prototype.prev_part_3 = function() {
    this.right_tmp = this.right.prev().prev();
    this.right_tmp.addClass('book__page_right-prev');
    return window.setTimeout(this.prev_part_4, 0);
  };

  book.prototype.prev_part_4 = function() {
    this.right_tmp.addClass('book__page_right-prev-placed').removeClass('book__page_right-prev');
    this.part_five_flag = true;
    return window.setTimeout(this.prev_part_5, this.time);
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
