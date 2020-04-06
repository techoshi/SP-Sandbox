var theLoader = function () {

    $pa.env.theLoaderTemplate = $('#the_loader_template').html() ? Handlebars.compile($('#the_loader_template').html()) : function () { console.log('Handlebar Not Present'); };

    var addThis = function (model) {

        if ($('.' + model.id).length == 0) {
            var html = '';
            html += $pa.env.theLoaderTemplate(model);
            $('body').append(html);
        }
    };

    var showThis = function (model) {

        addThis(model);
        $('.' + model.id + '').show();
        $('.' + model.id + '').fadeTo(100, 0.5, function () {

        });
    };

    var hideThis = function (model) {

        $('.' + model.id + '').fadeOut(500, function () {
            $(this).remove();
            $('.dataTables_scrollBody table:visible').each(function (index, element) {
                tables[$(element).attr('id')].columns.adjust();
            });
        });

    };

    var Unfade = function (element) {
        var op = 0.1;
        var timer = setInterval(function () {
            if (op < 0.5) {
                flag = true;
                element.css('opacity', op);
                element.css('filter', 'alpha(opacity=' + op * 100 + ')');
                op += op * 0.1;

                if (op >= 0.5) {
                    clearInterval(timer);
                }
            }
        }, 100);
    };

    return {
        //main function to initiate the module
        add: function (model) {
            addThis(model);
        },
        show: function (model) {
            showThis(model);
        },
        hide: function (model) {
            hideThis(model);
        }
    };
}();