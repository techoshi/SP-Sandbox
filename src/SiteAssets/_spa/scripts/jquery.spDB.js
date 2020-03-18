//requires jquery.spCommon.js
//requires jquery.spAsyncQueue.js

$.fn.spDB = (function () {

    function getListTypeID(m) {
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

    function deleteList(m) {
        for (var index = 0; index < m.length; index++) {
            var element = m[index];

            if (!m.url) {
                element.url = _spPageContextInfo.webAbsoluteUrl;
            }

            goDelete(element);
        }
    }

    function goDelete(m) {
        $.fn.spCommon.ajax({
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
            done: function (a) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'List ' + m.Title + ' deleted! ',
                    type: 'success'
                }));
                toastr.success('List ' + m.Title + ' deleted! ');
            },
            fail: function (response, errorCode, errorMessage) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'List ' + m.Title + ' not deleted! ' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });

    }

    function AddViewColumn(m)
    {
        $.fn.spAsyncQueue.call({
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
            done: function (a, status, xhr) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'View Field ' + m.Title + ' added to View' + m.ViewTitle + '.',
                    type: 'success'
                }));
            },
            fail: function (response, errorCode, errorMessage) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'View Field ' + m.Title + ' not added to View' + m.ViewTitle + '.' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });
    }

    function CreateListView(m) {
        //<Where><Eq><FieldRef Name=\"Location\" /><Value Type=\"Text\">India</Value></Eq></Where>
        var viewQuery = "<OrderBy><FieldRef Name=\"Created\" /></OrderBy>";
        
        $.fn.spAsyncQueue.call({
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
            done: function (a, status, xhr) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'View ' + m.ViewTitle + ' created for List ' + m.Title + '.',
                    type: 'success'
                }));

                for (var c = 0; c < m.Columns.length; c++) {
                    if (m.availableLists) {
                        m.Columns[c].availableLists = m.availableLists
                    }

                    var thisAddModel = {
                        url : m.url,
                        Title : m.Title,
                        ViewTitle : m.ViewTitle,
                        columnName : m.Columns[c].Title
                    }

                    var thisField = AddViewColumn(thisAddModel);
                }
            },
            fail: function (response, errorCode, errorMessage) {
                $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                    content: 'View ' + m.ViewTitle + ' created for List ' + m.Title + '.' + response.responseJSON.error.message.value,
                    type: 'danger'
                }));
            }
        });
    }

    function getFieldStruct(m) {
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
                            'MaxLength': isNaN(m.MaxLength) || (!isNaN(m.MaxLength) & m.MaxLength > 255) ? 255 : m.MaxLength
                        }
                }
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
                    }
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
                        }
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
                            }
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
                                }
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

    function createListField(m) {
        var thisData = m.data;
        var thisFieldTitle = thisData.parameters && thisData.parameters.Title ? thisData.parameters.Title : thisData.Title;
        m.method = 'POST';
        m.data = JSON.stringify(m.data);
        m.done = function (a) {
            $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                content: 'Field ' + thisFieldTitle + ' added to List ' + m.originalRequest.Title + '!',
                type: 'success'
            }));
            toastr.success('Field ' + thisFieldTitle + ' added to List ' + m.originalRequest.Title + '!', 'Field Created!');
        };
        m.fail = function (response, errorCode, errotMessage) {
            toastr.error('Field ' + thisFieldTitle + ' not added to List ' + m.originalRequest.Title + '!', 'Field Create Failed!');
            $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                content: 'Field ' + thisFieldTitle + ' not added to List ' + m.originalRequest.Title + '!',
                type: 'danger'
            }));
        }
        $.fn.spAsyncQueue.call(m);
    }

    function createList(m) {
        var list = {};

        if (typeof m === 'object') {
            if (m.url && m.Title && m.Description) {
                list[m.Title] = {};

                $.fn.spCommon.ajax({
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
                    done: function (a) {

                        var originalRequest = m;
                        var listData = a;

                        var ListType = m.type;
                        var listURL = m.url + "/_api/web/lists" +"(guid'" + a.d.Id + "')"
                        list[m.Title].Id = a.d.Id;
                        toastr.success(m.type + ' ' + m.Title + ' created!', 'List Created!');

                        $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                            content: m.type + ' ' + m.Title + ' created!',
                            type: 'primary'
                        }));
                        for (var c = 0; c < m.Columns.length; c++) {
                            if (m.availableLists) {
                                m.Columns[c].availableLists = m.availableLists
                            }

                            var thisField = getFieldStruct(m.Columns[c]);

                            thisField.url =  listURL + thisField.url
                            thisField.originalRequest = originalRequest;
                            createListField(thisField);
                        }
                        
                        m.ViewTitle = m.Title + "PrimaryView";
                        m.ViewType = "GRID";
                        CreateListView(m)
                    },
                    fail: function (response, errorCode, errorMessage) {
                        $('#DeltaPageInstrumentation').prepend($.fn.spEnvironment.bootstrapAlert({
                            content: 'List ' + m.Title + ' not created! ' + response.responseJSON.error.message.value,
                            type: 'danger'
                        }));
                    }
                });

                if (m.async == false) {
                    return list;
                }
            } else {
                $('#DeltaPageInstrumentation').append($.fn.spEnvironment.bootstrapAlert({
                    content: 'List not created the necessary criteria not provided!',
                    type: 'danger'
                }));
                toastr.info('List not created the necessary criteria not provided!');
            }
        }
    }
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    function waitForQueue() {
        var loop = 0;

        while ($.fn.spAsyncQueue.queue().length > 0) {
            sleep(1000).then(() => {
                console.log('Waiting for Queue');
            })
        }
    }

    function ProcessRequest(m) {
        if (m) {
            var listObject = m;
            listObject.async = false;
            listObject.availableLists = lists;

            var listReturn = createList(listObject);

            for (list in listReturn) {
                lists[list] = listReturn[list];
            }

            waitingForRequest = true;
        }
    }

    function createLists() {

        m = loadObjects;
        waitingForRequest = false;

        PendingRequests = _.filter(loadObjects, function (o) {
            return o.loaded == undefined || o.loaded == false;
        });

        if (PendingRequests.length == 0) {
            for (var ins = 0; ins < intervalNumbs.length; ins++) {
                clearInterval(intervalNumbs[ins]);
            }
        }

        if (PendingRequests.length > 0 && $.fn.spAsyncQueue.queue().length == 0) {
            theLoader.show({
                id: 'async-loader'
            });
            ProcessRequest(PendingRequests[0]);
            PendingRequests[0].loaded = true;
        } else {
            theLoader.hide({
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

    function loadCreateObjects(m) {
        if (typeof m === 'object' && Array.isArray(m)) {
            lists = {};
            loadObjects = m;

            for (var index = 0; index < loadObjects.length; index++) {
                var element = loadObjects[index];

                if (!element.url) {
                    element.url = _spPageContextInfo.webAbsoluteUrl
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
            intervalNumbs.push(thisNumb)
        }
    }

    return {
        createApp: function (m) {

            if (typeof m == "object") {
                if (Array.isArray(m)) {
                    //createList(m);


                    loadCreateObjects(m);
                } else {
                    createList(m);
                }
            }
        },
        deleteList: function (m) {
            deleteList(m);
        },
        demoApp: function (m) {
            $.fn.spDB.createApp({
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
        }
    }
})();