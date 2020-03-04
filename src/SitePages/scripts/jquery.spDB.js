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

    function getFieldStruct(m) {
        switch (m.type) {
            default:
            case 'FieldText':
            case 'Text':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': { 'type': 'SP.FieldText' },
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
                        '__metadata': { 'type': 'SP.FieldMultiLineText' },
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
                        '__metadata': { 'type': 'SP.FieldDateTime' },
                        'FieldTypeKind': 4,
                        'Title': m.Title,
                        'DisplayFormat': !isNaN(m.DisplayFormat) ? m.DisplayFormat : 1, //DateOnly = 0, DateTime = 1.
                        'FriendlyDisplayFormat': !isNaN(m.FriendlyDisplayFormat2) ? m.FriendlyDisplayFormat : 2  // Unspecified = 0, Disabled (standard absolute) = 1, Relative (standard friendly relative) = 2
                    }
                };
            case 'Choice':
            case 'FieldChoice':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': { 'type': 'SP.FieldChoice' },
                        'FieldTypeKind': 6,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': { 'type': 'Collection(Edm.String)' },
                            'results': m.Choices //[ 'Internal', 'External' ] 
                        },
                        'EditFormat': 1
                    }
                }
            case 'FieldLookup':
            case 'Lookup':
                return {
                    url: '/fields/addfield',
                    data: {
                        '__metadata': { 'type': 'SP.FieldCreationInformation' },
                        'FieldTypeKind': 7,
                        'Title': m.Title,
                        'LookupListId': m.LookupListId, //'4635daeb-7206-4513-ad17-ea06e09187ad',
                        'LookupFieldName': m.LookupFieldName,
                        'AllowMultipleValues': m.AllowMultipleValues,

                    }
                };
            case 'FieldNumber':
            case 'Number':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': { 'type': 'SP.FieldNumber' },
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
                        '__metadata': { 'type': 'SP.FieldCurrency' },
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
                        '__metadata': { 'type': 'SP.FieldUrl' },
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
                        '__metadata': { 'type': 'SP.FieldGuid' },
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
                        '__metadata': { 'type': 'SP.FieldMultiChoice' },
                        'FieldTypeKind': 15,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': { 'type': 'Collection(Edm.String)' },
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
                        '__metadata': { 'type': 'SP.FieldRatingScale' },
                        'FieldTypeKind': 16,
                        'Title': m.Title,
                        'Choices': {
                            '__metadata': { 'type': 'Collection(Edm.String)' },
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
                        '__metadata': { 'type': 'SP.FieldCalculated' },
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
                        '__metadata': { 'type': 'SP.FieldUser' },
                        'FieldTypeKind': 20,
                        'Title': m.Title,
                        'SelectionGroup': m.SelectionGroup,// 7, 
                        'SelectionMode': m.SelectionMode == undefined ? 0 : m.SelectionMode, //PeopleOnly = 0, PeopleAndGroups = 1
                        'AllowMultipleValues': m.AllowMultipleValues
                    }
                };
            case 'Location':
                return {
                    url: '/fields',
                    data: {
                        '__metadata': { 'type': 'SP.Field' },
                        'FieldTypeKind': 31,
                        'Title': m.Title
                    }
                };
        }
    }

    function creatListField(m) {
        var thisData = m.data;
        m.method = 'POST'
        m.data = JSON.stringify(m.data);
        m.done = function (a) {
            toastr.success('Field ' + thisData.Title + ' added to List ' + m.originalRequest.Title + '!', 'Field Created!');
        };
        m.fail = function (response, errorCode, errotMessage) {
            toastr.error('Field ' + thisData.Title + ' not added to List ' + m.originalRequest.Title + '!', 'Field Create Failed!');
        }
        $.fn.spAsyncQueue.call(m);
    }

    function createList(m) {
        if (typeof m === 'object') {
            if (m.url && m.Title && m.Description) {
                $.fn.spCommon.ajax({
                    url: m.url,
                    method: 'POST',
                    original: m,
                    data: JSON.stringify(
                        {
                            '__metadata': { 'type': 'SP.List' },
                            'AllowContentTypes': true,
                            'BaseTemplate': getListTypeID({ type: m.type }),
                            'ContentTypesEnabled': true,
                            'Description': m.Description,
                            'Title': m.Title
                        }
                    ),
                    done: function (a) {

                        var originalRequest = m;
                        var listData = a;

                        var ListType = m.type;
                        var listURL = m.url + "(guid'" + a.d.Id + "')"

                        toastr.success(ListType + ' List ' + m.Title + ' created!', 'List Created!');

                        for (var c = 0; c < m.Columns.length; c++) {
                            var thisField = getFieldStruct(m.Columns[c]);

                            thisField.url = listURL + thisField.url
                            thisField.originalRequest = originalRequest;
                            creatListField(thisField);
                        }
                    }
                });
            }
            else {
                toastr.info('List not created the necessary criteria not provided!');
            }
        }
    }

    return {
        createApp: function (m) {

            createList(m);

        },
        demoApp: function (m) {
            $.fn.spDB.createApp({
                url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
                Title: 'Test_List123',
                Description: 'Test Description',
                Columns: [
                    { type: 'Text', Title: 'MainColumn', MaxLength: 100 },
                    { type: 'Text', Title: 'MainColumn2', MaxLength: 400 }
                ]
            });
        }
    }
})();
