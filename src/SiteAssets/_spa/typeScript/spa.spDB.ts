//requires jquery.spCommon.js
//requires jquery.spAsyncQueue.js
/*jshint scripturl:true*/
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Handlebars from 'handlebars';
import * as moment from 'moment';
import * as toastr from "toastr";
import 'bootstrap';
import * as spEnv from "./spa.spEnv";
import * as spLoader from "./theLoader";
import * as spPrompt from "./spa.spPrompt";
// import * as spExtensions from "./handlebars-helper";

export var thisLists: SharePointListStruct[] = [];
export var thisDataLists: any[] = [];

// thisLists.push({ url : "ok", Title : "ok", type : "ok", Description : "pok", Columns : [] })

export var spDB = (function () {

    function getListTypeID(m: any) {
        switch (m.type) {
            default:
            case 'Generic List':
            case 'GenericList':
                return 100;
            case 'Document Library':
            case 'DocumentLibrary':
                return 101;
        }
    }

    function getFieldStruct(m: any) {
        switch (m.type) {
            default:
            case 'FieldText':
            case 'Text':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldText'
                        },
                        'FieldTypeKind': 2,
                        'Title': m.Title,
                        'MaxLength': isNaN(m.MaxLength) || (!isNaN(m.MaxLength) && m.MaxLength > 255) ? 255 : m.MaxLength,
                        'DefaultValue': m.DefaultValue
                    }
                };
            case 'MultiLineText':
            case 'FieldMultiLineText':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldMultiLineText'
                        },
                        'FieldTypeKind': 3,
                        'Title': m.Title,
                        'NumberOfLines': !isNaN(m.NumberOfLines) ? m.NumberOfLines : undefined,
                        'RichText': typeof m.RichText == 'boolean' ? m.RichText : false,
                    }
                };
            case 'DateTime':
            case 'FieldDateTime':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldDateTime'
                        },
                        'FieldTypeKind': 4,
                        'Title': m.Title,
                        'DisplayFormat': !isNaN(m.DisplayFormat) ? m.DisplayFormat : 1, //DateOnly = 0, DateTime = 1.
                        'FriendlyDisplayFormat': !isNaN(m.FriendlyDisplayFormat2) ? m.FriendlyDisplayFormat : 2 // Unspecified = 0, Disabled (standard absolute) = 1, Relative (standard friendly relative) = 2
                    }
                };
            case 'Choice':
            case 'FieldChoice':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldChoice'
                        },
                        'FieldTypeKind': 6,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': {
                                'type': 'Collection(Edm.String)'
                            },
                            'results': m.Choices //[ 'Internal', 'External' ] 
                        },
                        'EditFormat': 1
                    }
                };
            case 'FieldLookup':
            case 'Lookup':
                if (m.availableLists && typeof m.LookupListId == "object") {
                    if (m.LookupListId.listName) {
                        m.LookupListId = m.availableLists[m.LookupListId.listName].Id;
                    }
                }

                return {
                    url: '/fields/addfield',
                    data: {
                        'parameters': {
                            '__metadata': {
                                'type': 'SP.FieldCreationInformation'
                            },
                            'FieldTypeKind': 7,
                            'Title': m.Title,
                            'LookupListId': m.LookupListId, //'4635daeb-7206-4513-ad17-ea06e09187ad',
                            'LookupFieldName': m.LookupFieldName
                        }
                    }
                };
            case 'FieldNumber':
            case 'Number':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldNumber'
                        },
                        'FieldTypeKind': 9,
                        'Title': m.Title,
                        'Minimum Value': !isNaN(m.MinValue) ? m.MinValue : undefined,
                        'Maximum Value': !isNaN(m.MaxValue) ? m.MaxValue : undefined,
                    }
                };
            case 'FieldCurrency':
            case 'Currency':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldCurrency'
                        },
                        'FieldTypeKind': 10,
                        'Title': m.Title,
                        'CurrencyLocaleId': 1033,
                        'Minimum Value': !isNaN(m.MinValue) ? m.MinValue : undefined,
                        'Maximum Value': !isNaN(m.MaxValue) ? m.MaxValue : undefined,
                    }
                };
            case 'Url':
            case 'FieldUrl':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldUrl'
                        },
                        'FieldTypeKind': 11,
                        'Title': m.Title,
                        'DisplayFormat': !isNaN(m.DisplayFormat) ? m.DisplayFormat : 1 //0 Link, 1 Image 
                    }
                };
            case 'Guid':
            case 'FieldGuid':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldGuid'
                        },
                        'FieldTypeKind': 14,
                        'Title': m.Title,
                        'EnforceUniqueValues': m.EnforceUniqueValues
                    }
                };
            case 'MultiChoice':
            case 'FieldMultiChoice':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldMultiChoice'
                        },
                        'FieldTypeKind': 15,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': {
                                'type': 'Collection(Edm.String)'
                            },
                            'results': m.Choices //[ 'ECM', 'Workflow', 'Collaboration' ] 
                        },
                        'FillInChoice': m.FillInChoice,
                        'DefaultValue': m.DefaultValue
                    }
                };
            case 'FieldRatingScale':
            case 'RatingScale':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldRatingScale'
                        },
                        'FieldTypeKind': 16,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': {
                                'type': 'Collection(Edm.String)'
                            },
                            'results': m.Choices //[ 'ECM', 'Workflow', 'Collaboration' ] 
                        },
                        'GridTextRangeLow': m.GridTextRangeLow, //'Rarely', 
                        'GridTextRangeAverage': m.GridTextRangeAverage, //'Sometimes', 
                        'GridTextRangeHigh': m.GridTextRangeHigh, //'Often',
                        'GridStartNumber': m.GridStartNumber, // 1, 
                        'GridEndNumber': m.GridEndNumber, //3, 
                        'RangeCount': m.RangeCount // 3 
                    }
                };
            case 'FieldCalculated':
            case 'Calculated':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldCalculated'
                        },
                        'FieldTypeKind': 17,
                        'Title': m.Title,
                        'Formula': m.Formula, //'=DATEDIF([Start Date],[End Date],"d")', 
                        'OutputType': m.OutputType // 2 
                    }
                };
            case 'FieldUser':
            case 'User':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.FieldUser'
                        },
                        'FieldTypeKind': 20,
                        'Title': m.Title,
                        'SelectionGroup': m.SelectionGroup, // 7, 
                        'SelectionMode': m.SelectionMode == undefined ? 0 : m.SelectionMode, //PeopleOnly = 0, PeopleAndGroups = 1
                        'AllowMultipleValues': m.AllowMultipleValues
                    }
                };
            case 'Location':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': {
                            'type': 'SP.Field'
                        },
                        'FieldTypeKind': 31,
                        'Title': m.Title
                    }
                };
        }
    }

    function deleteList(m: any) {
        for (var index = 0; index < m.length; index++) {
            var element = m[index];

            if (!m.url) {
                element.url = _spPageContextInfo.webAbsoluteUrl;
            }

            goDelete(element);
        }
    }

    function goDelete(m: any) {
        spEnv.$pa.spCommon.ajax({
            url: m.url + "/_api/web/lists/GetByTitle('" + m.Title + "')",
            method: 'POST',
            original: m,
            async: typeof m.async == "boolean" ? m.async : false,
            headers: {
                "accept": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose",
                "X-HTTP-Method": "DELETE",
                "IF-MATCH": "*"
            },
            done: function (a: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'List ' + m.Title + ' deleted! ',
                    type: 'success'
                }));
                toastr.success('List ' + m.Title + ' deleted! ');
            },
            fail: function (response: any, errorCode: any, errorMessage: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'List ' + m.Title + ' not deleted! ' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });

    }

    function AddViewColumn(m: any) {
        spEnv.$pa.spAsyncQueue.call({
            // _spPageContextInfo.webAbsoluteUrl - will give absolute URL of the site where you are running the code.
            // You can replace this with other site URL where you want to apply the function

            url: m.url + "/_api/web/Lists/getByTitle('" + m.Title + "')/Views/getByTitle('" + m.ViewTitle + "')/ViewFields/addViewField('" + m.columnName + "')",
            method: "POST",
            // data: "{'__metadata':{'type': 'SP.View'},'ViewType': '" + m.ViewType + "','Title':'" + m.ViewTitle + "','PersonalView':false,'ViewQuery':'" + viewQuery + "'}",
            headers: {
                //    // Accept header: Specifies the format for response data from the server.
                //    "Accept": "application/json;odata=verbose",
                //    //Content-Type header: Specifies the format of the data that the client is sending to the server
                //    "Content-Type": "application/json;odata=verbose",
                //    // X-RequestDigest header: When you send a POST request, it must include the form digest value in X-RequestDigest header
                //    "X-RequestDigest": $("#__REQUESTDIGEST").val()

            },
            done: function (a: any, status: any, xhr: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'View Field ' + m.Title + ' added to View' + m.ViewTitle + '.',
                    type: 'success'
                }));
            },
            fail: function (response: any, errorCode: any, errorMessage: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'View Field ' + m.Title + ' not added to View' + m.ViewTitle + '.' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });
    }

    function CreateListView(m: any) {
        //<Where><Eq><FieldRef Name=\"Location\" /><Value Type=\"Text\">India</Value></Eq></Where>
        var viewQuery = "<OrderBy><FieldRef Name=\"Created\" /></OrderBy>";

        spEnv.$pa.spAsyncQueue.call({
            // _spPageContextInfo.webAbsoluteUrl - will give absolute URL of the site where you are running the code.
            // You can replace this with other site URL where you want to apply the function

            url: m.url + "/_api/web/lists/getByTitle('" + m.Title + "')/views",
            method: "POST",
            data: "{'__metadata':{'type': 'SP.View'},'ViewType': '" + m.ViewType + "','Title':'" + m.ViewTitle + "','PersonalView':false,'ViewQuery':'" + viewQuery + "'}",
            headers: {
                //    // Accept header: Specifies the format for response data from the server.
                //    "Accept": "application/json;odata=verbose",
                //    //Content-Type header: Specifies the format of the data that the client is sending to the server
                //    "Content-Type": "application/json;odata=verbose",
                //    // X-RequestDigest header: When you send a POST request, it must include the form digest value in X-RequestDigest header
                //    "X-RequestDigest": $("#__REQUESTDIGEST").val()

            },
            done: function (a: any, status: any, xhr: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'View ' + m.ViewTitle + ' created for List ' + m.Title + '.',
                    type: 'success'
                }));

                for (var c = 0; c < m.Columns.length; c++) {
                    if (m.availableLists) {
                        m.Columns[c].availableLists = m.availableLists;
                    }

                    var thisAddModel = {
                        url: m.url,
                        Title: m.Title,
                        ViewTitle: m.ViewTitle,
                        columnName: m.Columns[c].Title
                    };

                    var thisField = AddViewColumn(thisAddModel);
                }
            },
            fail: function (response: any, errorCode: any, errorMessage: any) {
                $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                    content: 'View ' + m.ViewTitle + ' created for List ' + m.Title + '.' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });
    }

    function createListField(m: any) {
        var thisData = m.data;
        var thisFieldTitle = thisData.parameters && thisData.parameters.Title ? thisData.parameters.Title : thisData.Title;
        m.method = 'POST';
        m.data = JSON.stringify(m.data);
        m.done = function (a: any) {
            $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                content: 'Field ' + thisFieldTitle + ' added to List ' + m.originalRequest.Title + '!',
                type: 'success'
            }));
            toastr.success('Field ' + thisFieldTitle + ' added to List ' + m.originalRequest.Title + '!', 'Field Created!');
        };
        m.fail = function (response: any, errorCode: any, errotMessage: any) {
            toastr.error('Field ' + thisFieldTitle + ' not added to List ' + m.originalRequest.Title + '!', 'Field Create Failed!');
            $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                content: 'Field ' + thisFieldTitle + ' not added to List ' + m.originalRequest.Title + '!',
                type: 'danger'
            }));
        };
        spEnv.$pa.spAsyncQueue.call(m);
    }

    function createList(m: any) {
        var list = {};

        if (typeof m === 'object') {

            if (Array.isArray(m.Columns)) {
                if (m.hasActive) {
                    m.Columns.push({
                        type: 'FieldText',
                        Title: 'zSequence'
                    });
                }

                if (m.hasSequence) {
                    m.Columns.push({
                        type: 'FieldText',
                        Title: 'zActive'
                    });
                }
            }

            if (m.url && m.Title && m.Description) {
                list[m.Title] = {};

                spEnv.$pa.spCommon.ajax({
                    url: m.url + "/_api/web/lists",
                    method: 'POST',
                    original: m,
                    async: typeof m.async == "boolean" ? m.async : true,
                    data: JSON.stringify({
                        '__metadata': {
                            'type': 'SP.List'
                        },
                        'AllowContentTypes': true,
                        'BaseTemplate': getListTypeID({
                            type: m.type
                        }),
                        'ContentTypesEnabled': true,
                        'Description': m.Description,
                        'Title': m.Title
                    }),
                    done: function (a: any) {

                        var originalRequest = m;
                        var listData = a;

                        var ListType = m.type;
                        var listURL = m.url + "/_api/web/lists" + "(guid'" + a.d.Id + "')";
                        list[m.Title].Id = a.d.Id;
                        toastr.success(m.type + ' ' + m.Title + ' created!', 'List Created!');

                        $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                            content: m.type + ' ' + m.Title + ' created!',
                            type: 'primary'
                        }));
                        for (var c = 0; c < m.Columns.length; c++) {
                            if (m.availableLists) {
                                m.Columns[c].availableLists = m.availableLists;
                            }

                            var thisField = getFieldStruct(m.Columns[c]);

                            thisField.url = listURL + thisField.url;
                            //@ts-ignore
                            thisField.originalRequest = originalRequest;
                            createListField(thisField);
                        }

                        m.ViewTitle = m.Title + "PrimaryView";
                        m.ViewType = "GRID";
                        CreateListView(m);
                    },
                    fail: function (response: any, errorCode: any, errorMessage: any) {
                        $('#DeltaPlaceHolderMain').prepend(spEnv.$pa.env.bootstrapAlert({
                            content: 'List ' + m.Title + ' not created! ' + response.responseJSON.error.message.value,
                            type: 'danger'
                        }));
                    }
                });

                if (m.async == false) {
                    return list;
                }
            } else {
                $('#DeltaPlaceHolderMain').append(spEnv.$pa.env.bootstrapAlert({
                    content: 'List not created the necessary criteria not provided!',
                    type: 'danger'
                }));
                toastr.info('List not created the necessary criteria not provided!');
            }
        }
    }

    function ProcessRequest(m: any) {
        if (m) {
            var listObject = m;
            listObject.async = false;
            listObject.availableLists = lists;

            var listReturn = createList(listObject);

            for (var list in listReturn) {
                lists[list] = listReturn[list];
            }

            waitingForRequest = true;
        }
    }

    function createLists() {

        var m = loadObjects;
        waitingForRequest = false;

        PendingRequests = _.filter(loadObjects, function (o) {
            return o.loaded == undefined || o.loaded == false;
        });

        if (PendingRequests.length == 0) {
            for (var ins = 0; ins < intervalNumbs.length; ins++) {
                clearInterval(intervalNumbs[ins]);
            }
        }

        if (PendingRequests.length > 0 && spEnv.$pa.spAsyncQueue.queue().length == 0) {
            spLoader.theLoader.show({
                id: 'async-loader'
            });
            ProcessRequest(PendingRequests[0]);
            PendingRequests[0].loaded = true;
        } else {
            spLoader.theLoader.hide({
                id: 'async-loader'
            });
            waitingForRequest = true;
        }
    }

    var lists = {};
    var loadObjects = [];
    var intervalCheck = [];
    var PendingRequests = [];
    var waitingForRequest = true;
    var intervalNumbs = [];

    function loadCreateObjects(m: any) {
        if (typeof m === 'object' && Array.isArray(m)) {
            lists = {};
            loadObjects = m;

            for (var index = 0; index < loadObjects.length; index++) {
                var element = loadObjects[index];

                if (!element.url) {
                    element.url = _spPageContextInfo.webAbsoluteUrl;
                }
            }

            loadObjects = _.map(loadObjects, function (element) {
                return _.extend({}, element, {
                    loaded: false
                });
            });
            var thisNumb = setInterval(
                function () {
                    createLists();
                }, 50);
            intervalNumbs.push(thisNumb);
        }
    }

    function loadData(m: any) {

        if (typeof m == "object") {
            var headers = {};
            var formObjects = {
                __metadata: {
                    'type': 'SP.Data.' + m.name.replace(/-/g, '') + 'ListItem' // it defines the ListEnitityTypeName  
                }
            }

            var crudRequestDone = function (a: any) {
                toastr.success('Data saved');
            };

            var crudRequestFail = function (a: any) {
                toastr.error('There was an issue saving the data, please refresh the page and try again.');
            };

            if (m.data) {
                for (var index = 0; index < m.data.length; index++) {
                    var element = m.data[index];
                    element.__metadata = formObjects.__metadata;

                    var crudRequest = {
                        headers: headers,
                        method: 'POST',
                        url: m.path + "/_api/web/lists/GetByTitle('" + m.name + "')/items",
                        data: JSON.stringify(element),
                        fail: crudRequestFail,
                        done: crudRequestDone
                    };

                    spEnv.$pa.spCommon.ajax(crudRequest);
                }
            }
        }
    }

    return {
        loadData: function (m: any[]) {

            if (Array.isArray(m)) {
                for (let index = 0; index < m.length; index++) {
                    const element = m[index];
                    loadData(element)
                }
            }
        },
        createApp: function (m: any) {

            if (typeof m == "object") {
                if (Array.isArray(m)) {
                    //createList(m);


                    loadCreateObjects(m);
                } else {
                    createList(m);
                }
            }
        },
        deleteList: function (m: any) {
            deleteList(m);
        },
        demoApp: function (m: any) {
            spEnv.$pa.spDB.createApp({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
                Title: 'Test_List123',
                Description: 'Test Description',
                Columns: [{
                    type: 'Text',
                    Title: 'MainColumn',
                    MaxLength: 100
                },
                {
                    type: 'Text',
                    Title: 'MainColumn2',
                    MaxLength: 400
                }
                ]
            });
        },
        initUI: function () {

            var uiActions = [];

            uiActions.push({
                text: "Install",
                active: true,
                close: true,
                click: function () {
                    spDB.createApp(thisLists);
                }
            });

            if (thisDataLists.length > 0) {
                uiActions.push({
                    text: "Install Data",
                    active: false,
                    close: true,
                    click: function () {
                        spDB.loadData(thisDataLists);
                    }
                });
            }

            uiActions.push({
                text: "Delete",
                active: false,
                close: true,
                click: function () {
                    spDB.deleteList(thisLists);
                }
            });

            spPrompt.promptDialog.prompt({
                promptID: 'DB-Installer',
                body: 'Which DB Installer Action do you wish to perform?',
                header: 'SharePoint Single Page Application Installer',
                closeOnEscape: false,
                removeClose: true,
                buttons: uiActions
            });
        }
    };
})();