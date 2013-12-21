$(function() {

    /* Initialize ZeroClipboard for copying text. */
    ZeroClipboard.setDefaults( { moviePath: '/static-assets/flash/ZeroClipboard.swf'} );
    var clip                  = new ZeroClipboard();
    var notification          = $('.notification');
    var initializeCopyButtons = function () {
      $('.copy-button').each(function () {
        var button = $(this);
        var pre = button.siblings("pre");
        button.attr('data-clipboard-text', pre.text().trim());
        clip.glue(button);
      });

      clip.on( 'complete', function ( client, args ) {
        notification.addClass('success');
        notification.find('span').text('Succefully copied to clipboard.');
        notification.slideDown();
        setTimeout(function(){
          notification.fadeOut();
        }, 3000); 
      });

      $(window).resize(function() {
        clip.reposition();
      });
      clip.off('load', initializeCopyButtons);
    };
    clip.on('load', initializeCopyButtons);

    $(".tabs").tabs();
    $('.tab_nav li a').click(function() {
        $(this).parent().parent().find('a.selected').removeClass('selected');
        $(this).addClass('selected');
    });
    $("#toc li a").click(function() {
        $('#toc li.highlighted').removeClass('highlighted');
        $(this).parent('li').addClass('highlighted');
    });
    var sections = {},
            _height = $(window).height(),
            i = 0;
    $('.level-1, .level-2').each(function() {
        sections[this.id] = ($(this).offset().top) + 980;
    });


    $(document).scroll(function() {
        var $this = $(this),
                pos = $this.scrollTop();
        for (i in sections) {
            if (sections[i] > pos && sections[i] < pos + _height) {
                if ($('#nav_' + i).length !== 0) {
                    $('li').removeClass('highlighted');
                    $('#nav_' + i).addClass('highlighted');
                }
            }
        }

    });
    $.fn.scrollBottom = function() {
        return $(document).height() - this.scrollTop() - this.height();
    };

    var $el = $('#toc');
    var $window = $(window);
    var ft = $('#footer-common');
    var ftd = document.getElementById('footer-common');
    var toc = document.getElementById('toc');
    //todo - move error related scripts to another file
    var nav = null;
    if (document.getElementById('toc')) {
        var nav = toc.getElementsByTagName('ul')[0];
    }

    var navBottom = 0;
    var headerConstant
            = document.getElementById('api-docs-header') == null ? 100 : 170;

    $window.bind("scroll resize", function() {
        var ftdRect = ftd.getBoundingClientRect();
        if (navBottom > ftdRect.top) {
            var dy = navBottom - ftdRect.top;
            $el.css({
                top: (headerConstant - dy) + "px",
                bottom: "auto"
            });

        } else {
            $el.css({
                top: headerConstant + "px",
                bottom: "auto"
            });
        }
    });

    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.sub-header, #api-docs-header, #toc').addClass('fixed-scroll');

            if (navBottom <= 0 && nav != null) {
                navBottom = nav.getBoundingClientRect().bottom;
            }
        }
        else {
            $('.sub-header, #api-docs-header, #toc').removeClass('fixed-scroll');
        }
    });
//    
    $('.dropdown').mouseenter(function() {
        $('.dropdown-menu').hide();
        $(this).find('.dropdown-menu').show();
        // Hides searchbox module when header nav is show.
        $('#suggested-result').hide();
        $('#quick-search').addClass('hide-border');
    }).mouseleave(function() {
        $(this).find('.dropdown-menu').hide();
    });
// Overwrites contains
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
    };
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
    };
    
    //check query string
    var keyup = '';
    if (qs('api') && qs('api').length !== -1) {
        $('.filter #api-selector').val(qs('api'));
    }
    
    if (qs('callback_keyup') || qs('api')) {
        api = (qs('callback_keyup')) ? qs('callback_keyup') : qs('api');
    } else {
        api = 'all';
    }
    if (qs('callback_keyup')) {
        keyup = qs('callback_keyup');
        $('input#errorcode').val(keyup);
        $('input#errorcode').focus();
        keyup_search(keyup);
    }
    
    //filter current api list
    show_api();

    //filters
    $('#api-selector').change(function() {
        api = $(this).val();
        show_api();
    });
    $('#type-selector').change(function() {
        $('.errors-grid .grid-row:not(.header)').hide();
        type = $(this).val();
        if (type === 'all') {
            show_api();
        } else if (type !== 'all') {
            if (api === 'all') api = 'grid-row';
            $('.errors-grid').find('div.' + api).each(function() {
                item = $(this).children('.error-code').text().slice(0, 3);
                if (item === type) $(this).show();
            });
        }
    });
    $('#errorcode').keyup(function() {
        val = $(this).val().toLowerCase();
        keyup_search(val);
    });

    function keyup_search(val) {
        $('.errors-grid .grid-row:not(.header)').hide();
        if (val === "")
            $('.grid-row').show();
        $('.errors-grid .error-code:contains("' + val + '"), .errors-grid .message:contains("' + val + '")').each(function() {
            $(this).parent().show();
        });
    }
    
    //show api list after filtering
    function show_api() {
        $('.errors-grid .grid-row:not(.header)').hide();
        if (api === 'all') {
            $('.grid-row').show();
        } else {
            $('.errors-grid').find('div.' + api).each(function() {
                $(this).show();
            });
        }
    }
    
    $(".errors-grid .grid-row").click(function() {
        error_code = $(this).find('.error-code').text();
        var api = $('#api-selector').val().toLowerCase();
        var error_type = $('#type-selector').val().toLowerCase();
        api_str = (api === "all") ? "" : "&selected_api=" + api;
        type_str = (error_type === "all") ? "" : "&selected_type=" + error_type;
        url = "error_detail?error_code=" + error_code + api_str + type_str;
        window.location = url;
    });
    $('.grid-row').hover(function() {
        $(this).toggleClass('hover');
    });


    
    //detail page
    error_detail = {
        selectedApi: function() {
            return qs('selected_api');
        },
        selectedType: function() {
            return qs('selected_type');
        }
    };
    //mark api & type on select
    if ($(".detail_filter").length === 1) {
        selected_api = error_detail.selectedApi();
        selected_type = error_detail.selectedType();
        if (selected_api)
            $('.detail_filter #api-selector').val(selected_api);
        if (selected_type)
            $('.detail_filter #type-selector').val(selected_type.toUpperCase());
        
        //change api links anchor tag typo
        $('.api').each(function() {
            href = $(this).attr('href');
            href = href.replace('/api/', '/apis/');
            console.log(href);
            $(this).attr('href', href);
        });


    }
    $('.detail_filter  #api-selector').change(function() {
        val = $(this).val().toLowerCase();
        window.location = "errors?api=" + val;
    });
    $('.detail_filter #type-selector').change(function() {
        window.location = 'errors';
    });
    $('.detail_filter #errorcode').keyup(function() {
        val = $(this).val().toLowerCase();
        window.location = "errors?callback_keyup=" + val;
    });

    $('#version').change(function() {
        window.location = $(this).val();
    });
    
    //select current version according to url
    var string = location.href;
    var if_v = string.indexOf("/v");
    var version = string.slice(if_v + 1, if_v + 3);
    $('#version option').each(function() {
        if ($(this).val().indexOf(version) !== -1)
            $(this).attr('selected', 1);
    });

    $('#nav_sdks-and-plugins').click(function() {
        window.location = "/sdk-plugins";
    });

    $('#toc').find('li:contains("erro")').click(function() {
        var pos = string.indexOf('apis/');
        if (pos !== -1)
            rest = string.slice(pos + 5);
        end = rest.indexOf('/');
        api = rest.slice(rest, end);
        console.log(api);
        if (api === 'speech' || api === 'sms' || api === 'payment' || api === 'mms') {
            windows.location = "/apis/errors?api=" + api;
        } else {
            windows.location = "/apis/errors";
        }

    });

    /* TODO: move to css */
    $('#api-docs-content').css({width: '100%'});

    //toggle resources sub-sections
    $('#toc .level-2').hide();
    $('#toc #nav_resources a:first').click(function() {
        $('#toc .level-2').toggle();
    });

    function qs(key) {
        key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx control chars
        var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
        return match && decodeURIComponent(match[1].replace(/\+/g, " "));
    }

});
