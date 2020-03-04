var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
var inEditMode = false;
var inTestMode = false;
var spSettings = {
    maxQueryItems: 5000
}

if (inDesignMode == "1") {
    inEditMode = true;
}

var tables = {};
var mGlobal = {};
mGlobal.page = {};

$.fn.spEnvironment = {};

$.fn.getType = function () { return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase(); }

var theLoader = function () {

    $.fn.spEnvironment.theLoaderTemplate = $('#the_loader_template').html() ? Handlebars.compile($('#the_loader_template').html()) : function () { console.log('Handlebar Not Present') };

    var addThis = function (model) {

        if ($('.' + model.id).length == 0) {
            var html = '';
            html += $.fn.spEnvironment.theLoaderTemplate(model);
            $('body').append(html);
        }
    };

    var showThis = function (model) {

        addThis(model);
        $('.' + model.id + '').show();
        $('.' + model.id + '').fadeTo(100, .5, function () {

        })
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
            if (op < .5) {
                flag = true;
                element.css('opacity', op);
                element.css('filter', 'alpha(opacity=' + op * 100 + ')');
                op += op * 0.1;

                if (op >= .5) {
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


