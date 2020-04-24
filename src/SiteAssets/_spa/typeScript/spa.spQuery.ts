import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-autofill';
import 'datatables.net-buttons';
import 'datatables.net-fixedheader';
import 'datatables.net-keytable';
import 'datatables.net-responsive';
import 'datatables.net-rowgroup';
import 'datatables.net-select';
import * as spEnv from "./spa.spEnv";
import * as spCRUD from "./spa.spCRUD";
import * as spLoader from "./theLoader";
import * as spData from "./dt-helper";

export var spQuery = (function () {

    var defaultPageSize = 50;

    var nav = '';

    var tableObjects = {};

    function resizeDatatable(e) {
        setTimeout(function () {

            $('.dataTables_scrollBody .table:visible').each(function (i, element) {
                var thisTableID = $(element).prop('id');
                var wrapperID = thisTableID + '_wrapper';

                $('#' + wrapperID).find('.table, .dataTables_scrollHeadInner').css({
                    width: '100%'
                });

                spEnv.tables[$(element).data('table')].columns.adjust();

            });
        }, 100);
    }

    function registerForms() {
        alert('Click Saved');
    }

    function buildtableColumns(m) {
        var temptableColumns = [];
        var temptableColumnDefs = [];
        var hasAttachments = false;
        if (m.tableStructure) {
            if (m.tableStructure.d) {
                var columns = m.tableStructure.d;

                var thisAttachment = _.find(columns.results, function (o) {
                    return o.EntityPropertyName == 'Attachments';
                });
                if (thisAttachment) {
                    hasAttachments = true;

                    temptableColumns.push({
                        data: thisAttachment.EntityPropertyName,
                        orderable: true
                    });
                    temptableColumnDefs.push({
                        'visible': true,
                        'width': '50px',
                        'targets': 0
                    });
                }

                var initVal = thisAttachment ? 1 : 0;

                var loadedNumber = 0;
                for (var i = initVal; i < columns.results.length; i++) {
                    var thisRow = columns.results[(i - initVal)];

                    var hideTheseColumns = ['ContentType'];
                    if (thisRow.spLoadObject) {
                        if ($(m.tableSelector + ' thead th[data-name="' + thisRow.EntityPropertyName + '"]').length > 0 && thisRow.EntityPropertyName != 'Attachments') {
                            if (hideTheseColumns.indexOf(thisRow.EntityPropertyName) == -1) {
                                var orderable = true;

                                var excludeFromOrder = ["MultiChoice", "Note"];
                                
                                if (excludeFromOrder.indexOf(thisRow.TypeAsString) > -1) {
                                    orderable = false;
                                }

                                if (thisRow.AllowMultipleValues == true) {
                                    orderable = false;
                                }

                                temptableColumns.push({
                                    data: thisRow.EntityPropertyName,
                                    orderable: orderable,
                                    'visible': true,
                                });
                                temptableColumnDefs.push({
                                    'visible': true,
                                    'width': '100px',
                                    'targets': loadedNumber
                                });
                            } else {
                                temptableColumns.push({
                                    data: thisRow.EntityPropertyName,
                                    orderable: false,
                                    'visible': false
                                });
                                temptableColumnDefs.push({
                                    'visible': false,
                                    'width': '100px',
                                    'targets': loadedNumber
                                });
                            }
                        }
                        loadedNumber++;
                    }
                }
            }
        }

        tableObjects[m.tableName] = {
            columns: temptableColumns
        };

        return {
            Columns: temptableColumns,
            ColumnDefs: temptableColumnDefs
        };
    }

    function getSelect(m: any) {

        var selectQ = "";
        var expandQ = "";

        var theRequired = _.filter(m.columns, {
            type: "required"
        });
        var theColumns = _.filter(m.columns, {
            type: "column"
        });
        var theLookups = _.filter(m.columns, {
            type: "lookup"
        });

        var theFilters = _.filter(m.filters, {
            type: "filter"
        });

        var theseColumns0 = _.map(theRequired, "column");
        var theseColumns1 = _.map(theColumns, "column");
        var theseColumns2 = _.map(theLookups, "column");

        var columnsA = theseColumns0.concat(theseColumns1);
        columnsA = columnsA.concat(theseColumns2);

        var theseExpands = _.uniq(_.map(theLookups, "expand"));

        if (columnsA.length > 0) {
            selectQ = "$select=" + columnsA.join(",");
        }
        if (theseExpands.length > 0) {
            expandQ = "$expand=" + theseExpands.join(",");
        }

        if (expandQ) {
            selectQ = selectQ + "&" + expandQ;
        }

        if (theFilters.length > 0) {
            var filterConcat = "";
            for (var index = 0; index < theFilters.length; index++) {
                var element = theFilters[index];
                filterConcat += index == 0 ? "(" : "";

                filterConcat += element.filter + (index == (theFilters.length -1) ? "" : " and ");

                filterConcat += index == (theFilters.length -1) ? ")" : "";
            }

            selectQ += "&$filter=" + filterConcat;
        }

        return selectQ;
    }

    function getSelectStruct(m: any) {

        var selectStruct = {
            columns : [],
            filters : [],
            expands : []
        };

        m.itemCall = typeof m.itemCall == "boolean" ? m.itemCall : false;

        var thisSelect = "$select=";
        var thisLookupSelect = '';
        var thisExpand = "&$expand=";

        var hasLookup = false;

        var excludeTheseTypes = ["Lookup", "UserMulti", "User"];

        var hasAttachments = false;

        //Load Columns
        var columns = [];
        var loadedColumns = 0;

        //Load passed in filters
        if(typeof m.queryFilter == "string")
        {
            selectStruct.filters.push({ type : "filter", filter : m.queryFilter });
        }
        else if(typeof m.queryFilter == "object" && Array.isArray(m.queryFilter))
        {
            for (var index = 0; index < m.queryFilter.length; index++) {
                var element = m.queryFilter[index];
                selectStruct.filters.push({ type : "filter", filter : element.queryFilter });
            }            
        }
        
        if (_.find(m.tableStructure.d.results, function (obj) {
                return excludeTheseTypes.indexOf(obj.TypeAsString) == -1;
            })) {
            var Lookups = _.filter(m.tableStructure.d.results, function (obj) {
                return excludeTheseTypes.indexOf(obj.TypeAsString) == -1;
            });

            if (_.find(Lookups, function (o) {
                    return o.InternalName == 'Attachments';
                })) {
                hasAttachments = true;
                selectStruct.columns.push({ type: "lookup", column: "AttachmentFiles", expand: "AttachmentFiles" });
            }

            for (var i = 0; i < Lookups.length; i++) {
                var thisLookup = Lookups[i];
                var prefix = loadedColumns == 0 && !hasAttachments ? '' : ',';

                if (thisLookup.spLoadObject) {
                    selectStruct.columns.push({
                        type: "column",
                        column: thisLookup.InternalName
                    });
                    loadedColumns++;
                }
            }

            selectStruct.columns.push({
                type: "required",
                column: "GUID"
            });
            selectStruct.columns.push({
                type: "required",
                column: "ID"
            });
            selectStruct.columns.push({
                type: "lookup",
                column: "Editor/Title",
                expand: "Editor"
            });
            selectStruct.columns.push({
                type: "required",
                column: "Modified"
            });

            var thisTemplateType = '100';
            if (m.templateType && m.templateType == '101') {
                thisTemplateType = '101';
            } else if (m.tableStructure && m.tableStructure.baseTemplate && m.tableStructure.baseTemplate == '101') {
                thisTemplateType = '101';
            }

            if (thisTemplateType == '101') {
                selectStruct.columns.push({
                    type: "column",
                    column: "EncodedAbsUrl"
                });

                if (!m.itemCall) {                    
                    selectStruct.filters.push({
                        type: "filter",
                        filter: "FSObjType eq 0"
                        //condition: "startswith(ContentTypeId, '0x0101')",
                    });
                }
            }
        }

        //Load Lookups
        if (_.find(m.tableStructure.d.results, function (obj) {
                return excludeTheseTypes.indexOf(obj.TypeAsString) > -1;
            })) {
            var Lookups2 = _.filter(m.tableStructure.d.results, function (obj) {
                return excludeTheseTypes.indexOf(obj.TypeAsString) > -1;
            });

            for (var i2 = 0; i2 < Lookups2.length; i2++) {
                var thisLookup2 = Lookups2[i2];

                if (thisLookup2.spLoadObject) {
                    var userTypes = ["UserMulti", "User"];

                    if (userTypes.indexOf(thisLookup2.TypeAsString) > -1) {
                        var lookupColumns = ["Id", "EMail", "FirstName", "LastName", "WorkPhone", "Office", "Department", "JobTitle", "Title", "SipAddress", "Name"];

                        for (var cols = 0; cols < lookupColumns.length; cols++) {
                            selectStruct.columns.push({
                                type: "lookup",
                                column: thisLookup2.EntityPropertyName + '/' + lookupColumns[cols],
                                expand: thisLookup2.EntityPropertyName
                            });
                        }
                    } else {
                        selectStruct.columns.push({
                            type: "lookup",
                            column: thisLookup2.EntityPropertyName + '/Id',
                            expand: thisLookup2.EntityPropertyName
                        });
                        selectStruct.columns.push({
                            type: "lookup",
                            column: thisLookup2.EntityPropertyName + '/' + thisLookup2.LookupField,
                            expand: thisLookup2.EntityPropertyName
                        });
                    }
                }
            }
        }

        return selectStruct;
    }

    function getOrderBy(m: any) {
        var orderbyPre = '$orderBy=';
        var orderby = '';

        if (m.orderStruct && m.orderStruct.thisOrder && m.orderStruct.theseColumns) {
            for (var c = 0; c < m.orderStruct.thisOrder.length; c++) {
                var thisOrder = m.orderStruct.thisOrder[c];
                var prefix = c == 0 ? '' : ',';

                orderby += prefix + m.orderStruct.theseColumns[thisOrder.column].data + ' ' + thisOrder.dir;
            }
        } else {
            orderby = tableObjects[m.tableName].columns[0].data + ' asc';
        }

        return orderbyPre + orderby;
    }

    function getRestQuery(m: any) {
        var thisSearch = "";
        if (m.search) {
            //	thisSearch = "&$filter=(substringof('" + m.search + "',Title))"
        }

        var useTop = '';
        if (m.data) {
            if (m.data.length) {
                var skipID = 0;

                if (spEnv.tables[m.tableName].originalCaller.list &&
                    spEnv.tables[m.tableName].originalCaller.list.d &&
                    spEnv.tables[m.tableName].originalCaller.list.d &&
                    m.data.start > 0 &&
                    spEnv.tables[m.tableName].originalCaller.list.d.results.length >= m.data.start - 1) {
                    skipID = spEnv.tables[m.tableName].originalCaller.list.d.results[m.data.start - 1].ID;
                }

                //var rowFetch = (tables[m.tableName].originalCaller.list.d.results.length - m.data.start) < m.data.length ? (tables[m.tableName].originalCaller.list.d.results.length - m.data.start) : m.data.length;
                var rowFetch = 5000;
                useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=" + skipID) + "&$top=" + (rowFetch) + "&";
            }
        } else {
            useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=5000&";
        }

        return m.tableStructure.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + m.ColumnsSelect + '&' + getOrderBy(m) + thisSearch;
    }

    function conformDataToSharePointRest(e: any, settings: any, data: any, xtra: any) {
        var thisTable = $('#' + settings.sInstance).data('table');

        var thisOrder = data.order;

        if (spEnv.tables[thisTable]) {
            var thisTableMeta = spEnv.tables[thisTable].originalCaller;

            thisTableMeta.orderStruct = {
                thisOrder: thisOrder,
                theseColumns: tableObjects[thisTable].columns
            };
            thisTableMeta.data = data;
            thisTableMeta.search = $('#' + thisTable + '_filter input[type="search"]').val();

            var newRestQ = getRestQuery(thisTableMeta);

            spEnv.tables[thisTable].originalCaller.xhrReq = JSON.parse(JSON.stringify(data));
            spEnv.tables[thisTable].originalCaller.currentCall = newRestQ;

            //tables[thisTable].ajax.url('#' + newRestQ);
            if (data.start == 0) {
                spEnv.tables[thisTable].ajax.url(newRestQ);
            } else {
                spEnv.tables[thisTable].ajax.url(getRestCount(thisTableMeta));
            }
        }

        data.columns = [];
        data.order = [];
        //console.log('Query by:'  + settings.sInstance);
    }

    function getDataDictionaryQuery(m: any) {

        var useTop = '';
        useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=" + spEnv.spSettings.maxQueryItems + '&';
        return m.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + '$Select=ID' + '&' + getOrderBy(m);
    }

    function getRestCount(m: any) {
        return m.tableStructure.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/ItemCount";
    }

    function conformRestDataToDataTable(e: any, settings: any, json: any, xhr: any, xtra: any) {
        json = json ? json : {};
        json.value = json.value ? json.value : [];

        var ServerCall = Array.isArray(json.value);

        if (!$('table#' + xtra.tableName).is(':visible')) {
            json.data = [];
            json.start = 0;
            json.length = defaultPageSize;
            json.recordsTotal = 0;
            json.recordsFiltered = 0;

            return json;
        }

        if (ServerCall) {
            json.spData = JSON.parse(JSON.stringify(json.value));

            for (var d = 0; d < json.value.length; d++) {
                var d2 = json.value[d];

                for (var o in d2) {
                    if (o.includes('@odata.navigationLinkUrl', 0)) {
                        var scanThisName = o.replace('@odata.navigationLinkUrl', '');
                        if (d2[scanThisName] == undefined) {
                            d2[scanThisName] = '';
                        }
                    }


                    if (d2[o] != undefined && typeof d2[o] == 'object') {
                        if (Array.isArray(d2[o])) {
                            var content = JSON.stringify(d2[o]);

                            d2[o] = '<span class="hide-json" data-type="JSON" data-size="' + content.length + '" data-typeof="Array">' + JSON.stringify(d2[o]) + '</span><span class="lync-presence"></span>';
                        } else {
                            var content2 = JSON.stringify(d2[o]);

                            d2[o] = '<span class="hide-json" data-type="JSON" data-size="' + content2.length + '" data-typeof="Object">' + content2 + '</span><span class="lync-presence"></span>';
                        }
                    } else if (d2[o] == undefined) {
                        d2[o] = '';
                    } else if (typeof d2[o] === "boolean") {
                        if (o.toLowerCase() == "attachments") {
                            if (d2[o]) {
                                d2[o] = spEnv.$pa.env.fileAttachment();
                            } else {
                                d2[o] = '';
                            }
                        } else {
                            if (d2[o]) {
                                d2[o] = "Yes";
                            } else {
                                d2[o] = "No";
                            }
                        }
                    }
                }
            }


            var thisTable = $('#' + settings.sInstance).data('table');
            var thisTableMeta = spEnv.tables[thisTable].originalCaller;

            json.recordsTotal = json.value.length; // ListCount.d.ItemCount;
            json.recordsFiltered = json.value.length;

            json.fullData = json.value;
            var tempData = returnPagedData({
                meta: spEnv.tables[thisTable].originalCaller.xhrReq,
                data: json.fullData,
                start: 0,
                length: spEnv.tables && spEnv.tables[xtra.tableName] && spEnv.tables[xtra.tableName].originalCaller && spEnv.tables[xtra.tableName].originalCaller.xhrReq ? spEnv.tables[xtra.tableName].originalCaller.xhrReq.length : defaultPageSize
            });

            json.data = tempData.data;
            json.recordsTotal = tempData.recordsTotal;
            json.recordsFiltered = tempData.recordsFiltered;

            delete json.value;
        } else {
            json.fullData = spEnv.mGlobal[xtra.path][xtra.tableName].currentJsonData.fullData;
            var tempData2 = returnPagedData({
                meta: {},
                data: spEnv.mGlobal[xtra.path][xtra.tableName].currentJsonData.fullData,
                start: spEnv.tables[xtra.tableName].originalCaller.xhrReq.start,
                length: spEnv.tables[xtra.tableName].originalCaller.xhrReq.length
            });
            json.data = tempData2.data;
            json.recordsTotal = tempData2.recordsTotal;
            json.recordsFiltered = tempData2.recordsFiltered;
            json.spData = spEnv.mGlobal[xtra.path][xtra.tableName].currentJsonData.spData;
        }

        if (spEnv.mGlobal[xtra.path][xtra.tableName] != undefined) {
            spEnv.mGlobal[xtra.path][xtra.tableName].currentJsonData = json;

        }

        return json;
    }

    function returnPagedData(m: any) {
        var pagedArray = [];
        var data = JSON.parse(JSON.stringify(m.data));
        var startRow = m.start > 0 ? m.start : 0;
        var endRow = startRow + m.length;

        endRow = endRow > data.length ? data.length : endRow;

        //pagedArray = data.splice(startRow, endRow);
        var recordsFiltered = data.length;
        if (m.meta && m.meta.search && m.meta.search.value) {
            var searchStageData = data;

            var conditionSyntax = spEnv.$pa.env.spSearchCondition({
                objectName : "o",
                columns: m.meta.columns,
                search: m.meta.search
            });

            var searchData = _.filter(searchStageData, function (o) {                
                return eval(conditionSyntax);
            });

            var endRowLength = searchData.length <= endRow ? searchData.length : endRow;
            for (var r = startRow; r < endRowLength; r++) {
                pagedArray.push(searchData[r]);
            }

            recordsFiltered = searchData.length;
        } else {
            for (var r2 = startRow; r2 < endRow; r2++) {
                pagedArray.push(data[r2]);
            }
        }

        return {
            data: pagedArray,
            recordsTotal: data.length, // ListCount.d.ItemCount;
            recordsFiltered: recordsFiltered

        };
    }

    function fnDrawCallback(m: any, oSettings: any, json: any) {
        $('.dataTables_scrollHead th.css_dt_' + m.tableName + '.css_Attachments').html(spEnv.$pa.env.fileAttachment());
        $('.css_dt_' + m.tableName + '.css_Attachments').css({
            width: '50px',
            'min-width': '50px',
            'max-width': '50px'
        });

        var thisData = spEnv.tables[m.tableName].ajax.json().data;

        for (var thisRow = 0; thisRow < thisData.length; thisRow++) {
            $('#' + m.tableID + ' tbody tr:eq(' + thisRow + ')').attr({
                'id': thisData[thisRow].GUID,
                'p_id': thisData[thisRow].ID
            });
        }

        if (spEnv.tables[m.tableName] && spEnv.tables[m.tableName].lastRow != undefined && spEnv.tables[m.tableName].lastRow && spEnv.tables[m.tableName].lastRow.id && $('#' + spEnv.tables[m.tableName].lastRow.id + ':visible').length) {

            $('#' + spEnv.tables[m.tableName].lastRow.id + ':visible').click();
        }

        $('[data-toggle="tab"]').unbind('click', resizeDatatable);
        $('[data-toggle="tab"]').bind('click', resizeDatatable);

        $(window).unbind('resize', resizeDatatable);
        $(window).bind('resize', resizeDatatable);
        setTimeout(function () {
            $('.dataTable:visible').find('#' + m.tableID + '_wrapper .dataTables_scrollHeadInner .table:hidden, #' + m.tableID + '_wrapper .dataTables_scrollHeadInner:hidden, .dataTable').css('width', '100%');
        }, 300);

        var rootObject = spCRUD.spCRUD.data();
        if (rootObject.lastSave && (rootObject.lastSave.action && rootObject.lastSave.action.action != undefined && rootObject.lastSave.action.action == "save") && rootObject.lastSave.action.loaded == false) {
            rootObject.lastSave.action.loaded = true;
            spCRUD.spCRUD.reloadEditForm();
        }
    }

    function refreshServerData(m) {
        var owner = $(this).data('owner');

        if (spEnv.tables[owner]) {
            spEnv.tables[owner].ajax.reload();
        }
    }

    function genTable(m: any) {

        if (m.tableName && m.tableSelector) {
            spEnv.mGlobal.page[m.tableName] = {
                currentJsonData: {}
            };

            var ColumnsModel = buildtableColumns(m);

            var selectStruct = getSelectStruct(m);
            m.ColumnsSelect = getSelect(selectStruct);
            var modelObjPath = m.path == undefined ? 'page' : m.path;
            m.path = modelObjPath;

            var DataTableInMemory = {
                "processing": true,
                "serverSide": true,
                "ajax": {
                    type: "Get",
                    url: getRestQuery(m)
                },
                "dom": m.dom != undefined ? m.dom : "<'row'<'col-sm-6'l><'col-sm-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
                "oLanguage": m.oLanguage != undefined ? m.oLanguage : {
                    "sLengthMenu": "_MENU_",
                    "sSearch": "_INPUT_",
                    "sSearchPlaceholder": "Search..."
                },
                "scrollX": true,
                "scrollY": "400px",
                "lengthMenu": [
                    [5, 10, 25, 50, 100, 200, 300, 400, 500, 1000],
                    [5, 10, 25, 50, 100, 200, 300, 400, 500, 1000]
                ],
                "pageLength": m.pageLength != undefined && m.pageLength != '' ? m.pageLength : defaultPageSize,
                "autoWidth": false,
                "columns": ColumnsModel.Columns,
                "columnDefs": ColumnsModel.ColumnDefs,
                "searching": true,
                "searchDelay": 2000,
                "scroller": true,
                "fnInitComplete": function () {
                    var eachColumn = spEnv.tables[m.tableName].columns()[0];
                    $('#' + m.tableName + '_filter input[type="search"]').unbind();
                    $('#' + m.tableName + '_filter input[type="search"]').data('owner', m.tableName);

                    $('#' + m.tableName + '_filter input[type="search"]').on('change keyup search',
                        _.debounce(function () {
                            var thisObjectData = $(this).data();
                            if (thisObjectData && thisObjectData.owner && spEnv.tables && spEnv.tables[thisObjectData.owner]) {
                                spEnv.tables[m.tableName].search($(this).val()).draw();
                            }
                        }, 1000));

                    $('#' + m.tableName + ' input[type="search"]').addClass('iris-pager-nav');
                    var thisParent = $('#' + m.tableName + '_filter').parent();
                    $(thisParent).addClass('iris-text-align-right');
                    $('#' + m.tableName + '_filter').addClass('iris-inline-block');
                    $('#' + m.tableName + '_filter').parent('div').append('<div id="' + m.tableName + '_right_actions" class="iris-right-actions"></div>')
                    
                    $('#' + m.tableName + '_right_actions').append(spEnv.$pa.env.datatable_refresh_html({
                        owner: m.tableName
                    }));

                    $('.actionRefresh').unbind('click', refreshServerData);
                    $('.actionRefresh').bind('click', refreshServerData);
                },
                "fnDrawCallback": function (oSettings, json) {

                    $('#' + m.tableName + '_wrapper .dataTables_scrollHead th').each(function (th, thElement) {
                        var thisElementData = $(thElement).data();
                        $(thElement).html(_.startCase($(thElement).html()));

                        $('#' + m.tableName + ' tbody tr').each(function (tr, trElement) {
                            var columnName = thisElementData.name.replace(new RegExp(" ", "g"), "_");

                            $(trElement).find('td:eq(' + th + ')').addClass('css_dt_' + m.tableName + ' css_' + columnName);
                            for (var prop in thisElementData) {
                                $(trElement).find('td:eq(' + th + ')').attr('data-' + prop, thisElementData[prop]);
                            }
                        });
                    });

                    if (m.tableStructure && m.tableStructure.table && m.tableStructure.table.css) {
                        $('.css_dt_' + m.tableName).css(m.tableStructure.table.css);
                    }

                    if (m.tableStructure && m.tableStructure.table && m.tableStructure.table.columns && Array.isArray(m.tableStructure.table.columns)) {
                        var thisTCArray = m.tableStructure.table.columns;
                        for (var tc = 0; tc < thisTCArray.length; tc++) {
                            var thisTableColumn = thisTCArray[tc];
                            var columnName = thisTableColumn.name.replace(new RegExp(" ", "g"), "_");
                            $('.css_dt_' + m.tableName + '.css_' + columnName).css(thisTableColumn.css);
                        }
                    }

                    var settings = {
                        type: "default",
                        redirectToProfile: true
                    };

                    $('#' + m.tableName + ' .hide-json[data-type="JSON"][data-typeof="Object"]').each(function (objectIndex, objectElement) {
                        var thisJSONstring = $(objectElement).html();

                        var thisJSON = JSON.parse(thisJSONstring);
                        if (thisJSON['odata.type']) {
                            if (thisJSON['odata.type'] == "SP.Data.UserInfoItem") {
                                if (thisJSON.SipAddress) {
                                    $(objectElement).siblings('.lync-presence').append('<span class="user-table-style" data-iden="' + thisJSON.Id + '">');
                                    $(objectElement).siblings('.lync-presence').find('[data-iden="' + thisJSON.Id + '"]').html('<i class="fa fa-user-circle-o"></i> ' + thisJSON.Title);
                                    //$('.lync-presence').createpresence('i:0%23.f|membership|risiJa@state.gov', settings)
                                } else {
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
                                    } else {
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
                                for (var iObject in thisJSONObject) {
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
                        spData.iGlobal.pager.init({
                            tableId: thisTempTableName,
                            divID: '#' + thisTempTableName,
                            currentJsonData: spEnv.mGlobal[modelObjPath][thisTempTableName].currentJsonData,
                            params: spEnv.tables[thisTempTableName].ajax.params(),
                            recordType: ''
                        });

                        $('.iris-pager-nav').unbind('click', spData.dt_nav_clicked);
                        $('.iris-pager-nav-select').unbind('change', spData.dt_select_changed);
                        $('.dataTables_length').unbind('change', spData.dt_length_changed);

                        $('.iris-pager-nav').bind('click', spData.dt_nav_clicked);
                        $('.iris-pager-nav-select').bind('change', spData.dt_select_changed);
                        $('.dataTables_length').bind('change', spData.dt_length_changed);

                    }, 10);

                    fnDrawCallback(m, oSettings, json);

                    spLoader.theLoader.hide({
                        id: m.tableName + 'datatable'
                    });
                }
            }

            spEnv.tables[m.tableName] = $(m.tableSelector)
                .on('preXhr.dt', function (e, settings, data) {
                    spLoader.theLoader.show({
                        id: m.tableName + 'datatable'
                    });

                    conformDataToSharePointRest(e, settings, data, m);

                })
                .on('xhr.dt', function (e, settings, json, xhr) {

                    json = conformRestDataToDataTable(e, settings, json, xhr, m);

                }).DataTable(DataTableInMemory);

            spEnv.tables[m.tableName].originalCaller = m;
        }
    }

    var temp = [];

    return {
        genTable: function (m: any) {
            genTable(m);
        },
        getTables: function () {
            return tableObjects;
        },
        nav: function (m: any) {
            nav = m;
        },
        getItemQuery: function (m: any) {
            var struct = getSelectStruct(m);
            var stringQuery = getSelect(struct);
            return stringQuery;
        }
    };
})();