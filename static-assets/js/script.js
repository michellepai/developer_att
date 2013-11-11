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
  }).mouseleave(function(){
    $(this).find('.dropdown-menu').hide();
  });

});
$(window).scroll(function() {
    if ($(window).scrollTop() > 50) {
        $('.sub-header, #api-docs-header, #toc').addClass('fixed-scroll');
    }
    else {
        $('.sub-header, #api-docs-header, #toc').removeClass('fixed-scroll');
    }
});
function show_menu(id) {
    if (id === "navbtn-collapse") {
        document.getElementById('toc').style.cssText = 'display: block;';
        document.getElementById(id).id = "navbtn-expand";
    } else {
        document.getElementById('toc').style.cssText = 'display: none;';
        document.getElementById(id).id = "navbtn-collapse";
    }
    
}
