import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Handlebars from 'handlebars';
import * as spEnv from "./spa.spEnv";

export var theLoader = function () {
    var flag;
    
    spEnv.$pa.env.theLoaderTemplate = $('#the_loader_template').html() ? Handlebars.compile($('#the_loader_template').html()) : function () { console.log('Handlebar Not Present'); };

    var addThis = function (model : any) {

        if ($('.' + model.id).length == 0) {
            var html = '';
            html += spEnv.$pa.env.theLoaderTemplate(model);
            $('body').append(html);
        }
    };

    var showThis = function (model : any) {

        addThis(model);
        $('.' + model.id + '').show();
        $('.' + model.id + '').fadeTo(100, 0.5, function () {

        });
    };

    var hideThis = function (model : any) {

        $('.' + model.id + '').fadeOut(500, function () {
            $(this).remove();
            $('.dataTables_scrollBody table:visible').each(function (index, element) {
                spEnv.tables[$(element).attr('id')].columns.adjust();
            });
        });

    };

    var Unfade = function (element : any) {
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
        add: function (model : any) {
            addThis(model);
        },
        show: function (model : any) {
            showThis(model);
        },
        hide: function (model : any) {
            hideThis(model);
        }
    };
}();