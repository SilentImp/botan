var book,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

book = (function() {
  function book() {
    this.repos = bind(this.repos, this);
    this.movePrev = bind(this.movePrev, this);
    this.moveNext = bind(this.moveNext, this);
    this.resizer = bind(this.resizer, this);
    this.book = $('.book');
    if (this.book.length === 0) {
      return;
    }
    this.next = this.book.find('.book__next');
    this.prev = this.book.find('.book__prev');
    this.pages = this.book.find('.book__pages');
    this.page = this.pages.find('.book__page');
    this.page_count = this.page.length;
    delete this.page;
    this.position = 0;
    this.resizer();
    this.next.on('click', this.moveNext);
    this.prev.on('click', this.movePrev);
    $(window).on('resize', this.resizer);
  }

  book.prototype.resizer = function() {
    if (Modernizr.mq('(min-width: 1000px)')) {
      this.step = 100;
      this.delimiter = Math.ceil(this.page_count / 2);
      this.position = Math.floor(this.position / 100) * 100;
    } else {
      this.delimiter = this.page_count;
      this.step = 50;
    }
    return this.repos();
  };

  book.prototype.moveNext = function() {
    if (this.position === (this.delimiter - 1) * -100) {
      return;
    }
    this.position -= 100;
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
    if (this.position === 0) {
      this.prev.toggleClass('book__prev_disabled', true);
    }
    this.next.toggleClass('book__next_disabled', false);
    return this.repos();
  };

  book.prototype.repos = function() {
    return this.pages.css('left', this.position + '%');
  };

  return book;

})();

$(document).ready(function() {
  return new book;
});
