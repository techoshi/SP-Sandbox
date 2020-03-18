var iGlobal = {

    ellipse: {
        name: 'IrisEllipse',
        ownerId: '',
        id: iGlobal != undefined && this.ownerId.length > 0 ? this.ownerId + '_' + this.name : this.name
    },

    pager: {
        name: 'IrisPager',
        pagerId: iGlobal != undefined && this.ownerId.length > 0 ? this.ownerId + '_' + this.name : '#' + this.name,
        recordType: '',
        id: '',
        total: '',
        stop: '',
        start: '',
        isFirstPage: '',
        isLastPage: '',
        isMoreThanOnePage: '',
        btnFirst: '',
        btnPrev: '',
        btnNext: '',
        btnLast: '',
        disPageSelect: '',
        disabled: 'disabled="disabled"',
        showPageSelectOption: true,
        btnStatus: '',
        pageTotal: '',
        currentPageSelected: '',
        pageHtml: '',
        btnGoto: '',
        navHtml: '',
        ExtensionHTML: ''
    },

    multiselect: {
        name: 'iris-ms',
        selected: ''
    }
};

iGlobal.multiselect.html = function (model) {
    var html = '';
    //html += '   <div class="container">';
    //html += '   <div class="instructions">(Click to expand and select '+ model.name +' to filter)</div>';
    html += '       <div class="dropdown-container">';
    html += '           <div class="dropdown-resize">';
    html += '               <div class="dropdown-button noselect">';
    html += '                   <div class="dropdown-label">' + model.name.toUpperCase() + '</div>';
    html += '                   <div class="dropdown-quantity">(<span class="quantity">0</span>)</div>';
    html += '                   <i class="fa fa-filter"></i>';
    html += '               </div>';
    html += '               <div class="dropdown-list">';
    html += '                   <input type="search" placeholder="Search..." class="dropdown-search search-box" name="focus" required>';
    html += '                   <ul class="ul_selection">';
    html += '                       <li>';
    html += '                           <span>';
    html += '                           <input id="select_all" type="checkbox" />';
    html += '                           </span>';
    html += '                           <label>(Select All)</label>';
    html += '                       </li>';
    html += '                   </ul>';
    html += '               </div>';
    html += '           </div>';
    html += '       </div>';
    //html += '   </div>';
    $(model.id).html(html);
};

iGlobal.multiselect.css = function (model) {

    var float = model.float;
    var width = model.width;
    var min_width = model.min_width;
    var max_width = model.max_width;
    var height = model.height;
    var min_height = model.min_height;
    var max_height = model.max_height;
    var ul_height = model.height - 50;

    width += 'px';
    min_width += 'px';
    max_width += 'px';
    height += 'px';
    min_height += 'px';
    max_height += 'px';
    ul_height += 'px';

    $(model.id + ' .dropdown-container').css('float', float);
    $(model.id + ' .dropdown-container').css('margin-top', '0px');
    $(model.id + ' .dropdown-button').css('width', width);
    $(model.id + ' .dropdown-list').css('height', height);
    $(model.id + ' .dropdown-list').css('width', width);
    $(model.id + ' .dropdown-list').css('min-height', min_height);
    $(model.id + ' .dropdown-list').css('min-width', min_width);
    $(model.id + ' .dropdown-list').css('max-height', max_height);
    $(model.id + ' .dropdown-list').css('max-width', max_width);
    $(model.id + ' .ul_selection').css('max-height', ul_height);

    if (!model.isExpanded) {
        if (model.isExpanded) {
            $(model.id + ' .dropdown-list').css('display', 'block');
        }
        else {
            $(model.id + ' .dropdown-list').css('display', 'none');
        }
    }

    if (model.showNumSelected) {
        $(model.id + ' .dropdown-quantity').css('display', 'block');
    }
    else {
        $(model.id + ' .dropdown-quantity').css('display', 'none');
    }

    if (model.isResizable) {
        $(model.id + ' .dropdown-list').resizable();
    }
};

iGlobal.multiselect.binds = function (model) {

    $(model.id + ' .dropdown-list').resizable();

    $(model.id + ' #select_all').live('click', function () {
        if ($(model.id + ' #select_all').parent().hasClass('checked')) {
            $(model.id + ' #select_all').parent().removeClass('checked');
            $(model.id + ' .li_select [type="checkbox"]').attr('checked', false);
            $(model.id + ' .quantity').text('0');
            model.selected = '';
        }
        else {
            $(model.id + ' #select_all').parent().addClass('checked');
            $(model.id + ' .li_select [type="checkbox"]').attr('checked', true);
            $(model.id + ' .quantity').text($(model.id + ' .li_select').length);

            iGlobal.multiselect.setSelected(model);
        }

        tables[model.ownerId].ajax.reload();
    });

    $(model.id + ' .dropdown-button').live('click', function () {
        $(model.id + ' .dropdown-list').toggle();
        model.isExpanded = model.isExpanded ? false : true;

        iGlobal.multiselect.css(model);
    });

    $(model.id + ' .dropdown-search').live('input', function () {
        var target = $(this);
        var search = target.val().toLowerCase();

        if (!search) {
            $(model.id + ' .li_select').show();
            return false;
        }

        $(model.id + ' .li_select').each(function () {
            var text = $(this).text().toLowerCase();
            var match = text.indexOf(search) > -1;
            $(this).toggle(match);
        });
    });

    $(model.id + ' .li_select [type="checkbox"]').live('change', function () {
        var numChecked = $(model.id + ' .li_select [type="checkbox"]:checked').length;
        var numTotal = $(model.id + ' .li_select').length;

        if (numChecked != numTotal) {
            $(model.id + ' #select_all').parent().removeClass('checked');
            $(model.id + ' #select_all').attr('checked', false);
        }
        else {
            $(model.id + ' #select_all').parent().addClass('checked');
            $(model.id + ' #select_all').attr('checked', true);
        }

        $(model.id + ' .quantity').text(numChecked || '0');

        iGlobal.multiselect.setSelected(model);

        tables[model.ownerId].ajax.reload();
    });
};

iGlobal.multiselect.setSelected = function (model) {

    var id = '#' + iGlobal.multiselect.name + '-' + model.name;
    iGlobal.multiselect.selected = '';

    $(id + ' .ul_selection input:checked').each(function () {
        if (typeof $(this).attr('name') !== 'undefined') {
            iGlobal.multiselect.selected += $(this).attr('name') + ',';
        }
    });

    if (iGlobal.multiselect.selected.length > 0) {
        iGlobal.multiselect.selected = iGlobal.multiselect.selected.substring(0, iGlobal.multiselect.selected.length - 1);
    }
};

iGlobal.multiselect.load = function (model) {

    var list = [];

    for (var i in model.jsonResult) {

        var obj = model.jsonResult[i];
        var key = obj[Object.keys(obj)[model.key]];
        var value = '';

        for (var j = 0; j < model.value.length; j++) {

            if (model.delimiter.length > 0) {
                value += model.delimiter + obj[Object.keys(obj)[model.value[j]]];
            }
            else {
                value += obj[Object.keys(obj)[model.value[j]]];
            }
        }

        value = model.delimiter.length > 0 ? key + value : value;
        list.push({ key: key, value: value });
    }

    var listTemplate = _.template(
        '<li class="li_select">' +
        '<input name="<%= key %>" type="checkbox" />' +
        '<label for="<%= key %>"><%= value %></label>' +
        '</li>'
    );

    _.each(list, function (s) {
        //s.value = _.startCase(s.value.toLowerCase());
        //s.value = s.value.toUpperCase().substring(0, 20);
        s.value = s.value.toUpperCase();
        $(model.id + ' .ul_selection').append(listTemplate(s));
    });
};

iGlobal.multiselect.init = function (model) {

    model.id = '#' + iGlobal.multiselect.name + '-' + model.name;
    model.min_height = model.height;
    model.max_height = model.height;
    model.min_width = model.min_width - 50;
    model.max_width = model.min_width + 50;
    model.selected = '';

    iGlobal.multiselect.html(model);
    iGlobal.multiselect.css(model);
    iGlobal.multiselect.binds(model);
    iGlobal.multiselect.load(model);
};

iGlobal.ellipse.html = function () {
    var html = '';
    if ($('.dataTables_scroll').length > 0) {
        var height = $($('.dataTables_scroll .dataTables_scrollBody table#' + iGlobal.ellipse.ownerId).parent().parent()).css('height');
        var h1 = (height && height.indexOf('px') > -1) ? height.replace('px', '') : height;
        var h2 = .4 * h1;

        html += '<div id="' + iGlobal.ellipse.id + '" class="modal-backdrop in" style="display: none; z-index: 999999; position: absolute; bottom: 10px; margin-bottom: 0px; left: 15px; right: 15px;">';
        html += '<div id="circleG" style="margin-top: ' + h2 + 'px">';
        html += '<div id="circleG_1" class="circleG"></div>';
        html += '<div id="circleG_2" class="circleG"></div>';
        html += '<div id="circleG_3" class="circleG"></div>';
        html += '</div>';
        html += '</div>';
    }
    else {
        html += '<div id="' + iGlobal.ellipse.id + '" class="modal-backdrop in" style="display: none; z-index: 999999; position: absolute; margin-bottom: 0px; left: 45px;">';
        html += '<div id="circleG">';
        html += '<div id="circleG_1" class="circleG"></div>';
        html += '<div id="circleG_2" class="circleG"></div>';
        html += '<div id="circleG_3" class="circleG"></div>';
        html += '</div>';
        html += '</div>';
    }
    return html;
};

iGlobal.ellipse.show = function (model) {

    if (model != undefined) {
        iGlobal.ellipse.ownerId = model.id;
        iGlobal.ellipse.id = iGlobal.ellipse.ownerId + '_' + iGlobal.ellipse.name;
    }

    if ($('#' + iGlobal.ellipse.id).length > 0 && ($('#' + iGlobal.ellipse.id).css('display') == 'none')) {
        var height = $($('.dataTables_scroll .dataTables_scrollBody table#' + iGlobal.ellipse.ownerId).parent().parent()).css('height').replace('px', '') * .4;
        $('#' + iGlobal.ellipse.id).css('opacity', 0);
        $('#' + iGlobal.ellipse.id + ' #circleG').css('margin-top', height + 'px');
        $('#' + iGlobal.ellipse.id).show();
        iGlobal.ellipse.unfade($('#' + iGlobal.ellipse.id));
    }
    else {
        iGlobal.ellipse.add(model);
        $('#' + iGlobal.ellipse.id).css('opacity', 0);
        $('#' + iGlobal.ellipse.id).show();
        iGlobal.ellipse.unfade($('#' + iGlobal.ellipse.id));
    }
};

iGlobal.ellipse.hide = function () {

    if ($('#' + iGlobal.ellipse.id).length > 0) {
        $('#' + iGlobal.ellipse.id).hide();
        $('#' + iGlobal.ellipse.id).css('opacity', 0);
    }
};

iGlobal.ellipse.unfade = function (element) {

    var op = 0.1;

    var timer = setInterval(function () {

        if (op < .5) {

            flag = true;
            element.css('opacity', op);
            element.css('filter', 'alpha(opacity=' + op * 100 + ')');
            op += op * 0.1;

            if (op >= .5)
                clearInterval(timer);
        }
    }, 100);
};

iGlobal.ellipse.add = function (model) {

    if (model != undefined) {
        $(model.parentDiv).append(iGlobal.ellipse.html());
    }
    else {
        $('body').append(iGlobal.ellipse.html());
    }
};

iGlobal.pager.init = function (model) {

    iGlobal.pager.recordType = model.recordType == '' || model.recordType == undefined || model.recordType == null ? 'rows' : model.recordType;
    iGlobal.pager.id = model.divID.substring(1, model.divID.length);
    iGlobal.pager.total = model.currentJsonData.recordsFiltered;
    iGlobal.pager.stop = model.currentJsonData.data != undefined ? model.params.start + model.currentJsonData.data.length : 0;
    iGlobal.pager.start = iGlobal.pager.stop > 0 ? (model.params.start + 1) : 0;
    iGlobal.pager.isFirstPage = model.params.start === 0 ? true : false;
    iGlobal.pager.isLastPage = model.params.start + model.params.length >= iGlobal.pager.total + 1 ? true : false;
    iGlobal.pager.isMoreThanOnePage = iGlobal.pager.isFirstPage && iGlobal.pager.isLastPage || model.params.length < 0 ? false : true;

    iGlobal.pager.btnState();
    iGlobal.pager.pageState(model);
    iGlobal.pager.html();
    iGlobal.pager.navExtentions(model);
    //iGlobal.pager.append(model);

    $(model.divID + '_wrapper .col-sm-6:eq(0) select.form-control:first').addClass('btn-default iris-pager-nav-btn ').removeClass('custom-select custom-select-sm form-control-sm').css({ 'border-right': 0 });
    $(model.divID + '_info').parent().parent().hide();
};

iGlobal.pager.btnState = function () {

    iGlobal.pager.btnFirst = '';
    iGlobal.pager.btnPrev = '';
    iGlobal.pager.btnNext = '';
    iGlobal.pager.btnLast = '';
    iGlobal.pager.disPageSelect = '';
    iGlobal.pager.showPageSelectOption = true;
    iGlobal.pager.btnStatus = '';

    if (iGlobal.pager.isFirstPage && iGlobal.pager.isMoreThanOnePage) {
        //disable first and prev
        iGlobal.pager.btnFirst = iGlobal.pager.disabled;
        iGlobal.pager.btnPrev = iGlobal.pager.disabled;
        iGlobal.pager.btnNext = '';
        iGlobal.pager.btnLast = '';
    }
    else if (iGlobal.pager.isLastPage && iGlobal.pager.isMoreThanOnePage) {
        //disable last and next
        iGlobal.pager.btnFirst = '';
        iGlobal.pager.btnPrev = '';
        iGlobal.pager.btnNext = iGlobal.pager.disabled;
        iGlobal.pager.btnLast = iGlobal.pager.disabled;
    }
    else if (!iGlobal.pager.isMoreThanOnePage) {
        //disable all
        iGlobal.pager.btnFirst = iGlobal.pager.disabled;
        iGlobal.pager.btnPrev = iGlobal.pager.disabled;
        iGlobal.pager.btnNext = iGlobal.pager.disabled;
        iGlobal.pager.btnLast = iGlobal.pager.disabled;
        iGlobal.pager.disPageSelect = iGlobal.pager.disabled;
        iGlobal.pager.showPageSelectOption = false;
    }
    else if (!iGlobal.pager.isFirstPage && !iGlobal.pager.isLastPage && iGlobal.pager.isMoreThanOnePage) {
        //disable none
        iGlobal.pager.btnFirst = '';
        iGlobal.pager.btnPrev = '';
        iGlobal.pager.btnNext = '';
        iGlobal.pager.btnLast = '';
    }
};

iGlobal.pager.pageState = function (model) {

    iGlobal.pager.pageTotal = Math.ceil(model.currentJsonData.recordsFiltered / tables[model.tableId].ajax.params().length);
    iGlobal.pager.currentPageSelected = (tables[model.tableId].ajax.params().start + tables[model.tableId].ajax.params().length) / tables[model.tableId].ajax.params().length;
    iGlobal.pager.pageHtml = '';

    if (iGlobal.pager.showPageSelectOption) {
        for (i = 1; i < iGlobal.pager.pageTotal + 1; i++) {
            if (iGlobal.pager.currentPageSelected == i) {
                iGlobal.pager.pageHtml += '<option value="' + (i) + '" selected>' + (i) + '</option>';
            }
            else {
                iGlobal.pager.pageHtml += '<option value="' + (i) + '">' + (i) + '</option>';
            }
        }
    }
};

iGlobal.pager.html = function () {

    if (iGlobal.pager.btnStatus == '' || iGlobal.pager.btnStatus == undefined || iGlobal.pager.btnStatus == null)
        iGlobal.pager.btnGoto = '<select data-owner="' + iGlobal.pager.id + '" data-cmd="goto" name="' + iGlobal.pager.id + '_pageSelect" aria-controls="' + iGlobal.pager.id + '" class="form-control btn btn-default iris-pager-nav-select iris-pager-nav-btn" title="Current Page" style="width: 70px;" ' + iGlobal.pager.disPageSelect + '>' + iGlobal.pager.pageHtml + '</select>';
    else {

        iGlobal.pager.btnGoto = '<select data-owner="' + iGlobal.pager.id + '" data-cmd="goto" name="' + iGlobal.pager.id + '_pageSelect" aria-controls="' + iGlobal.pager.id + '" class="form-control btn btn-default iris-pager-nav-select iris-pager-nav-btn" title="Current Page" style="width: 70px;"' + iGlobal.pager.disPageSelect + '>' + iGlobal.pager.pageHtml + '</select>';
    }

    iGlobal.pager.navHtml =
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="snap_left" name="btnScrollSnapLeft" id="' + iGlobal.pager.id + '_btnScrollSnapLeft" class="btn btn-default iris-pager-nav" style="" title="Snap Table Left">' +
        '<i class="mdi mdi-format-horizontal-align-left"></i>' +
        '</a>' +
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="first" name="btnPageFirst" id="' + iGlobal.pager.id + '_btnPageFirst" class="btn btn-default iris-pager-nav iris-pager-nav-btn" style="" title="First Page" ' + iGlobal.pager.btnFirst + '>' +
        //'<i class="fa fa-fast-backward"></i>' +
        '<i class="mdi mdi-page-first"></i>' +
        '</a>' +
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="previous" name="btnPagePrev" id="' + iGlobal.pager.id + '_btnPagePrev" class="btn btn-default iris-pager-nav iris-pager-nav-btn" style="" title="Previous Page" ' + iGlobal.pager.btnPrev + '>' +
        //'<i class="fa fa-backward"></i>' +
        '<i class="mdi mdi-chevron-left"></i>' +
        '</a>' +
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="next" name="btnPageNext" id="' + iGlobal.pager.id + '_btnPageNext" class="btn btn-default iris-pager-nav iris-pager-nav-btn" style="border:" title="Next Page" ' + iGlobal.pager.btnNext + '>' +
        //'<i class="fa fa-forward"></i>' +
        '<i class="mdi mdi-chevron-right"></i>' +
        '</a>' +
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="last" name="btnPageLast" id="' + iGlobal.pager.id + '_btnPageLast" class="btn btn-default iris-pager-nav iris-pager-nav-btn" style="" title="Last Page" ' + iGlobal.pager.btnLast + '>' +
        //'<i class="fa fa-fast-forward"></i>' +
        '<i class="mdi mdi-page-last"></i>' +
        '</a>' +
        '<a type="button" data-owner="' + iGlobal.pager.id + '" data-cmd="snap_right" name="btnScrollSnapRight" id="' + iGlobal.pager.id + '_btnScrollSnapRight" class="btn btn-default iris-pager-nav" style="" title="Snap Table Right">' +
        '<i class="mdi mdi-format-horizontal-align-right"></i>' +
        '</a>' +
        iGlobal.pager.btnGoto;
};

iGlobal.pager.navExtentions = function (model) {

    iGlobal.pager.ExtensionHTML = '';

    if (model.NavExtension != undefined) {
        for (var i = 0; i < model.NavExtension.length; i++) {
            if (model.NavExtension[i].HTML != undefined) {
                iGlobal.pager.ExtensionHTML += model.NavExtension[i].HTML(iGlobal.pager.id);
            }
        }
    }

    $(model.divID + '_wrapper .iris-pager').remove();
    $(model.divID + '_wrapper .row:eq(0)').children().prop('class', 'col-sm-6');
    $(model.divID + '_wrapper .row:eq(0) .col-sm-6:eq(0)').append(
        '<div id="' + iGlobal.pager.id + '_pager" class="iris-pager">' +
        '<div class="btn-group iris-pager" style="padding-bottom: 3px; padding-left: 0px; padding-right: 0px; display: inline-block !important">' +
        iGlobal.pager.navHtml +
        iGlobal.pager.ExtensionHTML +
        '</div>' +
        '<div class="btn btn-default dataTables_info" name="PageFirst" id="' + iGlobal.pager.id + '_pagerSummary" role="status" aria-live="polite" style="display: inline-block !important; padding-left: 10px; padding-top: 5.5px; height: 34px; float: none !important; border: 0;" disabled>' +
        //'Showing ' + iGlobal.pager.start + ' to ' + iGlobal.pager.stop + ' of ' + iGlobal.pager.total + ' ' + iGlobal.pager.recordType +
        iGlobal.pager.start + ' to ' + iGlobal.pager.stop + ' of ' + iGlobal.pager.total +
        '</div>' +
        '</div>');

    if ($('#queryResults')) {
        $('#queryResults').html('<b>' + iGlobal.pager.total + '</b> records found');
    }

    if (model.NavExtension != undefined) {
        for (var i = 0; i < model.NavExtension.length; i++) {
            if (model.NavExtension[i].FUNCTION != undefined) {
                model.NavExtension[i].FUNCTION(iGlobal.pager.id);
            }
        }
    }

    if (model.NavExtension != undefined) {
        for (var i = 0; i < model.NavExtension.length; i++) {
            if (model.NavExtension[i].BIND != undefined) {
                model.NavExtension[i].BIND(iGlobal.pager.id);
            }
        }
    }

    if (model.NavExtension != undefined) {
        for (var i = 0; i < model.NavExtension.length; i++) {
            if (model.NavExtension[i].CSS != undefined) {
                model.NavExtension[i].CSS(iGlobal.pager.id);
            }
        }
    }
};























































var dt_nav_clicked = function () {

    var btnSelected = $(this).attr('name');
    var ownerId = $(this).data('owner');
    var currentCommand = $(this).data('cmd');

    switch (currentCommand) {

        case 'snap_left':

            $('#' + ownerId).parent().scrollLeft(-$('#' + ownerId).css('width').replace('px', ''));

            break;

        case 'snap_right':

            $('#' + ownerId).parent().scrollLeft(+$('#' + ownerId).css('width').replace('px', ''));

            break;

        default:

            /*irisLoadingPanel.show({
                id: ownerId,
                parentDiv: $($('#' + ownerId).parent().parent())
            });*/
            if (ownerId && currentCommand) {
                tables[ownerId].page(currentCommand).draw('page');
            }
            break;
    }

};

var dt_select_changed = function () {

    var ownerId = $(this).data('owner');

    tables[ownerId].page(+$(this).val() - 1).draw('page');

};

var dt_length_changed = function (e) {

    if ($('body').find('.iris-pager').length > 0) {

        var ownerId = $(this).attr('id').replace('_length', '');
    }
};
$('.iris-pager-nav').bind('click', dt_nav_clicked);
$('.iris-pager-nav-select').bind('change', dt_select_changed);
$('.dataTables_length').bind('change', dt_length_changed);
