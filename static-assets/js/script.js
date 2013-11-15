$(function() {

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
        sections[this.id] = ($(this).offset().top) + 700;
    });
    $(document).scroll(function() {
        var $this = $(this),
                pos = $this.scrollTop();
        for (i in sections) {
            if (sections[i] > pos && sections[i] < pos + _height) {
                $('li').removeClass('highlighted');
                $('#nav_' + i).addClass('highlighted');
            }
        }
        if (sections["introduction"] > pos && sections["introduction"] < pos + _height) {
            $('#nav_introduction').addClass('highlighted');
        }
    });
    $.fn.scrollBottom = function() {
        return $(document).height() - this.scrollTop() - this.height();
    };
    var $el = $('#toc');
    var $window = $(window);
    $window.bind("scroll resize", function() {
        var gap = $window.height() - $el.height() - 10;
        var visibleFoot = 1200 - $window.scrollBottom();
        var scrollTop = $window.scrollTop()

        if (scrollTop < 250 + 10) {
            $el.css({
                top: (250 - scrollTop) + "px",
                bottom: "auto"
            });
            $el.css("margin-top", (scrollTop - 20) + "px");
        } else if (visibleFoot > gap) {
            $el.css({
                top: "auto",
                bottom: visibleFoot + "px"
            });
        } else {
            $el.css("margin-top", 200 + "px");
            $el.css({
                top: 0,
                bottom: "auto"
            });
        }
    });
    $('.dropdown').mouseenter(function() {
        $('.dropdown-menu').hide();
        $(this).find('.dropdown-menu').show();
        // Hides searchbox module when header nav is show.
        $('#suggested-result').hide();
        $('#quick-search').addClass('hide-border');
    }).mouseleave(function() {
        $(this).find('.dropdown-menu').hide();
    });
    $(window).scroll(function() {
        if ($(window).scrollTop() > 50) {
            $('.sub-header, #api-docs-header, #toc').addClass('fixed-scroll');
        }
        else {
            $('.sub-header, #api-docs-header, #toc').removeClass('fixed-scroll');
        }
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
    var string = location.href;
    var if_api = string.indexOf("?callback_api=");
    var if_keyup = string.indexOf("?callback_keyup=");
    var api = if_api ? string.slice(if_api + 14) : 'grid-row';
    var keyup = string.slice(if_keyup + 16);
    if (if_keyup !== -1) {
        $('input#errorcode').val(keyup);
        $('input#errorcode').focus();
        keyup_search(keyup);
    }

    if (if_api !== -1) {
        show_api();
    }

    function show_api() {
        $('.sample-apps-grid .grid-row').hide();
        if (api === 'ALL') {
            $('.grid-row').show();
        } else {
            $('.sample-apps-grid').find('div.' + api).each(function() {
                $(this).show();
            });
        }
        $('#api-filter').text(function() {
            switch (api) {
                case 'all':
                    text = "All";
                    break;
                case 'speech':
                    text = "Speech";
                    break;
                case 'mms':
                    text = "MMS";
                    break;
                case 'payment':
                    text = "Payment";
                    break;
                case 'sms':
                    text = "SMS";
                    break;
                case 'grid-row':
                    text = "All";
                    break;
                default:
                    text = "All";
            }
            return text + ' APIs';
        });
    }
    $('#api-selector').change(function() {
        api = $(this).val();
        show_api();
    });
    $('#type-selector').change(function() {
        $('.sample-apps-grid .grid-row').hide();
        type = $(this).val();
        if (type === 'ALL') {
            $('.sample-apps-grid').find('div.' + api).each(function() {
                $(this).show();
            });
        } else {
            $('.sample-apps-grid').find('div.' + api).each(function() {
                item = $(this).children('.item').text().slice(0, 3);
                if (item === type) {
                    $(this).show();
                }
            });
        }
    });
    $('#errorcode').keyup(function() {
        val = $(this).val().toLowerCase();
        keyup_search(val);
    });
    function keyup_search(val) {
        $('.sample-apps-grid .grid-row').hide();
        if (val === "")
            $('.grid-row').show();
        $('.sample-apps-grid .item:contains("' + val + '"), .sample-apps-grid .links:contains("' + val + '")').each(function() {
            $(this).parent().show();
        });
    }

    $(".sample-apps-grid .grid-row").click(function() {
        error_code = $(this).find('.item').text();
        var api = $('#api-selector').val().toLowerCase();
        var error_type = $('#type-selector').val().toLowerCase();
        api_str = (api === "all") ? "" : "&selected_api=" + api;
        type_str = (error_type === "all") ? "" : "&selected_type=" + error_type;
        url = "error_detail?error_code=" + error_code + api_str + type_str;
        //alert(url);
        window.location = url;
    });
    $('.grid-row').hover(function() {
        $(this).toggleClass('hover');
    });

    error_detail = {
        selectedApi: function() {
            var start = string.indexOf("selected_api=") + 13;
            var api_substring = (string.slice(start)).substring(0, 3);
            var end = function() {
                switch (api_substring) {
                    case 'spe':
                        length = 6;
                        break;
                    case 'mms':
                        return length = 3;
                        break;
                    case 'pay':
                        return length = 7;
                        break;
                    case 'sms':
                        return length = 3;
                        break;
                    default:
                        length = 0;

                }
                return length;
            };
            return string.slice(start, start + end());
        },
        selectedType: function() {
            var start = string.indexOf("selected_type=");
            return string.slice(start + 14);
        }
    };

    console.log("selectedApi: " + error_detail.selectedApi() + ", selectedType: " + error_detail.selectedType());

    //detail page
    if ($(".detail_filter").length===1) {
        switch (error_detail.selectedApi()) {
            case 'speech':
                $('.detail_filter #api-selector option[value="speech"]').attr("selected", true);
                $('.cover span.text').eq(0).text('Speech');
                break;
            case 'mms':
                $('.detail_filter #api-selector option[value="mms"]').attr("selected", true);
                $('.cover span.text').eq(0).text('MMS');
                break;
            case 'payment':
                $('.detail_filter #api-selector option[value="payment"]').attr("selected", true);
                $('.cover span.text').eq(0).text('Payment');
                break;
            case 'sms':
                $('.detail_filter #api-selector option[value="sms"]').attr("selected", true);
                $('.cover span.text').eq(0).text('SMS');
                break;
        }

        switch (error_detail.selectedType()) {
            case 'pol':
                $('.detail_filter #type-selector option[value="POL"]').attr("selected", true);
                $('.cover span.text').eq(1).text('Policy Errors');
                break;
            case 'svc':
                $('.detail_filter #api-selector option[value="SVC"]').attr("selected", true);
                $('.cover span.text').eq(1).text('Service Errors');
                break;
        }

    }


    if (error_detail.selectedApi !== -1) {
        //alert('here');
        $('.detail_filter #api-selector').val('sms');
    }


    $('.detail_filter #api-selector').change(function() {
        val = $(this).val().toLowerCase();
        window.location = "errors?callback_api=" + val;
    });
    $('.detail_filter #type-selector').change(function() {
        window.location = 'errors';
    });
    $('.detail_filter #errorcode').keyup(function() {
        val = $(this).val().toLowerCase();
        window.location = "errors?callback_keyup=" + val;
    });
});

