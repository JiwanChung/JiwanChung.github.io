$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }



  /* === APPENDED: pastel poem tiles + modal popup === */
  var $tiles = $('.gallery .poem-album');
  var $modal = $('#poem-modal');
  var $titleEl = $('#poem-title');
  var $authorEl = $('#poem-author');
  var $bodyEl  = $('#poem-body');
  var $closeBtn = $modal.find('.close');

  function randomPastel() {
    var h = Math.floor(Math.random() * 360);       // random hue
    var s = 60 + Math.floor(Math.random() * 15);   // 60–75% saturation
    var l = 85 + Math.floor(Math.random() * 8);    // 85–92% lightness
    return 'hsl(' + h + ' ' + s + '% ' + l + '%)';
  }

  // Assign colors
  $tiles.each(function () {
    var color = randomPastel();
    var $cover = $(this).find('.art');
    console.log(color);
    if ($cover.length) {
      console.log($cover.length);
      $cover.css('background', color);
    } else {
      $(this).css('background', color);
    }
  });

  // decode & sanitize: turn escaped HTML into text w/ preserved line breaks
  function htmlDataToPlainText(escapedHtml) {
    if (!escapedHtml) return '';
    // 1) decode HTML entities
    var decoded = $('<textarea/>').html(escapedHtml).text();
    // 2) normalize line breaks from HTML
    decoded = decoded
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/\s*p\s*>/gi, '\n\n')
      .replace(/<\/\s*h[1-6]\s*>/gi, '\n\n')
      .replace(/<\/\s*li\s*>/gi, '\n')
      .replace(/<\/\s*div\s*>/gi, '\n');
    // 3) strip remaining tags
    decoded = decoded.replace(/<[^>]+>/g, '');
    // 4) collapse excessive blank lines
    decoded = decoded.replace(/\n{3,}/g, '\n\n').trim();
    return decoded;
  };

  // Open modal
  $tiles.on('click', function () {
    $titleEl.text($(this).data('title'));
    $authorEl.text($(this).data('author'));
    var content = $(this).data('content');
    var isEscape = $(this).hasClass('poem-content_escape'); // <-- flag

    if (!isEscape) {
      content = "<pre>" + htmlDataToPlainText(content) + "</pre>";
    };
    $bodyEl.html(content);
    $modal.css('display', 'flex');
  });

  // Close modal
  $closeBtn.on('click', function () {
    $modal.hide();
  });
  $modal.on('click', function (e) {
    if (e.target === this) $modal.hide();
  });
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape' && $modal.is(':visible')) {
      $modal.hide();
    }
  });

  init();

});
