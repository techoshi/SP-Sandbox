$.fn.spCommon = (function () {
    var thisSite = {};
    thisSite.objects = {};
    var continueToUpdateContext = true;
    
    function updateDigest() {
        spRest({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
            async: true,
            method: 'POST',
            done: function (r) {
                $('#__REQUESTDIGEST').val(r.d.GetContextWebInformation.FormDigestValue);
            },
            fail: function (response, errorCode, errorMessage) {
                continueToUpdateContext = false;

                promptDialog.prompt({
                    promptID: 'Page-Token-Expired',
                    body: 'Your Session has expired please refresh the page.',
                    header: 'Page Expired',
                    closeOnEscape: false,
                    removeClose: true,
                    buttons: [
                        {
                            text: "Refresh",
                            active: true,
                            close: true,
                            click: function () {
                            	theLoader.show({ id : 'reload-page' });
                            	setTimeout(function () { window.location.reload() }, 500);
                            }
                        }]
                });
            }
        });
    }

    setInterval(function () {
        if (continueToUpdateContext) {
            updateDigest(_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval);
        }
    }, 1 * 15000);


    function registerForms() {
        alert('Click Saved')
    }

    function initSettings() {
        toastr.options.closeMethod = 'fadeOut';
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';
        toastr.options.progressBar = true;
        toastr.options.positionClass = 'toast-bottom-right';
        toastr.options.closeButton = true;
        //toastr.options.timeOut = "0",
        //toastr.options.extendedTimeOut = "0"
    }

    function spRest(m) {
        /*var source = m.source;
	
        var thisData =  {
            '__metadata': {  
                'type': 'SP.Data.' + source + 'ListItem' // it defines the ListEnitityTypeName  
            }
        }*/

        var headers = m.headers != undefined ? m.headers : {};
        headers["Accept"] = headers["Accept"] ? headers["Accept"] : "application/json; odata=verbose"; //It defines the Data format   
        headers["content-type"] = headers["content-type"] ? headers["content-type"] : "application/json;odata=verbose"; //It defines the content type as JSON  
        headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val(); //It gets the digest value           		

        var ajaxReturn = $.ajax({
            method: m.method,
            url: m.url,
            data: m.data,
            async: m.async != undefined ? m.async : true,
            processData: m.processData != undefined ? m.processData : true,
            headers: headers,
            retryLimit: m.retryLimit != undefined ? m.retryLimit : 0,
            tryCount: m.tryCount != undefined ? m.tryCount : 0,
        })
            .done(function (response, textStatus, request) {

                if (request.getResponseHeader('X-RequestDigest')) {
                    $('#__REQUESTDIGEST').val();
                }

                if (typeof m.done == 'function') {
                    m.done(response);
                }
            })
            .fail(function (response, errorCode, errorMessage) {
                if (typeof m.fail == 'function') {
                    m.fail(response, errorCode, errorMessage);
                }
            })
            .always(function (response, textStatus, request) {
                //Nothing
                if (typeof m.always == 'function') {
                    m.always(response);
                }
            });

        if (m.async == false && ajaxReturn.statusText == 'OK') {
            return ajaxReturn.responseJSON;
        }
    }

    function getExtension(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
            // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }


    initSettings();

    function getRelativeURL(m) {
        if (typeof m.url == 'string') {
            return m.url.replace(/^.*\/\/[^\/]+/, '');
        }
    }

    function getSiteLists(m) {

        var thisAjax = {
            source: m.source,
            method: 'GET',
            url: m.path + "/_api/web/lists?$filter=Hidden eq false", // and BaseType ne 1",
            done: function (a) {

                thisSite.objects = a;

                if (typeof m.afterCompletion == 'function') {
                    m.afterCompletion();
                }
            },
            fail: function (a) {
            },
            always: function (a) {
                loadLists();
            }
        }

        $.fn.spCommon.ajax(thisAjax);
    }
    
    return {
        ajax: function (m) { return spRest(m); },
        getExtension: function (m) {
            return getExtension(m);
        },
        addHandlebar: function (o) {
            return o ? Handlebars.compile(o) : function () { console.log('Handlebar Not Present') };
        },
        addHandlebarPartial: function (m) {
            if (typeof m == 'object' && m.name) {
                return m.content ? Handlebars.registerPartial(m.name, m.content) : Handlebars.registerPartial(m.name, '');
            }
        },
        ordinal_suffix_of: function (i) {
            var j = i % 10,
                k = i % 100;
            if (j == 1 && k != 11) {
                return i + "st";
            }
            if (j == 2 && k != 12) {
                return i + "nd";
            }
            if (j == 3 && k != 13) {
                return i + "rd";
            }
            return i + "th";
        },
        getRelativeURL: function (m) {
            return getRelativeURL(m);
        },
        theList: function (m) { return thisSite; }
    }
})();

$.fn.spCommon.addHandlebarPartial({ name: 'jsTree', content: $('#sp_jstree_template').html() });
$.fn.spCommon.addHandlebarPartial({ name: 'listTabs', content: $('#list-family').html() });
$.fn.spCommon.addHandlebarPartial({ name: 'spForm', content: $('#sp_forms_template').html() });
$.fn.spCommon.addHandlebarPartial({ name: 'spTable', content: $('#sp_table_template').html() });


$.fn.spEnvironment.tabBody = $.fn.spCommon.addHandlebar($('#sp_tab_container').html());
$.fn.spEnvironment.fileAttachment = $.fn.spCommon.addHandlebar($('#sp_file_attachment').html());
$.fn.spEnvironment.fileInventory = $.fn.spCommon.addHandlebar($('#sp_file_inventory_template').html());
$.fn.spEnvironment.tabTemplate = $.fn.spCommon.addHandlebar($('#tabs-template').html());
$.fn.spEnvironment.anchorList = $.fn.spCommon.addHandlebar($('#list-anchor-items-template').html());
$.fn.spEnvironment.baseForm = $.fn.spCommon.addHandlebar($('#sp_forms_template').html());
$.fn.spEnvironment.deleteItem = $.fn.spCommon.addHandlebar($('#sp_delete_item').html());
$.fn.spEnvironment.baseModal = $.fn.spCommon.addHandlebar($('#sp-modal-template').html());
$.fn.spEnvironment.datatable_refresh_html = $.fn.spCommon.addHandlebar($('#datatable_refresh_html').html());
$.fn.spEnvironment.spTableTemplate = $.fn.spCommon.addHandlebar($('#sp_table_template').html());
$.fn.spEnvironment.spJsTreeTemplate = $.fn.spCommon.addHandlebar($('#sp_jstree_template').html());
$.fn.spEnvironment.spSearchCondition = $.fn.spCommon.addHandlebar($('#sp-search-condition').html());
$.fn.spEnvironment.fillinModal = $.fn.spCommon.addHandlebar($('#sp-modal-fillin-template').html());
$.fn.spEnvironment.promptModal = $.fn.spCommon.addHandlebar($('#prompt-modal-template').html());


var thisNavLiTemplate = $.fn.spCommon.addHandlebar($('#bootstrap-nav-li').html());
var thisNavDivTemplate = $.fn.spCommon.addHandlebar($('#bootstrap-nav-div').html());

$('#DeltaPlaceHolderMain').append($.fn.spEnvironment.tabBody());
$('.container').on('click', 'tbody tr', function () {

    var thisTable = $(this).parents('table').data('table');

    if ($(this).hasClass('selected')) {
        if (tables && tables[thisTable]) {
            tables[thisTable].lastRow = undefined;
        }

        $(this).removeClass('selected');
    }
    else {
        $(this).parents('table').find('tr.selected').removeClass('selected');
        $(this).addClass('selected');


        if (tables && tables[thisTable]) {
            tables[thisTable].lastRow = { id: $(this).prop('id'), data: tables[thisTable].ajax.json().data[$(this).index()], spData: tables[thisTable].ajax.json().spData[$(this).index()] };
        }
    }
});
