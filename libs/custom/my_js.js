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
    initNeuralMap();
    initPublicationFilters();
    initBibtexToast();
    initKeywordChips();
    initKaTeX();
    initPoemGallery();
    initBlogFilters();
  }

  // ================ NEURAL MAP (D3.js) ================
  function initNeuralMap() {
    var container = document.getElementById('neural-map-container');
    if (!container || typeof d3 === 'undefined') return;

    var $papers = $('.paper-card');
    var keywordCounts = {};
    var keywordLinks = [];

    // Extract keywords
    $papers.each(function() {
      var keywords = ($(this).data('keywords') || '').toString().split(',');
      keywords.forEach(function(kw) {
        kw = kw.trim();
        if (kw) {
          keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
          keywords.forEach(function(other) {
            other = other.trim();
            if (other && kw < other) {
              keywordLinks.push({ source: kw, target: other });
            }
          });
        }
      });
    });

    // Smaller node sizes for better fit
    var nodes = Object.keys(keywordCounts).map(function(kw) {
      return {
        id: kw,
        count: keywordCounts[kw],
        radius: Math.max(20, Math.min(40, 12 + keywordCounts[kw] * 5))
      };
    });

    // Deduplicate links
    var linkMap = {};
    keywordLinks.forEach(function(l) {
      var key = l.source + '|' + l.target;
      linkMap[key] = (linkMap[key] || 0) + 1;
    });
    var links = Object.keys(linkMap).map(function(key) {
      var parts = key.split('|');
      return { source: parts[0], target: parts[1], value: linkMap[key] };
    });

    var width = container.clientWidth;
    var height = 420;
    var padding = 40;

    var svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create a group for zoom/pan
    var g = svg.append('g');

    // Gradient for links
    var defs = svg.append('defs');
    var gradient = defs.append('linearGradient')
      .attr('id', 'neural-gradient')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '100%').attr('y2', '0%');
    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#94a3b8');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#cbd5e1');

    // Tighter force simulation
    var simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(function(d) { return d.id; }).distance(70))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(function(d) { return d.radius + 8; }))
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    // Links
    var link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('class', 'neural-link')
      .attr('stroke-width', function(d) { return Math.sqrt(d.value) * 1.5; });

    // Nodes
    var node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'neural-node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended))
      .on('click', function(event, d) {
        event.stopPropagation();
        filterByKeyword(d.id);
        // Highlight this node
        svg.selectAll('.neural-node').classed('active', false);
        d3.select(this).classed('active', true);
      })
      .on('mouseenter', function(event, d) {
        var tooltip = document.getElementById('neural-tooltip');
        tooltip.textContent = d.id + ' (' + d.count + ' paper' + (d.count > 1 ? 's' : '') + ')';
        var rect = container.getBoundingClientRect();
        tooltip.style.left = (event.clientX - rect.left + 15) + 'px';
        tooltip.style.top = (event.clientY - rect.top - 10) + 'px';
        tooltip.style.opacity = 1;

        // Highlight connected links
        link.classed('highlighted', function(l) {
          return l.source.id === d.id || l.target.id === d.id;
        });
      })
      .on('mouseleave', function() {
        document.getElementById('neural-tooltip').style.opacity = 0;
        link.classed('highlighted', false);
      });

    // Node circles - vibrant palette
    node.append('circle')
      .attr('r', function(d) { return d.radius; })
      .attr('fill', function(d, i) {
        var colors = ['#2563eb', '#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706', '#dc2626', '#4f46e5'];
        return colors[i % colors.length];
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Node labels - smaller font for better fit
    node.append('text')
      .text(function(d) { return d.id; })
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('fill', 'white')
      .attr('font-size', '10px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none');

    // No pulsing animation - cleaner look

    // Tick with boundary constraints
    simulation.on('tick', function() {
      // Clamp nodes to stay within bounds
      nodes.forEach(function(d) {
        d.x = Math.max(padding + d.radius, Math.min(width - padding - d.radius, d.x));
        d.y = Math.max(padding + d.radius, Math.min(height - padding - d.radius, d.y));
      });

      link
        .attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

      node.attr('transform', function(d) {
        return 'translate(' + d.x + ',' + d.y + ')';
      });
    });

    // Zoom behavior
    var zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', function(event) {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Add zoom controls
    var controls = document.createElement('div');
    controls.className = 'neural-map-controls';
    controls.innerHTML = '<button id="zoom-in" title="Zoom In">+</button>' +
                         '<button id="zoom-out" title="Zoom Out">−</button>' +
                         '<button id="zoom-reset" title="Reset View">⟲</button>';
    container.appendChild(controls);

    document.getElementById('zoom-in').addEventListener('click', function() {
      svg.transition().call(zoom.scaleBy, 1.3);
    });
    document.getElementById('zoom-out').addEventListener('click', function() {
      svg.transition().call(zoom.scaleBy, 0.7);
    });
    document.getElementById('zoom-reset').addEventListener('click', function() {
      svg.transition().call(zoom.transform, d3.zoomIdentity);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }
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
    d3.selectAll('.neural-node').classed('active', false);
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
