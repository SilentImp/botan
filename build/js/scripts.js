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
    this.repos = bind(this.repos, this);
    this.movePrev = bind(this.movePrev, this);
    this.moveNext = bind(this.moveNext, this);
    this.buttonText = bind(this.buttonText, this);
    this.resizer = bind(this.resizer, this);
    this.book = $('.book');
    if (this.book.length === 0) {
      return;
    }
    this.next = this.book.find('.book__next');
    this.next_text = this.next.find('span');
    this.prev = this.book.find('.book__prev');
    this.prev_text = this.prev.find('span');
    this.pages = this.book.find('.book__pages');
    this.page = this.pages.find('.book__page');
    this.page_count = this.page.length;
    delete this.page;
    this.page_number = 0;
    this.position = 0;
    this.resizer();
    this.buttonText();
    this.touch = $('html').hasClass('touch');
    this.toucher = null;
    if (this.touch) {
      this.toucher = new Hammer(this.book[0]);
      this.toucher.on('swipeleft', this.moveNext);
      this.toucher.on('swiperight', this.movePrev);
    } else {
      this.next.on('click', this.moveNext);
      this.prev.on('click', this.movePrev);
    }
    $(window).on('resize', this.resizer);
  }

  book.prototype.resizer = function() {
    if (Modernizr.mq('(min-width: 1000px)')) {
      if (this.step === 50) {
        this.step = 100;
        this.delimiter = Math.ceil(this.page_count / 2);
        this.position = Math.floor(this.position / 100) * 100;
      }
    } else {
      this.delimiter = this.page_count;
      this.step = 50;
    }
    return this.repos();
  };

  book.prototype.buttonText = function() {
    this.prev_text.text(NumberToWords(this.page_number - 1));
    return this.next_text.text(NumberToWords(this.page_number + (this.step / 50)));
  };

  book.prototype.moveNext = function() {
    if (this.position === (this.delimiter - 1) * -100) {
      return;
    }
    this.position -= 100;
    this.page_number++;
    if (this.position === (this.delimiter - 1) * -100) {
      this.next.toggleClass('book__next_disabled', true);
    }
    this.prev.toggleClass('book__prev_disabled', false);
    return this.repos();
  };

  book.prototype.movePrev = function() {
    if (this.position === 0) {
      return;
    }
    this.position += 100;
    this.page_number--;
    if (this.position === 0) {
      this.prev.toggleClass('book__prev_disabled', true);
    }
    this.next.toggleClass('book__next_disabled', false);
    return this.repos();
  };

  book.prototype.repos = function() {
    this.pages.css('left', this.position + '%');
    return this.buttonText();
  };

  return book;

})();

$(document).ready(function() {
  return new book;
});
