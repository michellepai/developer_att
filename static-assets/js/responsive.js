(function($) { 
  
  // Triggers mobile sidebar menu.
  $('#mobile-menu').click(function(e) {
    e.preventDefault();
    if ($('html').hasClass('slide-in') ) {
      $("#content-area").animate({
        left: '0'
      }, 150);
      $('html').removeClass('slide-in');       
    } else {
      $("#content-area").animate({
        left: '80%'
      }, 150); 
      $('html').addClass('slide-in');
    }
    return false;
  });

  // Remove responsive menu from 860px.
  $(window).resize(function(){
     console.log('resize called');
     var width = $(window).width();
     if(width >= 860 && width <= 1200){
      $("#content-area").animate({
        left: '0'
      }, 50);
      $('html').removeClass('slide-in');
     }
  })
  .resize();

  // Opens mobile sidebar sub-menu. 
  $('#sidr ul li span').click(function() {
    $(this).parent().toggleClass('sidr-class-active');
    $(this).next('ul').slideToggle('fast');
    $(this).find('.collapse').toggleClass('open');
  })

  // Triggers entering non mobile compatible content confirm pop up. 
  $('#sidr .forums').on('click', 'a', function() {
    return confirm('The link you tapped leads to a page that is not optimized for mobile browsing. Would you like to continue?');
  })

  // Remove responsive behavior.
  $('a.remove-responsive').click(function(e) {
    e.preventDefault();
    $('body').removeClass('responsive');
    $("#content-area").animate({
      left: '0'
    }, 50);
    $('html').removeClass('slide-in');
  })

})(jQuery);

