$.fn.spQuery = (function () {

    var defaultPageSize = 50;

    var nav = '';

    var tableObjects = {};

    function resizeDatatable(e) {
        setTimeout(function () {

            $('.dataTables_scrollBody .table:visible').each(function (i, element) {
                var thisTableID = $(element).prop('id');
                var wrapperID = thisTableID + '_wrapper';

                $('#' + wrapperID).find('.table, .dataTables_scrollHeadInner').css({ width: '100%' });

                tables[$(element).data('table')].columns.adjust();

            });
        }, 100);
    }

    function registerForms() {
        alert('Click Saved')
    }

    function buildtableColumns(m) {
        var temptableColumns = [];
        var temptableColumnDefs = [];

        if (m.tableStructure) {
            if (m.tableStructure.d) {
                var columns = m.tableStructure.d;

                var thisAttachment = _.find(columns.results, function (o) { return o.EntityPropertyName == 'Attachments' });
                if (thisAttachment) {
                    hasAttachments = true,

                        temptableColumns.push({ data: thisAttachment.EntityPropertyName, orderable: true });
                    temptableColumnDefs.push({ 'visible': true, 'width': '50px', 'targets': 0 });
                }

                var initVal = thisAttachment ? 1 : 0;


                for (var i = initVal; i < columns.results.length; i++) {
                    var thisRow = columns.results[(i - initVal)];

                    var hideTheseColumns = ['ContentType'];

                    if ($(m.tableSelector + ' thead th[data-name="' + thisRow.EntityPropertyName + '"]').length > 0 && thisRow.EntityPropertyName != 'Attachments') {
                        if (hideTheseColumns.indexOf(thisRow.EntityPropertyName) == -1) {
                            var orderable = true;

                            if (thisRow.TypeAsString == "MultiChoice") {
                                orderable = false;
                            }

                            if (thisRow.AllowMultipleValues == true) {
                                orderable = false;
                            }

                            temptableColumns.push({ data: thisRow.EntityPropertyName, orderable: orderable });
                            temptableColumnDefs.push({ 'visible': true, 'width': '100px', 'targets': i });
                        }
                        else {
                            temptableColumns.push({ data: thisRow.EntityPropertyName, orderable: false });
                            temptableColumnDefs.push({ 'visible': false, 'width': '100px', 'targets': i });
                        }
                    }
                }
            }
        }

        tableObjects[m.tableName] = { columns: temptableColumns }

        return { Columns: temptableColumns, ColumnDefs: temptableColumnDefs }
    }

    function getSelect(m) {
        var thisSelect = "$select=";
        var thisLookupSelect = ''
        var thisExpand = "&$expand=";

        var hasLookup = false;

        var excludeTheseTypes = ["Lookup", "UserMulti", "User"]

        var hasAttachments = false;

        if (_.find(m.tableStructure.d.results, function (obj) { return excludeTheseTypes.indexOf(obj.TypeAsString) == -1 })) {
            var Lookups = _.filter(m.tableStructure.d.results, function (obj) { return excludeTheseTypes.indexOf(obj.TypeAsString) == -1 });

            if (_.find(Lookups, function (o) { return o.InternalName == 'Attachments' })) {
                hasAttachments = true,
                    thisSelect += 'AttachmentFiles';
            }

            for (var i = 0; i < Lookups.length; i++) {
                var thisLookup = Lookups[i];
                var prefix = i == 0 && !hasAttachments ? '' : ','

                thisSelect += prefix + thisLookup.InternalName;

                //if(thisLookup.InternalName == 'Attachments')
                //{
                //	hasAttachments = true;
                //	thisSelect += prefix + 'AttachmentFiles';
                //}       			        			
            }

            thisSelect += prefix + 'GUID,ID';

            if (m.templateType == '101') {
                thisSelect += prefix + 'EncodedAbsUrl';
            }
        }

        if (_.find(m.tableStructure.d.results, function (obj) { return excludeTheseTypes.indexOf(obj.TypeAsString) > -1 })) {
            var Lookups = _.filter(m.tableStructure.d.results, function (obj) { return excludeTheseTypes.indexOf(obj.TypeAsString) > -1 });

            for (var i = 0; i < Lookups.length; i++) {
                var thisLookup = Lookups[i];

                var userTypes = ["UserMulti", "User"]

                if (userTypes.indexOf(thisLookup.TypeAsString) > -1) {
                    var lookupColumns = ["Id", "EMail", "FirstName", "LastName", "WorkPhone", "Office", "Department", "JobTitle", "Title", "SipAddress", "Name"]

                    for (var cols = 0; cols < lookupColumns.length; cols++) {
                        thisLookupSelect += ',' + thisLookup.EntityPropertyName + '/' + lookupColumns[cols]
                    }
                }
                else {
                    thisLookupSelect += ',' + thisLookup.EntityPropertyName + '/' + thisLookup.LookupField,
                        thisLookupSelect += ',' + thisLookup.EntityPropertyName + '/Id'
                }
            }

            for (var i = 0; i < Lookups.length; i++) {
                var thisLookup = Lookups[i];
                var prefix = i == 0 ? '' : ','
                thisExpand += prefix + thisLookup.EntityPropertyName
            }


            hasLookup = true;
        }

        if (hasAttachments) {
            var prefix = hasLookup ? ',' : ''
            thisExpand += prefix + 'AttachmentFiles';
            hasLookup = true;
        }

        thisSelect = hasLookup ? thisSelect + thisLookupSelect + thisExpand : thisSelect;

        return thisSelect;
    }

    function getOrderBy(m) {
        var orderbyPre = '$orderBy=';
        var orderby = '';

        if (m.orderStruct && m.orderStruct.thisOrder && m.orderStruct.theseColumns) {
            for (var c = 0; c < m.orderStruct.thisOrder.length; c++) {
                var thisOrder = m.orderStruct.thisOrder[c];
                var prefix = c == 0 ? '' : ','

                orderby += prefix + m.orderStruct.theseColumns[thisOrder.column].data + ' ' + thisOrder.dir
            }
        }
        else {
            orderby = tableObjects[m.tableName].columns[0].data + ' asc';
        }

        return orderbyPre + orderby;
    }

    function getRestQuery(m) {
        var thisSearch = "";
        if (m.search) {
            //	thisSearch = "&$filter=(substringof('" + m.search + "',Title))"
        }

        var useTop = '';
        if (m.data) {
            if (m.data.length) {
                var skipID = 0;

                if (tables[m.tableName].originalCaller.list &&
                    tables[m.tableName].originalCaller.list.d &&
                    tables[m.tableName].originalCaller.list.d &&
                    m.data.start > 0 &&
                    tables[m.tableName].originalCaller.list.d.results.length >= m.data.start - 1) {
                    skipID = tables[m.tableName].originalCaller.list.d.results[m.data.start - 1].ID
                }

                //var rowFetch = (tables[m.tableName].originalCaller.list.d.results.length - m.data.start) < m.data.length ? (tables[m.tableName].originalCaller.list.d.results.length - m.data.start) : m.data.length;
                var rowFetch = 5000;
                useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=" + skipID) + "&$top=" + (rowFetch) + "&";
            }
        }
        else {
            useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=5000&";
        }

        return m.tableStructure.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + m.ColumnsSelect + '&' + getOrderBy(m) + thisSearch;
    }

    function conformDataToSharePointRest(e, settings, data, xtra) {
        var thisTable = $('#' + settings.sInstance).data('table');

        var thisOrder = data.order;

        if (tables[thisTable]) {
            var thisTableMeta = tables[thisTable].originalCaller;

            thisTableMeta.orderStruct = { thisOrder: thisOrder, theseColumns: tableObjects[thisTable].columns }
            thisTableMeta.data = data;
            thisTableMeta.search = $('#' + thisTable + '_filter input[type="search"]').val();

            var newRestQ = getRestQuery(thisTableMeta);

            tables[thisTable].originalCaller.xhrReq = JSON.parse(JSON.stringify(data));
            tables[thisTable].originalCaller.currentCall = newRestQ;

            //tables[thisTable].ajax.url('#' + newRestQ);
            if (data.start == 0) {
                tables[thisTable].ajax.url(newRestQ);
            }
            else {
                tables[thisTable].ajax.url(getRestCount(thisTableMeta))
            }
        }

        data.columns = [];
        data.order = [];
        //console.log('Query by:'  + settings.sInstance);
    }

    function getDataDictionaryQuery(m) {

        var useTop = '';
        useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=" + spSettings.maxQueryItems + '&';
        return m.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + '$Select=ID' + '&' + getOrderBy(m);
    }

    function getRestCount(m) {
        return m.tableStructure.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/ItemCount";
    }

    function conformRestDataToDataTable(e, settings, json, xhr, xtra) {
    	json = json ? json : {};
    	json.value = json.value ? json.value : [];
    
        var ServerCall = IsArray(json.value);

        if (!$('table#' + xtra.tableName).is(':visible')) {
            json.data = [];
            json.start = 0;
            json.length = defaultPageSize;
            json.recordsTotal = 0;
            json.recordsFiltered = 0;

            return json
        }

        if (ServerCall) {
            json.spData = JSON.parse(JSON.stringify(json.value));

            for (var d = 0; d < json.value.length; d++) {
                var d2 = json.value[d];

                for (o in d2) {
                    if (o.includes('@odata.navigationLinkUrl')) {
                        var scanThisName = o.replace('@odata.navigationLinkUrl', '');
                        if (d2[scanThisName] == undefined) {
                            d2[scanThisName] = '';
                        }
                    }


                    if (d2[o] != undefined && typeof d2[o] == 'object') {
                        if (Array.isArray(d2[o])) {
                            var content = JSON.stringify(d2[o]);

                            d2[o] = '<span class="hide-json" data-type="JSON" data-size="' + content.length + '" data-typeof="Array">' + JSON.stringify(d2[o]) + '</span><span class="lync-presence"></span>';
                        }
                        else {
                            var content = JSON.stringify(d2[o]);

                            d2[o] = '<span class="hide-json" data-type="JSON" data-size="' + content.length + '" data-typeof="Object">' + content + '</span><span class="lync-presence"></span>'
                        }
                    }
                    else if (d2[o] == undefined) {
                        d2[o] = '';
                    }
                    else if (typeof d2[o] === "boolean") {
                        if (o.toLowerCase() == "attachments") {
                            if (d2[o]) {
                                d2[o] = $.fn.spEnvironment.fileAttachment();
                            }
                            else {
                                d2[o] = '';
                            }
                        }
                        else {
                            if (d2[o]) {
                                d2[o] = "Yes";
                            }
                            else {
                                d2[o] = "No";
                            }
                        }
                    }
                }
            }


            var thisTable = $('#' + settings.sInstance).data('table');
            var thisTableMeta = tables[thisTable].originalCaller;

            json.recordsTotal = json.value.length; // ListCount.d.ItemCount;
            json.recordsFiltered = json.value.length;

            json.fullData = json.value
            var tempData = returnPagedData({
                meta: tables[thisTable].originalCaller.xhrReq,
                data: json.fullData,
                start: 0,
                length: tables && tables[xtra.tableName] && tables[xtra.tableName].originalCaller && tables[xtra.tableName].originalCaller.xhrReq ? tables[xtra.tableName].originalCaller.xhrReq.length : defaultPageSize
            });

            json.data = tempData.data;
            json.recordsTotal = tempData.recordsTotal;
            json.recordsFiltered = tempData.recordsFiltered;

            delete json.value;
        }
        else {
            json.fullData = mGlobal[xtra.path][xtra.tableName].currentJsonData.fullData;
            var tempData = returnPagedData({
                meta: {},
                data: mGlobal[xtra.path][xtra.tableName].currentJsonData.fullData,
                start: tables[xtra.tableName].originalCaller.xhrReq.start,
                length: tables[xtra.tableName].originalCaller.xhrReq.length
            });
            json.data = tempData.data;
            json.recordsTotal = tempData.recordsTotal;
            json.recordsFiltered = tempData.recordsFiltered;
            json.spData = mGlobal[xtra.path][xtra.tableName].currentJsonData.spData;
        }

        if (mGlobal[xtra.path][xtra.tableName] != undefined) {
            mGlobal[xtra.path][xtra.tableName].currentJsonData = json;
        }

        return json
    }

    function returnPagedData(m) {
        var pagedArray = [];
        var data = JSON.parse(JSON.stringify(m.data));
        var startRow = m.start > 0 ? m.start : 0;
        var endRow = startRow + m.length;

        endRow = endRow > data.length ? data.length : endRow

        //pagedArray = data.splice(startRow, endRow);
        var recordsFiltered = data.length;
        if (m.meta && m.meta.search && m.meta.search.value) {
            var searchStageData = data;

            var conditionSyntax = $.fn.spEnvironment.spSearchCondition({ columns: m.meta.columns, search: m.meta.search });

            var searchData = _.filter(searchStageData, function (o) { return eval(conditionSyntax) })

            var endRowLength = searchData.length <= endRow ? searchData.length : endRow
            for (var r = startRow; r < endRowLength; r++) {
                pagedArray.push(searchData[r]);
            }

            recordsFiltered = searchData.length
        }
        else {
            for (var r = startRow; r < endRow; r++) {
                pagedArray.push(data[r]);
            }
        }

        return {
            data: pagedArray,
            recordsTotal: data.length, // ListCount.d.ItemCount;
            recordsFiltered: recordsFiltered

        };
    }

    function fnDrawCallback(m, oSettings, json) {
        $('.dataTables_scrollHead th.css_dt_' + m.tableName + '.css_Attachments').html($.fn.spEnvironment.fileAttachment());
        $('.css_dt_' + m.tableName + '.css_Attachments').css({ width: '50px', 'min-width': '50px', 'max-width': '50px' });

        var thisData = tables[m.tableName].ajax.json().data;

        for (var thisRow = 0; thisRow < thisData.length; thisRow++) {
            $('#' + m.tableID + ' tbody tr:eq(' + thisRow + ')').attr({ 'id': thisData[thisRow]['GUID'], 'p_id': thisData[thisRow]['ID'] })
        }

        if (tables[m.tableName].lastRow && $('#' + tables[m.tableName].lastRow.id + ':visible').length) {
            $('#' + tables[m.tableName].lastRow.id + ':visible').click();
        }

        $('[data-toggle="tab"]').unbind('click', resizeDatatable);
        $('[data-toggle="tab"]').bind('click', resizeDatatable);

        $(window).unbind('resize', resizeDatatable);
        $(window).bind('resize', resizeDatatable);
        setTimeout(function () {
            $('.dataTable:visible').find('#' + m.tableID + '_wrapper .dataTables_scrollHeadInner .table:hidden, #' + m.tableID + '_wrapper .dataTables_scrollHeadInner:hidden, .dataTable').css('width', '100%');
        }, 300);
    }

    function refreshServerData(m) {
        var owner = $(this).data('owner');

        if (tables[owner]) {
            tables[owner].ajax.reload();
        }
    }

    function genTable(m) {

        if (m.tableName && m.tableSelector) {
            mGlobal.page[m.tableName] = {
                currentJsonData: {}
            };

            var ColumnsModel = buildtableColumns(m);
            m.ColumnsSelect = getSelect(m);
            var modelObjPath = m.path == undefined ? 'page' : m.path;
            m.path = modelObjPath;

            tables[m.tableName] = $(m.tableSelector)
                .on('preXhr.dt', function (e, settings, data) {
                    theLoader.show({ id: m.tableName + 'datatable' });

                    conformDataToSharePointRest(e, settings, data, m);

                })
                .on('xhr.dt', function (e, settings, json, xhr) {

                    json = conformRestDataToDataTable(e, settings, json, xhr, m);

                }).DataTable({
                    "processing": true,
                    "serverSide": true,
                    "ajax": {
                        type: "Get",
                        url: getRestQuery(m)
                    },
                    "dom": m.dom != undefined ? m.dom : "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
                    "oLanguage": m.oLanguage != undefined ? m.oLanguage : { "sLengthMenu": "_MENU_", "sSearch": "_INPUT_", "sSearchPlaceholder": "Search..." },
                    "scrollX": '100%',
                    "lengthMenu": [[5, 10, 25, 50, 100, 200, 300, 400, 500, 1000], [5, 10, 25, 50, 100, 200, 300, 400, 500, 1000]],
                    "pageLength": m.pageLength != undefined && m.pageLength != '' ? m.pageLength : defaultPageSize,
                    "autoWidth": false,
                    "columns": ColumnsModel.Columns,
                    "columnDefs": ColumnsModel.ColumnDefs,
                    "searching": true,
                    "processing": false,
                    "searchDelay": 2000,
                    "scroller": true,
                    "fnInitComplete": function () {
                        var eachColumn = tables[m.tableName].columns()[0];
                        $('#' + m.tableName + '_filter input[type="search"]').unbind();
                        $('#' + m.tableName + '_filter input[type="search"]').data('owner', m.tableName);

                        $('#' + m.tableName + '_filter input[type="search"]').on('change keyup search',
                            _.debounce(function () {
                                var thisObjectData = $(this).data();
                                if (thisObjectData && thisObjectData.owner && tables && tables[thisObjectData.owner]) {
                                    tables[m.tableName].search($(this).val()).draw()
                                }
                            }, 1000));


                        $('#' + m.tableName + ' input[type="search"]').addClass('iris-pager-nav');
                        $('#' + m.tableName + '_filter').append($.fn.spEnvironment.datatable_refresh_html({ owner: m.tableName }));

                        $('.actionRefresh ').unbind('click', refreshServerData);
                        $('.actionRefresh ').bind('click', refreshServerData);
                    },
                    "fnDrawCallback": function (oSettings, json) {

                        $('#' + m.tableName + '_wrapper .dataTables_scrollHead th').each(function (th, thElement) {
                            var thisElementData = $(thElement).data();

                            $('#' + m.tableName + ' tbody tr').each(function (tr, trElement) {

                                $(trElement).find('td:eq(' + th + ')').addClass('css_dt_' + m.tableName + ' css_' + thisElementData.name)
                                for (prop in thisElementData) {
                                    $(trElement).find('td:eq(' + th + ')').attr('data-' + prop, thisElementData[prop]);
                                }
                            });
                        });

                        if (m.tableStructure && m.tableStructure.table && m.tableStructure.table.css) {
                            $('.css_dt_' + m.tableName).css(m.tableStructure.table.css)
                        }

                        if (m.tableStructure && m.tableStructure.table && m.tableStructure.table.columns && IsArray(m.tableStructure.table.columns)) {
                            var thisTCArray = m.tableStructure.table.columns;
                            for (var tc = 0; tc < thisTCArray.length; tc++) {
                                var thisTableColumn = thisTCArray[tc];
                                $('.css_dt_' + m.tableName + '.css_' + thisTableColumn.name).css(thisTableColumn.css);
                            }
                        }



                        var settings = { type: "default", redirectToProfile: true };

                        $('#' + m.tableName + ' .hide-json[data-type="JSON"][data-typeof="Object"]').each(function (objectIndex, objectElement) {
                            var thisJSONstring = $(objectElement).html();

                            var thisJSON = JSON.parse(thisJSONstring)
                            if (thisJSON['odata.type']) {
                                if (thisJSON['odata.type'] == "SP.Data.UserInfoItem") {
                                    if (thisJSON.SipAddress) {
                                        $(objectElement).siblings('.lync-presence').append('<span class="user-table-style" data-iden="' + thisJSON.Id + '">');
                                        $(objectElement).siblings('.lync-presence').find('[data-iden="' + thisJSON.Id + '"]').html('<i class="fa fa-user-circle-o"></i> ' + thisJSON.Title);
                                        //$('.lync-presence').createpresence('i:0%23.f|membership|risiJa@state.gov', settings)
                                    }
                                    else {
                                        $(objectElement).siblings('.lync-presence').append('<span class="user-table-style" data-iden="' + thisJSON.Id + '">');
                                        $(objectElement).siblings('.lync-presence').find('[data-iden="' + thisJSON.Id + '"]').html('<i class="fa fa-group"></i> ' + thisJSON.Name);
                                    }
                                }
                            }
                        });

                        $('#' + m.tableName + ' .hide-json[data-type="JSON"][data-typeof="Array"]').each(function (objectIndex, objectElement) {
                            var thisJSONstring = $(objectElement).html();

                            var thisJSONArray = JSON.parse(thisJSONstring);
                            for (var ii = 0; ii < thisJSONArray.length; ii++) {
                                var thisJSON = thisJSONArray[ii];

                                if (thisJSON['odata.type']) {
                                    if (thisJSON['odata.type'] == "SP.Data.UserInfoItem") {
                                        if (thisJSON.SipAddress) {
                                            $(objectElement).siblings('.lync-presence').append('<span class="user-table-style" data-iden="' + thisJSON.Id + '" style="padding-right: 5px;">');
                                            $(objectElement).siblings('.lync-presence').find('[data-iden="' + thisJSON.Id + '"]').html('<i class="fa fa-user-circle-o"></i> ' + thisJSON.Title);
                                            //$('.lync-presence').createpresence('i:0%23.f|membership|risiJa@state.gov', settings)
                                        }
                                        else {
                                            $(objectElement).siblings('.lync-presence').append('<span class="user-table-style" data-iden="' + thisJSON.Id + '" style="padding-right: 5px;">');
                                            $(objectElement).siblings('.lync-presence').find('[data-iden="' + thisJSON.Id + '"]').html('<i class="fa fa-group"></i> ' + thisJSON.Name);
                                        }
                                    }
                                }
                            }
                        });

                        $('#' + m.tableName + ' [data-stype="DateTime"]').each(function (objectIndex, objectElement) {
                            var thisContent = $(objectElement).html();
                            if (thisContent) {
                                $(objectElement).html(moment(thisContent).format('MM/DD/YYYY'));
                            }
                        });

                        $('#' + m.tableName + ' [data-stype="Lookup"]').each(function (objectIndex, objectElement) {
                            var thisJSONstring = $(objectElement).find('span.hide-json').html();
                            var thisData = $(objectElement).data();

                            if (thisJSONstring) {
                                var thisJSONObject = JSON.parse(thisJSONstring);

                                if (thisJSONObject) {
                                    var excludeThese = ['odata.type', 'odata.id', 'Id'];
                                    var preferredObjectName = '';
                                    for (iObject in thisJSONObject) {
                                        if (excludeThese.indexOf(iObject) == -1) {
                                            preferredObjectName = iObject;
                                        }
                                        //							    	thisData.name
                                    }
                                    $(objectElement).append('<span>' + thisJSONObject[preferredObjectName] + '</span>');
                                }
                            }
                        });

                        setTimeout(function () {

                            var thisTempTableName = m.tableName != undefined ? m.tableName : m.page;
                            $('#' + thisTempTableName + '_wrapper .dataTables_scrollHeadInner .table:hidden, #' + thisTempTableName + '_wrapper .dataTables_scrollHeadInner:hidden').css('width', '100%');
                            iGlobal.pager.init({
                                tableId: thisTempTableName,
                                divID: '#' + thisTempTableName,
                                currentJsonData: mGlobal[modelObjPath][thisTempTableName].currentJsonData,
                                params: tables[thisTempTableName].ajax.params(),
                                recordType: ''
                            });

                            $('.iris-pager-nav').unbind('click', dt_nav_clicked);
                            $('.iris-pager-nav-select').unbind('change', dt_select_changed);
                            $('.dataTables_length').unbind('change', dt_length_changed);

                            $('.iris-pager-nav').bind('click', dt_nav_clicked);
                            $('.iris-pager-nav-select').bind('change', dt_select_changed);
                            $('.dataTables_length').bind('change', dt_length_changed);

                        }, 10);

                        fnDrawCallback(m, oSettings, json);

                        theLoader.hide({ id: m.tableName + 'datatable' });
                    }
                });

            tables[m.tableName].originalCaller = m;
        }
    }

    var temp = []

    return {
        genTable: function (m) { genTable(m); },
        getTables: function () { return tableObjects; },
        nav: function (m) { nav = m },
        getItemQuery: function (m) {
            return getSelect(m);
        }
    }
})();
