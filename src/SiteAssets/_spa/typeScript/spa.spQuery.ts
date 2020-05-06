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
import { spCommon, spAjax } from './spa.spCommon';

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

    function buildtableColumns(m: spaLoadListStruct) {
        var temptableColumns = [];
        var temptableColumnDefs = [];
        var hasAttachments = false;
        if (m) {
            if (m.d) {
                var columns = m.d;

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

                filterConcat += element.filter + (index == (theFilters.length - 1) ? "" : " and ");

                filterConcat += index == (theFilters.length - 1) ? ")" : "";
            }

            selectQ += "&$filter=" + filterConcat;
        }

        return selectQ;
    }

    function getSelectStruct(m: any) {

        var selectStruct = {
            columns: [],
            filters: [],
            expands: []
        };

        m.needsDocLibColumns = typeof m.needsDocLibColumns == "boolean" ? m.needsDocLibColumns : false;

        var excludeTheseTypes = ["Lookup", "UserMulti", "User"];

        var hasAttachments = false;

        //Load Columns
        var columns = [];
        var loadedColumns = 0;

        //Load passed in filters
        if (typeof m.queryFilter == "string") {
            selectStruct.filters.push({ type: "filter", filter: m.queryFilter });
        }
        else if (typeof m.queryFilter == "object" && Array.isArray(m.queryFilter)) {
            for (var index = 0; index < m.queryFilter.length; index++) {
                var element = m.queryFilter[index];
                selectStruct.filters.push({ type: "filter", filter: element.queryFilter });
            }
        }

        if (_.find(m.d.results, function (obj) {
            return excludeTheseTypes.indexOf(obj.TypeAsString) == -1;
        })) {
            var Lookups = _.filter(m.d.results, function (obj) {
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

            if (m.baseTemplate == '101') {
                selectStruct.columns.push({
                    type: "column",
                    column: "EncodedAbsUrl"
                });

                if (!m.needsDocLibColumns) {
                    selectStruct.filters.push({
                        type: "filter",
                        filter: "FSObjType eq 0"
                        //condition: "startswith(ContentTypeId, '0x0101')",
                    });
                }
            }
        }

        //Load Lookups
        if (_.find(m.d.results, function (obj) {
            return excludeTheseTypes.indexOf(obj.TypeAsString) > -1;
        })) {
            var Lookups2 = _.filter(m.d.results, function (obj) {
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

    function triggerFetch(m: any) {
        var trueURL = getRestQuery(m);
        return _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo?justCall=true";
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

        return m.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + m.ColumnsSelect + '&' + getOrderBy(m) + thisSearch;
    }

    async function promiseQuery(m: any) {

        var thePath = "";
        var theName = "";
        var hasOrder = false;
        var theOrder = "";
        var fullURL = "";

        if (typeof m.isDatatable == "boolean" && m.isDatatable) {
            spEnv.tables[m.xtra.tableName].callThePromise = "Loading";
            thePath = m.xtra.path;
            theName = m.xtra.tableName;
            theOrder = getOrderBy(m.xtra);
            hasOrder = theOrder.length > 0 ? true : false;
            fullURL = thePath + "/_api/web/lists/getbytitle('" + theName + "')/items";
        }
        else {
            thePath = m.parentObject.path;
            theName = m.parentObject.name;
            fullURL = thePath;
        }

        var useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=5000";

        var columns = m.struct.columns.filter((objectType: { type: any; }) => objectType.type == "column");
        var required = m.struct.columns.filter((objectType: { type: string; }) => objectType.type == "required");
        var lookup = m.struct.columns.filter((objectType: { type: string; }) => objectType.type == "lookup");

        var eachQueryStruct = [];
        var eachAjax = [];

        //Step 1 perform columnCalls
        var columnChunks = _.chunk(columns, 5);
        //var lookupChunks = _.chunk(lookup, 1);          
        var lookupChunks: unknown[][] = [];

        var grouped = _.groupBy(lookup, 'expand');

        for (var thisCall in grouped) {
            var thisGroup = grouped[thisCall] as unknown[];
            lookupChunks.push(thisGroup);
        }

        //add required to each chunk
        for (var index = 0; index < columnChunks.length; index++) {
            var element = columnChunks[index];

            columnChunks[index] = element.concat(required);
            var currentStruct = { columns: columnChunks[index], filters: m.struct.filters, expand: m.struct.expand };
            eachQueryStruct.push(currentStruct);
            var getSelectParam = getSelect(currentStruct)
            //console.log(getSelectParam);

            var columnChunkURL = "";
            if (typeof m.isDatatable == "boolean" && m.isDatatable) {
                columnChunkURL = fullURL + "?" + useTop + "&" + getSelectParam + (hasOrder ? "&" + theOrder : "")
            }
            else {
                columnChunkURL = fullURL + "?" + getSelectParam;
            }

            eachAjax.push({
                url: columnChunkURL,
                method: "GET",
                promise: true
            });
        }

        for (var index = 0; index < lookupChunks.length; index++) {
            var element = lookupChunks[index];

            lookupChunks[index] = element.concat(required);
            var currentStruct = { columns: lookupChunks[index], filters: m.struct.filters, expand: m.struct.expand };
            eachQueryStruct.push(currentStruct);
            var getSelectParam = getSelect(currentStruct)
            // console.log(getSelectParam);

            var lookupChunkURL = "";
            if (typeof m.isDatatable == "boolean" && m.isDatatable) {
                lookupChunkURL = fullURL + "?" + useTop + "&" + getSelectParam + (hasOrder ? "&" + theOrder : "")
            }
            else {
                lookupChunkURL = fullURL + "?" + getSelectParam;
            }

            eachAjax.push({
                url: lookupChunkURL,
                method: "GET",
                promise: true,
                headers: { Accept: "application/json" }
            });
        }

        var ajaxes = [];
        eachAjax.forEach(element => {
            ajaxes.push(spAjax(element))
        });

        //@ts-ignore
        const returnedData = await Promise.all(ajaxes);
        var mergedRecs = [];
        //console.log(returnedData);
        //Each Array from Promise

        if (Array.isArray(returnedData)) {
            for (let index_2 = 0; index_2 < returnedData.length; index_2++) {
                var element_3: any;

                if (returnedData[index_2] && returnedData[index_2].d) {
                    if(Array.isArray(returnedData[index_2].d.results))
                    {
                        element_3 = returnedData[index_2].d.results;
                    }                    
                    else if(returnedData[index_2].d.ID != undefined)
                    {
                        element_3 = [returnedData[index_2].d];
                    }
                }
                else if (returnedData[index_2] && returnedData[index_2].value) {
                    element_3 = returnedData[index_2].value;
                }
                else
                {
                    element_3 = [returnedData[index_2]]
                }

                if (mergedRecs.length == 0) {
                    mergedRecs = mergedRecs.concat(element_3);
                }
                else {
                    //Rows of Current Results
                    for (let index_3 = 0; index_3 < element_3.length; index_3++) {
                        const currentRow = element_3[index_3];
                        var currentID = currentRow.ID;
                        var RowToBeMerged = _.find(mergedRecs, function (o) {
                            if (o.ID == currentID) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        });
                        if (RowToBeMerged != undefined) {
                            _.merge(RowToBeMerged, currentRow);
                        }
                    }
                }
                //var merged = _.merge(_.keyBy(mergedRecs, 'ID'), _.keyBy(mergedRecs, 'ID'));
                var merged = _.unionBy(mergedRecs, element_3, "ID");
                mergedRecs = _.values(merged);
            }
        }
        //console.log(mergedRecs);
        return mergedRecs;
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
        }

        data.columns = [];
        data.order = [];

        //console.log('Query by:'  + settings.sInstance);
    }

    function conformRestDataToDataTable(e: any, settings: any, json: any, xhr: any, xtra: any) {
        json = json ? json : {};
        json.value = json.value ? json.value : [];

        var struct = getSelectStruct(xtra);

        var returnedData = [];

        //Compare Previous request for change
        if (spEnv.tables[xtra.tableName].originalCaller.previousXHR) {
            const currentXHR = spEnv.tables[xtra.tableName].originalCaller.xhrReq;
            const previosXHR = spEnv.tables[xtra.tableName].originalCaller.previousXHR;
            if (!_.isEqual(currentXHR.order, previosXHR.order) || !_.isEqual(currentXHR.search, previosXHR.search)) {
                spEnv.tables[xtra.tableName].originalCaller.callThePromise = "Load";
            }
        }

        if (spEnv.tables[xtra.tableName].originalCaller.callThePromise == "Load") {
            var returnedData2 = promiseQuery({
                isDatatable: true,
                struct: struct,
                xtra: xtra
            }).then(function (thisPromiseData: any) {

                var ServerCall = Array.isArray(thisPromiseData);

                returnedData = thisPromiseData;
                var json2 = { value: [], recordsTotal: 0, recordsFiltered: 0, spData: [], fullData: [], data: {}, start: 0, length: 0 };
                if (returnedData.length > 0) {
                    json2.value = returnedData;

                    var ServerCall = Array.isArray(json2.value);

                    if (!$('table#' + xtra.tableName).is(':visible')) {
                        json2.data = [];
                        json2.start = 0;
                        json2.length = defaultPageSize;
                        json2.recordsTotal = 0;
                        json2.recordsFiltered = 0;

                        return json2;
                    }

                    if (ServerCall) {
                        json2.spData = JSON.parse(JSON.stringify(json2.value));

                        ParseSharePointDataToSpa(json2);

                        var thisTable = $('#' + settings.sInstance).data('table');
                        var thisTableMeta = spEnv.tables[thisTable].originalCaller;

                        json2.recordsTotal = json2.value.length; // ListCount.d.ItemCount;
                        json2.recordsFiltered = json2.value.length;

                        json2.fullData = json2.value;
                        var tempData = returnPagedData({
                            runSearch : false,
                            meta: spEnv.tables[thisTable].originalCaller.xhrReq,
                            data: json2.fullData,
                            start: 0,
                            length: spEnv.tables && spEnv.tables[xtra.tableName] && spEnv.tables[xtra.tableName].originalCaller && spEnv.tables[xtra.tableName].originalCaller.xhrReq ? spEnv.tables[xtra.tableName].originalCaller.xhrReq.length : defaultPageSize
                        });

                        json2.data = tempData.data;
                        json2.recordsTotal = tempData.recordsTotal;
                        json2.recordsFiltered = tempData.recordsFiltered;
                        json2.length = xtra.xhrReq && xtra.xhrReq.length ? xtra.xhrReq.length : defaultPageSize;;
                        delete json2.value;
                    }

                    if (spEnv.mGlobal.page[xtra.tableName] != undefined) {
                        spEnv.mGlobal.page[xtra.tableName].currentJsonData = json2;
                    }

                    //spEnv.tables[xtra.tableName].ajax.reload(null, false);
                }

                spEnv.tables[xtra.tableName].ajax.reload(null, false);
                spEnv.tables[xtra.tableName].originalCaller.callThePromise = "Loaded";
            });
        } else {
            json.fullData = spEnv.mGlobal.page[xtra.tableName].currentJsonData.fullData;
            var ogCaller = spEnv.tables[xtra.tableName];
            var ogMGlobal = spEnv.mGlobal.page[xtra.tableName];

            var tempData2 = returnPagedData({
                runSearch : true,
                meta: ogCaller.originalCaller.xhrReq ? { search : ogCaller.originalCaller.xhrReq.search, columns : ogCaller.originalCaller.xhrReq.columns } : {},
                data: ogMGlobal.currentJsonData.fullData,
                start: ogCaller.originalCaller.xhrReq.start,
                length: ogCaller.originalCaller.xhrReq.length
            });
            json.data = tempData2.data;
            json.recordsTotal = tempData2.recordsTotal;
            json.recordsFiltered = tempData2.recordsFiltered;
            json.spData = spEnv.mGlobal.page[xtra.tableName].currentJsonData.spData;
        }

        if (json.FormDigestValue) {
            $('#__REQUESTDIGEST').val(json.FormDigestValue);
            // json.data = [];
            // json.recordsTotal = 0;
            // json.recordsFiltered = 0;
        }

        var tempCurrentJson = spEnv.mGlobal.page[xtra.tableName];
        // if(tempCurrentJson.currentJsonData && tempCurrentJson.currentJsonData.data != undefined)
        if (spEnv.tables[xtra.tableName].originalCaller.callThePromise == "Load") {
            //     // var tempData = spEnv.mGlobal.page[xtra.tableName].currentJsonData;
            //     // json.data = tempData.spData;
            //     // json.recordsTotal = tempData.recordsTotal;
            //     // json.recordsFiltered = tempData.recordsFiltered;
            //     // json.start = tempData.start;
            //     // json.length = tempData.length; 
            //     // json.spData = tempData.spData;  
            // }
            // else
            // {
            json.data = [];
            json.recordsTotal = 0;
            json.recordsFiltered = 0;
            json.start = 0;
            json.length = xtra.xhrReq && xtra.xhrReq.length ? xtra.xhrReq.length : defaultPageSize;
        }

        spEnv.tables[xtra.tableName].originalCaller.previousXHR = spEnv.tables[xtra.tableName].originalCaller.xhrReq;

        return json;

        function ParseSharePointDataToSpa(json: any) {
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
                        }
                        else {
                            if (Object.keys(d2[o]).length == 1 && d2[o]["__deferred"] != undefined) {
                                d2[o] = "";
                            }
                            else {
                                var content2 = JSON.stringify(d2[o]);
                                d2[o] = '<span class="hide-json" data-type="JSON" data-size="' + content2.length + '" data-typeof="Object">' + content2 + '</span><span class="lync-presence"></span>';
                            }
                        }
                    }
                    else if (d2[o] == undefined) {
                        d2[o] = '';
                    }
                    else if (typeof d2[o] === "boolean") {
                        if (o.toLowerCase() == "attachments") {
                            if (d2[o]) {
                                d2[o] = spEnv.$pa.env.fileAttachment();
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
        }
    }

    function getDataDictionaryQuery(m: any) {

        var useTop = '';
        useTop = "$skiptoken=" + encodeURIComponent("Paged=TRUE&p_ID=0") + "&$top=" + spEnv.spSettings.maxQueryItems + '&';
        return m.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/items?" + useTop + '$Select=ID' + '&' + getOrderBy(m);
    }

    function getRestCount(m: spaLoadListStruct) {
        return m.path + "/_api/web/lists/getbytitle('" + m.tableName + "')/ItemCount";
    }

    function returnPagedData(m: any) {
        var pagedArray = [];
        var data = m.data == undefined ? [] : JSON.parse(JSON.stringify(m.data));
        var startRow = m.start > 0 ? m.start : 0;
        var endRow = startRow + m.length;

        endRow = endRow > data.length ? data.length : endRow;

        //pagedArray = data.splice(startRow, endRow);
        var recordsFiltered = data.length;
        if (m.meta && m.meta.search && m.meta.search.value) {
            var searchStageData = data;

            var conditionSyntax = spEnv.$pa.env.spSearchCondition({
                objectName: "o",
                columns: m.meta.columns,
                search: m.meta.search
            });

            var searchData = m.runSearch ? _.filter(searchStageData, function (o) {
                    return eval(conditionSyntax);                
            }) : searchStageData;

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

        // var rootObject = spCRUD.spCRUD.data();
        // if (rootObject.lastSave && (rootObject.lastSave.action && rootObject.lastSave.action.action != undefined && rootObject.lastSave.action.action == "save") && rootObject.lastSave.action.loaded == false) {
        //     rootObject.lastSave.action.loaded = true;
        //     spCRUD.spCRUD.reloadEditForm();
        // }
    }

    function refreshServerData(m: any) {
        var owner = $(this).data('owner');

        if (spEnv.tables[owner]) {
            spEnv.tables[owner].originalCaller.callThePromise = "Load";
            spEnv.tables[owner].ajax.reload();
        }
    }

    function genTable(m: spaLoadListStruct) {
        var mo : any = m;
        if (m.tableName && m.tableSelector) {

            spEnv.mGlobal.page[m.tableName] = {
                currentJsonData: {}
            };

            var ColumnsModel = buildtableColumns(m);

            var selectStruct = getSelectStruct(m);
            m.ColumnsSelect = getSelect(selectStruct);        

            var DataTableInMemory = {
                "processing": true,
                "serverSide": true,
                "ajax": {
                    type: "POST",
                    url: triggerFetch(m)
                },
                "dom": mo.dom != undefined ? mo.dom : "<'row'<'col-md-6'l><'col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-5'i><'col-sm-7'p>>",
                "oLanguage": mo.oLanguage != undefined ? mo.oLanguage : {
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
                "pageLength": mo.pageLength != undefined && mo.pageLength != "" ? mo.pageLength : defaultPageSize,
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
                        }, 1000)
                    );

                    $('#' + m.tableName + ' input[type="search"]').addClass("iris-pager-nav");
                    var thisParent = $('#' + m.tableName + '_filter').parent();
                    $(thisParent).addClass('iris-text-align-right');
                    $('#' + m.tableName + '_filter').addClass("iris-inline-block");
                    $('#' + m.tableName + '_filter').parent("div").append('<div id="' + m.tableName + '_right_actions" class="iris-right-actions"></div>');

                    $('#' + m.tableName + '_right_actions').append(spEnv.$pa.env.datatable_refresh_html({
                        owner: m.tableName
                    }));

                    $(".actionRefresh").unbind("click", refreshServerData);
                    $(".actionRefresh").bind("click", refreshServerData);
                },
                "fnDrawCallback": function (oSettings, json) {

                    $("#" + m.tableName + "_wrapper .dataTables_scrollHead th").each(function (th, thElement) {
                        var thisElementData = $(thElement).data();
                        $(thElement).html(_.startCase($(thElement).html()));

                        $("#" + m.tableName + " tbody tr").each(function (tr, trElement) {
                            var columnName = thisElementData.name.replace(new RegExp(" ", "g"), "_");

                            $(trElement).find("td:eq(" + th + ")").addClass("css_dt_" + m.tableName + " css_" + columnName);
                            for (var prop in thisElementData) {
                                $(trElement).find("td:eq(" + th + ")").attr("data-" + prop, thisElementData[prop]);
                            }
                        });
                    });

                    if (m && m.table && m.table.css) {
                        $(".css_dt_" + m.tableName).css(m.table.css);
                    }

                    if (m && m.table && m.table.columns && Array.isArray(m.table.columns)) {
                        var thisTCArray = m.table.columns;
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

                        $('#' + m.tableName + '_wrapper .dataTables_scrollHeadInner .table:hidden, #' + m.tableName + '_wrapper .dataTables_scrollHeadInner:hidden').css('width', '100%');
                        spData.iGlobal.pager.init({
                            tableId: m.tableName,
                            divID: '#' + m.tableName,
                            currentJsonData: spEnv.mGlobal.page[m.tableName].currentJsonData,
                            params: spEnv.tables[m.tableName].ajax.params(),
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
            spEnv.tables[m.tableName].originalCaller.callThePromise = "Load";
        }
    }

    var FilterMethods = (function(){

        function getFiltersNames (f : any)
        {
            return [];
        }

        return {
            getFiltersNames : function(f : any)
            {
                return [];
            }
        }
    })();

    return {
        genTable: function (m: spaLoadListStruct) {
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
            var restApiQuery = getSelect(struct);
            return {
                struct: struct,
                restApiQuery: restApiQuery,
                path: ""
            };
        },
        promiseQuery: function (m: any) {
            return promiseQuery(m);
        }
    };
})();