$(document).ready(function() {
    // Overwrites contains
    jQuery.expr[':'].Contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
    };

    
    jQuery.expr[':'].contains = function(a, i, m) {
        return jQuery(a).text().toUpperCase()
                .indexOf(m[3].toUpperCase()) >= 0;
    };

    var api = 'grid-row';
    $('#api-selector').change(function() {
        $('.grid-row').hide();
        api = $(this).val();
        $('.sample-apps-grid').find('div.' + api).each(function() {
            $(this).show();
        });
    });
    $('#type-selector').change(function() {
        $('.grid-row').hide();
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
        $('.grid-row').hide();
        val = $(this).val().toLowerCase();
        if (val === "")
            $('.grid-row').show();
        $('.sample-apps-grid .item:contains("' + val + '"), .sample-apps-grid .links:contains("' + val + '")').each(function() {
            $(this).parent().show();
        });
    });
});