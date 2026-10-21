$(document).ready(function() {

  // ===============================================
  // CREATIVE ACADEMIC PORTFOLIO - JavaScript
  // ===============================================

  var $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      navOffsetTop = $nav.offset().top;

  // Active filters state
  var activeFilters = {
    type: 'all',
    year: 'all',
    keyword: null
  };

  function init() {
    $window.on('scroll', onScroll);
    $window.on('resize', resize);
    $('a[href^="#"]').on('click', smoothScroll);

    // Initialize features
    initPublicationFilters();
    initBibtexToast();
    initKeywordChips();
    initKaTeX();
    initPoemGallery();
    initBlogFilters();
  }

  // ================ PUBLICATION FILTERS ================
  function initPublicationFilters() {
    // View toggle (Highlights/Archive)
    $('#view-toggle .pill').on('click', function() {
      var ref = $(this).data('ref');
      $('#view-toggle .pill').removeClass('active');
      $(this).addClass('active');
      $('.tab-pane').removeClass('active');
      $(ref).addClass('active');
    });

    // Type filter
    $('#type-filter .pill').on('click', function() {
      $('#type-filter .pill').removeClass('active');
      $(this).addClass('active');
      activeFilters.type = $(this).data('filter-value');
      applyFilters();
    });

    // Year slider
    var $slider = $('#year-slider');
    var $display = $('#year-display');

    $slider.on('input', function() {
      var val = parseInt(this.value);
      if (val >= 2026) {
        activeFilters.year = 'all';
        $display.text('All Years');
      } else {
        activeFilters.year = val;
        $display.text('≤ ' + val);
      }
      applyFilters();
    });
  }

  function applyFilters() {
    var $papers = $('.paper-card');
    var $activeFilters = $('#active-filters');
    $activeFilters.empty();

    $papers.each(function() {
      var $paper = $(this);
      var type = $paper.data('type');
      var year = parseInt($paper.data('year'));
      var keywords = ($paper.data('keywords') || '').toString().toLowerCase();

      var typeMatch = activeFilters.type === 'all' || type === activeFilters.type;
      var yearMatch = activeFilters.year === 'all' || year <= activeFilters.year;
      var keywordMatch = !activeFilters.keyword || keywords.indexOf(activeFilters.keyword.toLowerCase()) !== -1;

      if (typeMatch && yearMatch && keywordMatch) {
        $paper.removeClass('filtered-out');
      } else {
        $paper.addClass('filtered-out');
      }
    });

    // Show active filter tags
    if (activeFilters.keyword) {
      $activeFilters.append(
        '<span class="active-filter-tag">' + activeFilters.keyword +
        '<button onclick="clearKeywordFilter()">&times;</button></span>'
      );
    }
  }

  window.filterByKeyword = function(keyword) {
    activeFilters.keyword = keyword;
    applyFilters();

    // Switch to Archive view
    $('#view-toggle .pill[data-ref="#papers-all"]').click();

    // Scroll to publications
    $('html, body').animate({
      scrollTop: $('#publications').offset().top - 80
    }, 600);
  };

  window.clearKeywordFilter = function() {
    activeFilters.keyword = null;
    applyFilters();
  };

  // ================ KEYWORD CHIPS ================
  function initKeywordChips() {
    $(document).on('click', '.keyword-chip', function() {
      var keyword = $(this).text().trim();
      filterByKeyword(keyword);
    });
  }

  // ================ BIBTEX TOAST ================
  function initBibtexToast() {
    var $toast = $('#bibtex-toast');
    var $content = $('#bibtex-content');

    $(document).on('click', '.bibtex-trigger', function(e) {
      e.preventDefault();
      var bibtex = $(this).data('bibtex');
      var decoded = $('<textarea/>').html(bibtex).text();
      $content.text(decoded);
      $toast.addClass('show');
    });

    $('#close-bibtex').on('click', function() {
      $toast.removeClass('show');
    });

    $('#copy-bibtex').on('click', function() {
      var bibtex = $content.text();
      navigator.clipboard.writeText(bibtex).then(function() {
        var $btn = $('#copy-bibtex');
        var original = $btn.html();
        $btn.html('<i class="fa-solid fa-check"></i> Copied!');
        setTimeout(function() {
          $btn.html(original);
          $toast.removeClass('show');
        }, 1500);
      });
    });

    // Close on escape
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape') {
        $toast.removeClass('show');
      }
    });
  }

  // ================ KATEX ================
  function initKaTeX() {
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof renderMathInElement !== 'undefined') {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      }
    });
  }

  // ================ POEM GALLERY ================
  function initPoemGallery() {
    var $tiles = $('.gallery .poem-album');
    var $modal = $('#poem-modal');
    var $titleEl = $('#poem-title');
    var $authorEl = $('#poem-author');
    var $bodyEl = $('#poem-body');
    var $closeBtn = $modal.find('.close');

    function randomPastel() {
      var h = Math.floor(Math.random() * 360);
      var s = 60 + Math.floor(Math.random() * 15);
      var l = 85 + Math.floor(Math.random() * 8);
      return 'hsl(' + h + ' ' + s + '% ' + l + '%)';
    }

    $tiles.each(function() {
      var color = randomPastel();
      var $cover = $(this).find('.art');
      if ($cover.length) {
        $cover.css('background', color);
      } else {
        $(this).css('background', color);
      }
    });

    function htmlDataToPlainText(escapedHtml) {
      if (!escapedHtml) return '';
      var decoded = $('<textarea/>').html(escapedHtml).text();
      decoded = decoded
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\/\s*p\s*>/gi, '\n\n')
        .replace(/<\/\s*h[1-6]\s*>/gi, '\n\n')
        .replace(/<\/\s*li\s*>/gi, '\n')
        .replace(/<\/\s*div\s*>/gi, '\n');
      decoded = decoded.replace(/<[^>]+>/g, '');
      decoded = decoded.replace(/\n{3,}/g, '\n\n').trim();
      return decoded;
    }

    $tiles.on('click', function() {
      $titleEl.text($(this).data('title'));
      $authorEl.text($(this).data('author'));
      var content = $(this).data('content');
      var isEscape = $(this).hasClass('poem-content_escape');
      if (!isEscape) {
        content = '<pre>' + htmlDataToPlainText(content) + '</pre>';
      }
      $bodyEl.html(content);
      $modal.css('display', 'flex');
    });

    $closeBtn.on('click', function() { $modal.hide(); });
    $modal.on('click', function(e) {
      if (e.target === this) $modal.hide();
    });
    $(document).on('keydown', function(e) {
      if (e.key === 'Escape' && $modal.is(':visible')) {
        $modal.hide();
      }
    });
  }

  // ================ BLOG FILTERS ================
  function initBlogFilters() {
    var $tagFilters = $('.tag-filter');
    var $blogPosts = $('.blog-post');

    $tagFilters.on('click', function() {
      var selectedTag = $(this).data('tag');
      $tagFilters.removeClass('active');
      $(this).addClass('active');

      if (selectedTag === 'all') {
        $blogPosts.show();
      } else {
        $blogPosts.each(function() {
          var postTags = $(this).data('tags');
          if (postTags && postTags.split(',').indexOf(selectedTag) !== -1) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }
    });
  }

  // ================ NAVIGATION ================
  function smoothScroll(e) {
    e.preventDefault();
    $(document).off('scroll');
    var target = this.hash;
    var $target = $(target);
    if ($target.length) {
      $('html, body').stop().animate({
        scrollTop: $target.offset().top - 40
      }, 400, 'swing', function() {
        window.location.hash = target;
        $(document).on('scroll', onScroll);
      });
    }
  }

  function resize() {
    $body.removeClass('has-docked-nav');
    navOffsetTop = $nav.offset().top;
    onScroll();
  }

  function onScroll() {
    if (navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav');
    }
    if (navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav');
    }
  }

  init();
});
