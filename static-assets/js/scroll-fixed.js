(function($) {
    $.fn["scrollFixed"] = function(params) {
        if ($(this).length == 0) return false;

        var $window    = $(window);
        var $element   = $(this);
        var $container = params.container ? $(params.container) : $element.parent();

        var margin     = params.margin === undefined ? 5 : parseInt(params.margin, 10);
        var after      = params.after === undefined ? 0 : parseInt(params.after, 10);
        var offset     = $element.offset();

        var resetElementPosition = function() {
            $element.css({
                position: "static",
                top: "auto",
                left: "auto",
                right: "auto"
            });
        };

        var setElementPosition = function() {
            if ($window.scrollTop() + margin + after > offset.top) {
                $element.css({
                    position: "fixed",
                    top: margin,
                    left: offset.left,
                    right: params.setRight ? offset.left : 'auto'
                });

            } else {
                resetElementPosition();
            }

            // When the bottom of the container is reached, reset position so that
            // the element doesn't float outside the bounds of the container.
            if ($element.offset().top + $element.height()
                    > offset.top + $container.height()) {

                resetElementPosition();
            }
        };

        var resetOffset = function() {
            resetElementPosition();
            offset = $element.offset();
            setElementPosition();
        };

        $window.scroll(function() {
            setElementPosition();
        });

        $window.resize(function() {
            resetOffset();
        });
    };
})(jQuery);
