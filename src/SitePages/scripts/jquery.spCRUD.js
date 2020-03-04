$.fn.spCRUD = (function () {
    var modalTypes = ['create', 'view', 'edit', 'delete'];

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    var thisApp = { objects : {}};    

    var theseLists = [];

    var lookupDataPoints = {};

    function removeFile(e) {
        var thisRowIndex = $(this).parents('tr').index();
        var parent = $(this).parents('.file_inventory');
        var thisOwner = $(parent).data('filecontainer');

        var thisFileInput = $(parent).siblings('.box.has-advanced-upload').find('input.box__file');

        var FileArray = $(thisFileInput).data().files;

        var index;

        FileArray.splice(thisRowIndex, 1);

        showFiles({ box: thisOwner, files: FileArray });
    }

    function loadLists() {
        //var tempList = _.filter(theseLists, function (o) { return o.loaded == undefined || o.loaded == false; });
        if (theseLists) {
            for (var i = 0; i < theseLists.length; i++) {
                theseLists[i].loaded = false;

                var expectedObject = theseLists[i];
                expectedObject.thisVar = theseLists[i].name;
                expectedObject.thisObjectLower = theseLists[i].name.toLowerCase();
                expectedObject.owner = theseLists[i].name.toLowerCase();
                expectedObject.source = theseLists[i].name.toLowerCase();
                expectedObject.path = expectedObject.path ? expectedObject.path : _spPageContextInfo.webAbsoluteUrl;

                thisApp.objects[theseLists[i].source] = expectedObject;
                loadTabStructure(expectedObject);

                var ajaxCallStructure = getCallStructure(expectedObject);
                $.fn.spCommon.ajax(ajaxCallStructure);
            }
        }
    }

    function getCallStructure(m) {
        return getListStructure({
            path: m.path,
            source: m.thisVar,
            meta: m,
            afterCompletion: function () {
                getListLookups(m)
            }
        })
    }

    function getListLookups(m) {
        var thisSPListLookups = _.filter($.fn.spCRUD.data().objects[m.source].d.results, function (o) { return o.TypeAsString == "Lookup" });

        for (var iLookUp = 0; iLookUp < thisSPListLookups.length; iLookUp++) {
            getLookupData({ parentObject: m, object: thisSPListLookups[iLookUp], listGuid: thisSPListLookups[iLookUp].LookupList.replace('{', '').replace('}', '') });
        }

        //setTimeout(function(){ loadFormData(m) }, 500);
    }

    function loadTheLookupData(o) {
        var m = o.m;
        var a = o.a;

        for (var thisLookupData = 0; thisLookupData < a.d.results.length; thisLookupData++) {
            a.d.results[thisLookupData].lookupText = a.d.results[thisLookupData][m.object.LookupField];
        }
    }

    function getLookupData(m) {

        if (lookupDataPoints[m.parentObject.owner]
            && lookupDataPoints[m.parentObject.owner][m.listGuid]
            && lookupDataPoints[m.parentObject.owner][m.listGuid].response
            && lookupDataPoints[m.parentObject.owner][m.listGuid].response.d
            && lookupDataPoints[m.parentObject.owner][m.listGuid].response.d.results.length > 0
        ) {
            loadTheLookupData({
                m: m,
                a: lookupDataPoints[m.owner][m.listGuid].response
            });
        }
        else {
            $.fn.spCommon.ajax({
                source: m.parentObject.source,
                method: 'GET',
                url: m.parentObject.path + "/_api/web/lists(guid'" + m.listGuid + "')/items",
                done: function (a) {

                    if (lookupDataPoints[m.parentObject.owner] == undefined) {
                        lookupDataPoints[m.parentObject.owner] = {
                            lists: []
                        };
                    }

                    if (lookupDataPoints[m.parentObject.owner] != undefined && lookupDataPoints[m.parentObject.owner][m.listGuid] == undefined) {
                        lookupDataPoints[m.parentObject.owner][m.listGuid] = {
                            list: m.listGuid,
                            response: a,
                            child: false
                        };
                    }

                    if (_.filter(lookupDataPoints[m.parentObject.owner].lists, function (o) { return o == m.listGuid }).length == 0) {
                        lookupDataPoints[m.parentObject.owner].lists.push({ guid: m.listGuid });
                    }

                    loadTheLookupData({ m: m, a: a });
                }
            });
        }
    }

    var showFiles = function (sfm) {
    	sfm.create = false;
    	sfm.view = false;
    	if(sfm.parentObject)
    	{
    		sfm.owner = sfm.parentObject.source;
    		
    		switch(sfm.parentObject.action)
    		{
    			case "create": sfm.create = true; break;
    			case "view": sfm.view = true; break;
    		}
    	}
        $('[data-filecontainer=' + sfm.box + '] .box__inventory').html($.fn.spEnvironment.fileInventory(sfm));

        $('.box__inventory tbody tr .Remove-File').unbind('click', removeFile);
        $('.box__inventory tbody tr .Remove-File').bind('click', removeFile);

        //var thisValue = m.files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', m.files.length ) : m.files[0].name;
        //$label.text(thisValue);
    };

    function fileLoader(m) {
        var validation = m.validation == undefined ? {} : m.validation;
        var allowedExtensions = validation.allowedExtensions == undefined ? [] : validation.allowedExtensions;
        var sizeLimit = validation.sizeLimit == undefined ? -1 : validation.sizeLimit;

        var $form = $(m.thisObject);

        if (isAdvancedUpload) {
            $form.addClass('has-advanced-upload');
        }

        var $input = $form.find('input[type="file"]');
        var $label = $form.find('label');

        var checkExtension = function (m) {
            if (m.allowedExtensions.length > 0) {
                var thisExtension = $.fn.spCommon.getExtension(m.file.name);

                var addFile = m.allowedExtensions.indexOf(thisExtension) > -1;

                if (!addFile) {
                    toastr.error('File ' + m.file.name + ' not added to queue.', ' File extension ' + thisExtension + ' not allowed');
                }

                return addFile;
            }
            else { return true; }
        }

        var checkFileSize = function (m) {
            if (m.sizeLimit > -1) {
                var thisFileSize = m.file.size;

                var addFile = m.sizeLimit >= thisFileSize;

                if (!addFile) {
                    toastr.error('File ' + m.file.name + ' not added to queue.', ' File size too large and not allowed');
                }

                return addFile;
            }
            else { return true; }
        }

        if (isAdvancedUpload) {

            $form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
            })
                .on('dragover dragenter', function () {
                    $form.addClass('is-dragover');
                })
                .on('dragleave dragend drop', function () {
                    $form.removeClass('is-dragover');
                })
                .on('drop', function (e) {
                    if (e.originalEvent.dataTransfer.files) {
                        if ($(this).find('input').prop('multiple') == false) {
                            $(this).find('input').data('files', []);
                        }

                        var droppedFiles = $(this).find('input').data('files') == undefined ? [] : $(this).find('input').data('files');

                        for (var thisFile = 0; thisFile < e.originalEvent.dataTransfer.files.length; thisFile++) {
                            if (checkExtension({ allowedExtensions: allowedExtensions, file: e.originalEvent.dataTransfer.files[thisFile] })
                                && checkFileSize({ sizeLimit: sizeLimit, file: e.originalEvent.dataTransfer.files[thisFile] })
                            ) {
                                droppedFiles.push(e.originalEvent.dataTransfer.files[thisFile]);
                            }
                        }

                        $(this).find('input').data('files', droppedFiles);

                        showFiles({ box: $(this).prop('id'), files: droppedFiles });
                    }
                });
        }

        var fileObjectChanged = function (e) {
            if (e.target.files) {
                if ($(e.currentTarget).prop('multiple') == false) {
                    $(this).data('files', []);
                }

                var droppedFiles = $(this).data('files') == undefined ? [] : $(this).data('files');

                for (var thisFile = 0; thisFile < e.target.files.length; thisFile++) {
                    if (checkExtension({ allowedExtensions: allowedExtensions, file: e.target.files[thisFile] })
                        && checkFileSize({ sizeLimit: sizeLimit, file: e.target.files[thisFile] })
                    ) {
                        droppedFiles.push(e.target.files[thisFile]);
                    }
                }

                $(this).data('files', droppedFiles);

                showFiles({ box: $(this).parents('.box').prop('id'), files: droppedFiles });
            }
        }

        //$form.each(function(i, element){ 
        //	$('#' + $form[i].id ).find('input[type="file"]') .on('change', fileObjectChanged)
        //})

        $input.on('change', fileObjectChanged);
    }

    function loadTabStructure(m) {
        thisApp.objects[m.source.toLowerCase()].title = m.thisVar;
        thisApp.objects[m.source.toLowerCase()].name = m.source.toLowerCase();
        if ($('.spa-app-items li').length == 0) {
            thisApp.objects[m.source.toLowerCase()].active = true;
        }

        $('.spa-app-items').append(thisNavLiTemplate(thisApp.objects[m.source.toLowerCase()]));

        var tabContent = thisNavDivTemplate(thisApp.objects[m.source.toLowerCase()]);


        //Plug here
        $('#sp-app-contents').append(tabContent);

        var actionItems = $.fn.spEnvironment.anchorList({
            actions: [
                { href: 'javascript:void(0);', id: 'create-item-' + m.source.toLowerCase(), title: 'Create', i: '<i class="fa fa-plus"></i>', attributes: 'data-action="create" data-owner="' + m.source + '"', classes: 'launch-action' },
                { href: 'javascript:void(0);', id: 'view-item-' + m.source.toLowerCase(), title: 'View', i: '<i class="fa fa-file-text-o"></i>', attributes: 'data-action="view" data-owner="' + m.source + '"', classes: 'launch-action' },
                { href: 'javascript:void(0);', id: 'edit-item-' + m.source.toLowerCase(), title: 'Edit', i: '<i class="fa fa-edit"></i>', attributes: 'data-action="edit" data-owner="' + m.source + '"', classes: 'launch-action' },
                { href: 'javascript:void(0);', id: 'delete-item-' + m.source.toLowerCase(), title: 'Delete', i: '<i class="fa fa-trash"></i>', attributes: 'data-action="delete" data-owner="' + m.source + '"', classes: 'launch-action' }
            ]
        });

        var TabsActions = $.fn.spEnvironment.tabTemplate({
            name: m.source.toLowerCase(),
            tabs: [
                { active: true, div_id: 'action-tab-div-' + m.source.toLowerCase(), li_id: 'action-tab-li-' + m.source.toLowerCase(), li_title: 'Actions', htmlContent: actionItems },
                { active: false, div_id: 'filters-tab-div-' + m.source.toLowerCase(), li_id: 'filters-tab-li-' + m.source.toLowerCase(), li_title: 'Filters' },
                { active: false, div_id: 'misc-tab-div-' + m.source.toLowerCase(), li_id: 'misc-tab-li-' + m.source.toLowerCase(), li_title: 'Misc' }
            ]
        });

        $('#spActions-wrap-' + m.source.toLowerCase()).html(TabsActions);

        $('.nav-link').on('click', function () {
            var linkData = $(this).data();

            if (tables[linkData.owner] && tables[linkData.owner].ajax) {
                tables[linkData.owner].ajax.reload();
            }
        });
    }

    function loadCRUD(m) {
        //Goes Here
        //loadTabStructure(m)

        var baseTemplate = '100';

        if (thisApp.objects[m.source.toLowerCase()].d && thisApp.objects[m.source.toLowerCase()].d.results && thisApp.objects[m.source.toLowerCase()].d.results.length > 0) {
            if (thisApp.objects[m.source.toLowerCase()].d.results[0].EntityPropertyName == "FileLeafRef") {
                thisApp.objects[m.source.toLowerCase()].type = "Document Library";
                thisApp.objects[m.source.toLowerCase()].d.results[0].multiple = false;
                baseTemplate = '101';
            }
            else {
                thisApp.objects[m.source.toLowerCase()].type = "List";
            }
        }


        //thisApp.objects[m.source.toLowerCase()].thisContent = $.fn.dosEnvironment.hbTemplates(thisApp.objects[m.source.toLowerCase()]);

        $('#spTable-wrap-' + m.source.toLowerCase()).html($.fn.spEnvironment.spTableTemplate(m.meta))
        $('#lf-tree-' + m.source.toLowerCase()).html($.fn.spEnvironment.spJsTreeTemplate(m.meta))

        thisApp.objects[m.source.toLowerCase()].baseTemplate = baseTemplate;
        $('#nav-tab-' + m.source.toLowerCase()).data(thisApp.objects[m.source.toLowerCase()]);

        $('#tree_size_' + m.source.toLowerCase()).bind("loaded.jstree", function (event, data) {
            data.instance.open_all();
        });

        $('#tree_size_' + m.source.toLowerCase()).jstree();

        $.fn.spQuery.genTable({
            tableName: m.source.toLowerCase(),
            tableID: m.source.toLowerCase(),
            tableSelector: '#' + m.source.toLowerCase(),
            tableStructure: thisApp.objects[m.source.toLowerCase()]
        });

        if (typeof m.afterCompletion == 'function') {
            m.afterCompletion();
        }

        $('#action-tab-div-' + m.source.toLowerCase() + ' .launch-action').unbind('click', modalBinds);
        $('#action-tab-div-' + m.source.toLowerCase() + ' .launch-action').bind('click', modalBinds);
    }

    function initModalContent(m) {
        var crudModal = "";

        var thisCurrentObject = thisApp.objects[m.source].d.results;
        for (var i = 0; i < thisCurrentObject.length; i++) {
            thisCurrentObject[i].uiID = Math.uuidFast();
        }

        var LookupColumns = _.filter(thisApp.objects[m.source].d.results, function (o) { return o.TypeAsString == "Lookup" });

        if (LookupColumns) {
            for (var lc = 0; lc < LookupColumns.length; lc++) {
                var thisLookup = LookupColumns[lc];

                var foundLookup = _.find(thisApp.objects[m.source].d.results, function (o) { return o.InternalName == thisLookup.InternalName });

                if (foundLookup) {
                    foundLookup.LookupData = {};
                    foundLookup.LookupData.results = [];

                    if (foundLookup.LookupList) {
                        var thisGuid = foundLookup.LookupList.replace('{', '').replace('}', '');

                        var thisLookupDP = lookupDataPoints[m.source];

                        if (thisLookupDP && thisLookupDP[thisGuid] && thisLookupDP[thisGuid].response && thisLookupDP[thisGuid].response.d && thisLookupDP[thisGuid].response.d.results) {
                            foundLookup.LookupData.results = thisLookupDP[thisGuid].response.d.results;
                        }
                    }
                }
            }
        }


        thisApp.objects[m.source.toLowerCase()].formType = m.action;
        if (m.action != "delete") {
            crudModal += $.fn.spEnvironment.baseModal({ id: m.action + '-' + m.source, owner: m.source, action: m.action, title: m.action.capitalize() + ' ' + m.singular, minWidth: "50%", content: $.fn.spEnvironment.baseForm(thisApp.objects[m.source]) });
        }
        else {
            crudModal += $.fn.spEnvironment.baseModal({ id: m.action + '-' + m.source, owner: m.source, action: m.action, title: m.action.capitalize() + ' ' + m.singular, content: $.fn.spEnvironment.deleteItem(thisApp.objects[m.source]) });
        }


        $('body').append(crudModal);

        var fillinObjects = _.filter($.fn.spCRUD.data().objects[m.source].d.results, { FillInChoice: true });

        if (fillinObjects) {
            var tempObject = JSON.parse(JSON.stringify($.fn.spCRUD.data().objects[m.source]));
            tempObject.d.results = fillinObjects;

            for (var fi = 0; fi < fillinObjects.length; fi++) {
                $('body').append($.fn.spEnvironment.fillinModal(tempObject));
            }
        }

        loadFormData(m)

        var thisMo = m.action;
        $('#modal-' + thisMo + '-' + m.source + ' .form-container button').prependTo('#modal-' + thisMo + '-' + m.source + ' .modal-footer');



        fileLoader({
            thisObject: '.' + m.source.toLowerCase() + '-attachments',
            validation: {
                allowedExtensions: ['jpeg', 'jpg', 'gif', 'png', 'docx', 'pdf', 'xlsx', 'txt', 'xls', 'ppt', 'pptx', 'doc'],
                sizeLimit: 1024 * 1024 * 1024 * 2, // 50 kB = 50 * 1024 bytes,
                multiple: thisApp.objects[m.source.toLowerCase()].type == "Document Library" ? false : true
            }
        });

        $('.btn.save-data').unbind('click', $.fn.spCRUD.saveData);
        $('.btn.save-data').bind('click', $.fn.spCRUD.saveData);
        $('.btn.clear-data').unbind('click', $.fn.spCRUD.clearData);
        $('.btn.clear-data').bind('click', $.fn.spCRUD.clearData);
        $('.btn.delete-data').unbind('click', $.fn.spCRUD.saveData);
        $('.btn.delete-data').bind('click', $.fn.spCRUD.saveData);
        $('.sp-fill-in').unbind('click', $.fn.spCRUD.loadFillinModal);
        $('.sp-fill-in').bind('click', $.fn.spCRUD.loadFillinModal);
        initPeoplePickers();

        $('.sp-calendar').datepicker();

        $('#modal-' + thisMo + '-' + m.source).find('.select2-js, .sp-lookup').select2({
            dropdownParent: $('#modal-' + thisMo + '-' + m.source),
            width: '100%'
        });

        $('#modal-' + thisMo + '-' + m.source + ' [data-toggle="popover"]').popover();
    }

    function modalBinds() {
        var thisData = $(this).data();
        var action = thisData.action;
        var owner = thisData.owner.toLowerCase();

        var thisCaller = _.filter(theseLists, function (r) { return r.name.toLowerCase() == owner });

        if (thisCaller) {
            $('.modal[data-owner="' + owner + '"] .people-picker').each(function (i, element) {
                var thisID = $(element).prop('id');

                delete SPClientPeoplePicker.SPClientPeoplePickerDict[thisID + "_TopSpan"];
            });

            $('.modal[data-owner="' + owner + '"]').remove();
            $('.fillin-modal').remove();

            thisCaller[0].action = action;
            thisCaller[0].owner = owner;

            initModalContent(thisCaller[0]);
        }
    }

    function loadFormData(m) {
        var action = m.action;
        var owner = m.owner;

        var selectedRow = $('#' + owner + ' tbody tr.selected').index();

        var actionURL = '';
        var actionData = {};
        var itemURL = ''

        if (action != 'create' && selectedRow == -1) {
            toastr.error('Please select a row to ' + action + '.', 'No row selected!');
            return -1;
        }

        var templateType = $('#form-' + action + '-' + owner + '').data('basetemplate');

        theLoader.show({ id: owner + '-item-load' });

        switch (action) {
            case 'view':
            case 'edit':

                actionData = tables[owner].ajax.json().data[selectedRow];
                itemURL = actionData['odata.editLink'];

                actionURL = actionData['odata.editLink'];
                if (templateType == '101') {
                    //actionURL += '?$select=Title,ID,EncodedAbsUrl,*'
                    actionURL += '?' + $.fn.spQuery.getItemQuery({
                        tableName: owner,
                        tableID: owner,
                        tableSelector: '#' + owner,
                        tableStructure: thisApp.objects[owner],
                        templateType: templateType
                    })
                }
                else {
                    actionURL += '?' + $.fn.spQuery.getItemQuery({
                        tableName: owner,
                        tableID: owner,
                        tableSelector: '#' + owner,
                        tableStructure: thisApp.objects[owner],
                        templateType: '100'
                    })
                }

                var getDataForType = ['view', 'edit'];

                if (getDataForType.indexOf(action) > -1 && selectedRow > -1) {
                    $.fn.spCommon.ajax({
                        source: m.owner,
                        method: 'GET',
                        url: m.path + "/_api/" + actionURL + "",
                        done: function (a) {
                            var returnedData = a.d;

                            if (templateType == '101') {
                                returnedData.FileLeafRef = actionData.FileLeafRef;
                            }

                            $('#form-' + action + '-' + owner + '').find('input, select, textarea, .people-picker-data').each(function (dIndex, dElement) {
                                if ($(dElement).data('name')) {
                                    if (!$(dElement).hasClass('people-picker-data')) {
                                        switch ($(dElement).getType()) {
                                            case 'select':

                                                if ($(dElement).prop('multiple')) {
                                                    var thisSelectData = returnedData[$(dElement).data('name')];
                                                    if (thisSelectData && thisSelectData.results) {
                                                        $(dElement).val(thisSelectData.results);
                                                    }
                                                }
                                                else {
                                                    var theData = $(dElement).data();
                                                    var whichWay = theData.selectname ? theData.selectname : theData.name;
                                                    if ($(dElement).hasClass('sp-lookup')) {
                                                        var thisSelectData = returnedData[$(dElement).data('selectname')];
                                                        $(dElement).val(thisSelectData.Id);
                                                    }
                                                    else {
                                                        //Choice
                                                        var thisSelectData = returnedData[$(dElement).data('name')];

                                                        var tempChoiceVal = $(dElement).find('[value="' + thisSelectData + '"]');

                                                        if (tempChoiceVal.length > 0) {
                                                            $(dElement).val(thisSelectData);
                                                        }
                                                        else {

                                                            addValue2Select({
                                                                value: { id: thisSelectData, text: thisSelectData },
                                                                selector: $(dElement)
                                                            })
                                                        }
                                                    }

                                                }

                                                break;
                                            case 'radio':
                                                var thisRadioData = $(dElement).parents('.sp-radio-wrapper').data();
                                                var thisRadioValue = returnedData[$(dElement).data('name')];
                                                if ($(dElement).val() == thisRadioValue) {
                                                    $(dElement).prop('checked', true);
                                                }

                                                if ($(dElement).parents('.sp-radio-wrapper').find('input[value="' + thisRadioValue + '"]') && $('#' + thisRadioData.uuid + ' input').is(':checked') == false) {
                                                    thisRadioData.value = { id: thisRadioValue, text: thisRadioValue };
                                                    thisRadioData.selector = '#' + thisRadioData.uuid;
                                                    addValue2Radio(thisRadioData);
                                                }
                                                break;
                                            case 'checkbox':
                                                var thisCheck = returnedData[$(dElement).data('name')];

                                                if (thisCheck) {
                                                    $(dElement).prop('checked', true);
                                                }
                                                else {
                                                    $(dElement).prop('checked', false);
                                                }

                                                break;
                                            default:
                                                if ($(dElement).hasClass('sp-calendar')) {
                                                    var calendarDate = returnedData[$(dElement).data('name')];

                                                    if (calendarDate) {
                                                        calendarDate = moment(calendarDate).format('MM/DD/YYYY')
                                                    }
                                                    $(dElement).val(calendarDate);
                                                }
                                                else {
                                                    $(dElement).val(returnedData[$(dElement).data('name')]);
                                                }
                                                break;
                                        }
                                    }
                                    else {
                                        $(dElement).data('prepopulate', returnedData[$(dElement).data('name')])
                                    }
                                }
                            });

                            if (action == 'view') {
                                $('#form-' + action + '-' + owner + '').find('input, select, textarea').prop('readonly', true).prop('disabled', true).addClass('no-select object-disabled');
                            }

                            for (var mo = 0; mo < modalTypes.length; mo++) {
                                var thisMo = modalTypes[mo];
                                $('#modal-' + action + '-' + owner).find('.select2-js, .sp-lookup').select2({
                                    dropdownParent: $('#modal-' + action + '-' + owner),
                                    width: '100%'
                                });
                            }

                            //initPeoplePickers();
                            //Loads any people selectors
                            loadPickersWithData({ objectParent: $('#modal-' + action + '-' + owner) });

                            if (templateType != '101') {
                                var attachments = returnedData.AttachmentFiles.results;

                                showFiles({ box: action + '-' + owner + '-' + 'attachments', itemURL : itemURL, files: attachments, parentObject: m });
                                $('.Delete-Attachment-File').unbind('click', deleteItemAttachmentPrompt)
                                $('.Delete-Attachment-File').bind('click', deleteItemAttachmentPrompt)
                            }
                            else {
                                var relativeFilePath = $.fn.spCommon.getRelativeURL({ url: returnedData.EncodedAbsUrl });
                                var attachments = [{ FileName: returnedData.FileLeafRef, ServerRelativeUrl: relativeFilePath }];
                                $('#form-' + action + '-' + owner).data('FileLeafRef', relativeFilePath);
                                showFiles({ box: action + '-' + owner + '-' + 'attachments', files: attachments });
                            }

                            theLoader.hide({ id: owner + '-item-load' });
                            $('#modal-' + action + '-' + owner + '').modal('show');
                        }
                    });
                }
                else {
                    theLoader.hide({ id: owner + '-item-load' });
                    $('#modal-' + action + '-' + owner + '').modal('show');
                }
                break;
            case 'delete':
                actionData = tables[owner].ajax.json().data[selectedRow];
                actionURL = actionData['odata.editLink'];

                $('#form-' + action + '-' + owner + '').find('[name="' + owner + '.ID"]').val(actionData.ID)

                theLoader.hide({ id: owner + '-item-load' });
                $('#modal-' + action + '-' + owner + '').modal('show');

                break;
            case 'create':
            default:
                theLoader.hide({ id: owner + '-item-load' });
                $('#modal-' + action + '-' + owner + '').modal('show');
                break;
        }
    }
    
    function deleteItemAttachment(dm)
    {
    	var parentObject = _.find(theseLists, function (o) { return o.source = dm.owner });
		
		if(parentObject.path)
		{
			var deleteURL = parentObject.path + "/_api/" + dm.item + "/AttachmentFiles/getByFileName('" + dm.name + "')"; 
    		console.log(deleteURL)    	
    		
    		var crudRequest = {
                headers: deleteHeader({}),
                method: 'POST',
                source : dm.owner,
                url: deleteURL,
                data: undefined,
                done: function (a) { 
                    $('[data-filecontainer="edit-' + dm.owner + '-attachments"] tbody tr:eq(' + dm.tableRow + ')').remove();
                	toastr.success('Attachment ' + dm.name + ' deleted!', 'Attachment Deleted!');
                	tables[dm.owner].ajax.reload();
                },
                fail: function (a) {
                    toastr.error('There was an issue deleting the Attachment!', 'Attachment not deleted!');
                },
                always: function (a) {

                }
            }

			$.fn.spCommon.ajax(crudRequest);
    	}
    }
    
    function deleteItemAttachmentPrompt()
    {
    	var thisObject = $(this);
    	var tableRow = $(thisObject).parents('tr').index();
    	var thisObjectData = $(thisObject).data()
    	thisObjectData.tableRow = tableRow;
    	promptDialog.prompt({
            promptID: 'Delete-Item-Attachement',
            body: 'Are you sure you want to delete this attachement?',
            header: 'Delete File',
            closeOnEscape: true,
            open: function (event, ui) {
                //toastr.success('Data has been successfully submitted.', 'Form Submitted!');
            },
            buttons: [
            	{
                    text: "Cancel",
                    active: false,
                    close : true,
                    click: function () {
                        
                    }
                },
                {
                    text: "Delete",
                    active: true,
                    close : true,
                    click: function () {
                    	//$(this).parents('.modal').modal('close');
                    	$($(this).parents('.modal')).modal('hide')
                    	deleteItemAttachment(thisObjectData);
                        
                    }
                }]
        });
    }

    function getListStructure(m) {
        return {
            source: m.source,
            method: 'GET',
            url: m.path + "/_api/web/lists/getbytitle('" + m.source + "')/fields?$filter=Hidden eq false and ReadOnlyField eq false",
            done: function (a) {
                _.merge(thisApp.objects[m.source.toLowerCase()], a)
                //				thisApp.objects[m.source.toLowerCase()] = a;

                loadCRUD(m);
            },
            fail: function (a) {
            },
            always: function (a) {

            }
        }
    }

    var getFileBuffer = function (file) {

        var deferred = $.Deferred();
        var reader = new FileReader();

        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    };

    function clearForm(m) {
        m = typeof m == 'object' && m != undefined ? m : {};

        var thisData = $(m.currentTarget).data();
        var caller = '#' + thisData.owner;
        $(caller).data('FileLeafRef', '');

        var theseFormObjects = $(caller).find('input, select, textarea');

        $(theseFormObjects).each(function (i, element) {
            switch ($(element).prop('type')) {
                case 'text':
                    $(element).val($(element).data('defaultvalue'));
                    break;
                case 'select-one':
                    $(element).val($(element).data('defaultvalue'));
                    break;
                case 'file':
                    $('#' + thisData.owner + ' .box__inventory').html('');
                    $(element).data().files = [];
                    break;
            }
        });

        toastr.info('Form has been successfully cleared.', 'Form Cleared!');
    }

    function updateHeader(headers) {
        headers["IF-MATCH"] = "*";             //Overrite the changes in the sharepoint list item
        headers["X-HTTP-Method"] = "MERGE";

        return headers
    }

    function deleteHeader(headers) {
        headers["IF-MATCH"] = "*";             //Overrite the changes in the sharepoint list item
        headers["X-HTTP-Method"] = "DELETE";

        return headers
    }

    function saveForm(m) {
        var thisData = $(m.currentTarget).data();
        var caller = '#' + thisData.owner;
        var baseTemplate = $(caller).data().basetemplate;

        var thisActionType = thisData.action;
        var parentObject = _.find(theseLists, function (o) { return o.source = thisData.source });

        if (parentObject.path) {
            var destinationURL = '';
            var headers = {};
            switch (thisActionType.toLowerCase()) {
                default:
                case 'save':
                    destinationURL = parentObject.path + "/_api/web/lists/GetByTitle('" + thisData.sptype + "')/items";
                    break;
                case 'update':
                    headers = updateHeader(headers);
                    destinationURL = parentObject.path + "/_api/web/lists/GetByTitle('" + thisData.sptype + "')/items(" + $(caller).find('[data-name="ID"]').val() + ")";
                    break;
                case 'delete':
                    headers = deleteHeader(headers);
                    destinationURL = parentObject.path + "/_api/web/lists/GetByTitle('" + thisData.sptype + "')/items(" + $(caller).find('[data-name="ID"]').val() + ")";
                    break;
            }

            var theseFormObjects = $(caller).find('input, select, textarea, .people-picker');

            var formObjects = {};
            var fileObjects = [];

            var multiTypes = [];
            $(theseFormObjects).each(function (i, element) {

                var onlyAddValidObjects = $(element).parents('.sp-peoplepicker-topLevel').length == 0;

                if (onlyAddValidObjects) {
                    var thisCurrentObject = $(element).data('entity') ? $(element).data('entity').replace(/-/g, '_x002d_') : '';

                    switch ($(element).prop('type')) {
                        case 'hidden':
                            if ($(element).hasClass('people-picker-data')) {
                                formObjects[thisCurrentObject] = $('.people-picker[name="' + $(element).prop('name') + '"] ').find('[id$="_TopSpan_HiddenInput"]').val();
                            }
                            break;
                        case 'date':
                            if ($(element).val()) {
                                formObjects[thisCurrentObject] = moment($(element).val()).format();
                            }
                        case 'checkbox':
                            formObjects[thisCurrentObject] = $(element).is(":checked");
                            break;
                        case 'text':
                            if ($(element).hasClass('sp-calendar')) {
                                var thisDate = moment($(element).val()).format();
                                formObjects[thisCurrentObject] = thisDate != undefined && thisDate.toLowerCase() != "invalid date" ? thisDate : null;
                            }
                            else {
                                var thisValue = $(element).val();
                                formObjects[thisCurrentObject] = thisValue ? thisValue : null;
                            }
                            break;
                        case 'radio':
                            if ($(element).prop('checked')) {
                                formObjects[thisCurrentObject] = $(element).val();
                            }
                            break;
                        case 'select-one':
                            formObjects[thisCurrentObject] = $(element).find('option:selected').val();
                            break;
                        case 'select-multiple':
                            var multiValue = $(element).val();
                            var finalValue = multiValue ? { "__metadata": { "type": "Collection(Edm.String)" }, "results": multiValue } : { "__metadata": { "type": "Collection(Edm.String)" }, "results": [] };
                            formObjects[thisCurrentObject] = finalValue;
                            break;
                        case 'file':
                            fileObjects = $(element).data().files;
                            break;
                    }
                }
                else {
                    if ($(element).parents('.people-picker') && $(element).prop('id').indexOf('_TopSpan_HiddenInput') > -1) {
                        var parentObject = $(element).parents('.people-picker')
                        var parentID = $(parentObject).prop('id');
                        var parentData = $(parentObject).data();

                        var rootObject = $('input[name="' + parentData.name + '"]');
                        var rootObjectName = $(rootObject).data('name');

                        var theseValues = SPClientPeoplePicker.SPClientPeoplePickerDict[parentID + "_TopSpan"].GetAllUserInfo()

                        if (theseValues) {
                            var ids = [];

                            for (var u = 0; u < theseValues.length; u++) {
                                switch (theseValues[u].EntityType) {
                                    case "SPGroup":
                                        ids.push(theseValues[u].EntityData.SPGroupID)
                                        break;
                                    case "User":
                                        var thisUser = $.fn.spCommon.ajax({
                                            source: thisData.owner,
                                            method: 'GET',
                                            async: false,
                                            url: parentObject.path + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(theseValues[u].Key) + "'",
                                        });

                                        if (thisUser.d) {
                                            ids.push(thisUser.d.Id);
                                        }
                                        break;
                                }
                            }
                            if ($(rootObject).data('multi')) {
                                formObjects[$(rootObject).data('name').replace(/-/g, '_x002d_') + "Id"] = { results: ids };
                            }
                            else {
                                formObjects[$(rootObject).data('name').replace(/-/g, '_x002d_') + "Id"] = ids.length > 0 ? ids[0] : null;

                            }

                        }
                    }
                }
            });
        }

        formObjects['__metadata'] = {
            'type': 'SP.Data.' + thisData.sptype.replace(/-/g, '') + 'ListItem' // it defines the ListEnitityTypeName  
        }

        if (destinationURL && !inTestMode) {
            if (baseTemplate == '100') {
                var crudRequest = {
                    headers: headers,
                    method: 'POST',
                    url: destinationURL,
                    data: thisActionType.toLowerCase() == 'delete' ? undefined : JSON.stringify(formObjects),
                    fail: function (a) {
                        toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                    },
                    always: function (a) {

                    }
                }

                crudRequest.done = function (r) {

                    switch (thisActionType.toLowerCase()) {
                        default:
                        case 'save':
                            var returnedData = r.d;

                            setTimeout(function () {
                                triggerGenericListUploads({
                                    parentObject: parentObject,
                                    returnedData: returnedData,
                                    fileObjects: fileObjects,
                                    thisData: thisData
                                });
                            }, 50);
                            toastr.success('Data has been successfully submitted.', 'Form Submitted!');
                            break;
                        case 'update':
                        	 setTimeout(function () {
                                triggerGenericListUploads({
                                    parentObject: parentObject,
                                    returnedData: { ID : $(caller).find('[data-name="ID"]').val() },
                                    fileObjects: fileObjects,
                                    thisData: thisData
                                });
                            }, 50);

                            toastr.success('Data has been successfully submitted.', 'Form Submitted!');
                            break;
                        case 'delete':
                            if (r && r.responseJSON && r.responseJSON.error && r.responseJSON.error.message && r.responseJSON.error.message.value.indexOf('list is related to an item in the')) {
                                toastr.success('Data has been successfully deleted.', 'Item Deleted!');
                            }
                            else {
                                toastr.success('Data has been successfully deleted.', 'Item Deleted!');

                            }
                            break;
                    }
                    var callerData = $(m.currentTarget).data()

                    var callerId = '#' + callerData.owner
                    $(callerId).parents('.modal').modal('hide');

                    setTimeout(function () {
                        var thisowner = $(callerId).parents('.modal').data('owner');
                        $(callerId).parents('.modal').remove();
                        $('.fillin-modal').remove();
                        tables[thisowner].ajax.reload();
                    }, 200);
                };

                crudRequest.fail = function (r) {
                    switch (thisActionType.toLowerCase()) {
                        default:
                        case 'save':
                            toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                            break;
                        case 'update':
                            toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                            break;
                        case 'delete':
                            var matchedError = false;

                            if (matchedError == false && r.responseJSON.error.message.value.indexOf('list is related to an item in the')) {
                                toastr.warning('Item cannot be deleted due to child relationshops.', 'Failed to delete!');
                                matchedError = true;
                            }

                            if (matchedError == false && r.responseJSON.error.message.value.indexOf('Item does not exist')) {
                                toastr.warning(r.responseJSON.error.message.value, 'Refresh Data Table!');
                                matchedError = true;
                            }

                            break;
                    }
                    var callerData = $(m.currentTarget).data()

                    var callerId = '#' + callerData.owner
                    $(callerId).parents('.modal').modal('hide');

                    setTimeout(function () {
                        var thisowner = $(callerId).parents('.modal').data('owner');
                        $(callerId).parents('.modal').remove();
                        $('.fillin-modal').remove();
                        tables[thisowner].ajax.reload();
                    }, 200);
                }

                $.fn.spCommon.ajax(crudRequest);
            }
            else if (baseTemplate == '101') {
                switch (thisActionType.toLowerCase()) {
                    default:
                    case 'save':

                        triggerDocumentLibraryUpload({
                            parentObject: parentObject,
                            overwrite: false,
                            fileObjects: fileObjects,
                            thisData: thisData,
                            fail: function (f2) {
                                var matchedError = false;

                                if (matchedError == false && f2.responseJSON.error.message.value.indexOf('already exists')) {
                                    toastr.error(f2.responseJSON.error.message.value.replace('i:0#.f|membership|', ''), 'File already exists!');
                                    matchedError = true;
                                }

                            },
                            done: function (r2) {

                                switch (thisActionType.toLowerCase()) {
                                    default:
                                    case 'save':

                                        headers = updateHeader(headers);

                                        formObjects['__metadata'] = {
                                            'type': 'SP.ListItem' // it defines the ListEnitityTypeName  
                                        };

                                        var crudRequest = {
                                            headers: headers,
                                            method: 'POST',
                                            url: r2.d.ListItemAllFields.__deferred.uri,
                                            data: JSON.stringify(formObjects),
                                            fail: function (a) {
                                                toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                                            },
                                            always: function (a) {

                                            },
                                            done: function (a) {
                                                toastr.success('File meta has been successfully submitted.', 'Form Submitted!');
                                            }
                                        }

                                        $.fn.spCommon.ajax(crudRequest);

                                        //										console.log("_api/Web/GetFileByServerRelativePath(decodedurl='/sites/BP/BPi/Sandbox/SOP/Procedures/2018-2022%20FBS%20(1).pdf')/");
                                        break;
                                    case 'update':


                                        break;
                                }
                            }
                        })
                        break;
                    case 'update':
                        headers = updateHeader(headers);

                        formObjects['__metadata'] = {
                            'type': 'SP.ListItem' // it defines the ListEnitityTypeName  
                        };
                        var updateFileLeafRef = $(caller).data().FileLeafRef;
                        var url101Update = parentObject.path + "/_api/Web/GetFileByServerRelativePath(decodedurl='" + updateFileLeafRef + "')/ListItemAllFields"

                        var crudRequest = {
                            headers: headers,
                            method: 'POST',
                            url: url101Update,
                            data: JSON.stringify(formObjects),
                            fail: function (a) {
                                toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                            },
                            always: function (a) {

                            },
                            done: function (a) {
                                toastr.success('File meta has been successfully submitted.', 'Form Submitted!');
                            }
                        }

                        $.fn.spCommon.ajax(crudRequest);
                        break;
                    case 'delete':
                        var crudRequest = {
                            headers: headers,
                            method: 'POST',
                            url: destinationURL,
                            data: undefined,
                            done: function (a) {
                                toastr.success('File has been deleted successfully submitted.', 'File deleted!');
                            },
                            fail: function (a) {
                                var matchedError = false;

                                if (matchedError == false && r.responseJSON.error.message.value.indexOf('list is related to an item in the')) {
                                    toastr.warning('Item cannot be deleted due to child relationships.', 'Failed to delete!');
                                    matchedError = true;
                                }

                                if (matchedError == false && r.responseJSON.error.message.value.indexOf('Item does not exist')) {
                                    toastr.warning(r.responseJSON.error.message.value, 'Refresh Data Table!');
                                    matchedError = true;
                                }
                            },
                            always: function (a) {

                            }
                        }

                        $.fn.spCommon.ajax(crudRequest);

                        break;
                }
            }
        }
    }

    function triggerDocumentLibraryUpload(m) {
        var overWriteFile = typeof m.overwrite == 'boolean' ? m.overwrite : false;

        var thesePendingFiles = [];

        function processQueue() {
            var tempList = _.filter(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; });

            if (tempList.length > 0) {
                tempList[0].theFile.then(function (buffer) {
                    tempList[0].xhrRequest.data = buffer;
                    tempList[0].xhrRequest.always = function (r) {

                        if (_.find(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; })) {
                            _.find(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; }).loaded = true;
                        }

                        processQueue();
                    };

                    $.fn.spCommon.ajax(tempList[0].xhrRequest);
                });
            }
        }

        if (m.fileObjects) {
            for (var thisFile = 0; thisFile < m.fileObjects.length; thisFile++) {
                var itemForQueue = uploadTheFile({
                    fileObjects: m.fileObjects,
                    thisFile: thisFile,
                    thisData: m.thisData,
                    url: m.parentObject.path + "/_api/web/lists/GetByTitle('" + m.thisData.sptype + "')/RootFolder/Files/add(overwrite=" + overWriteFile + ", url='" + m.fileObjects[thisFile].name + "')",
                    done: m.done,
                    fail: m.fail
                });

                itemForQueue.loaded = false;

                thesePendingFiles.push(itemForQueue);
            }
        }

        processQueue();

    }

    function triggerGenericListUploads(m) {
        var thesePendingFiles = [];

        function processQueue() {
            var tempList = _.filter(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; });

            if (tempList.length > 0) {
                tempList[0].theFile.then(function (buffer) {
                    tempList[0].xhrRequest.data = buffer;
                    tempList[0].xhrRequest.always = function (r) {

                        if (_.find(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; })) {
                            _.find(thesePendingFiles, function (o) { return o.loaded == undefined || o.loaded == false; }).loaded = true;
                        }

                        processQueue();
                    };

                    $.fn.spCommon.ajax(tempList[0].xhrRequest);
                });
            }
        }

        if (m.fileObjects) {
            for (var thisFile = 0; thisFile < m.fileObjects.length; thisFile++) {
                var itemForQueue = uploadTheFile({
                    fileObjects: m.fileObjects,
                    thisFile: thisFile,
                    thisData: m.thisData,
                    returnedData: m.returnedData,
                    url: m.parentObject.path + "/_api/web/lists/GetByTitle('" + m.thisData.sptype + "')/items(" + m.returnedData.ID + ")/AttachmentFiles/add(FileName='" + m.fileObjects[thisFile].name + "')"
                });

                itemForQueue.loaded = false;

                thesePendingFiles.push(itemForQueue);
            }
        }

        processQueue();
    }

    function uploadTheFile(m) {
        var currentFile = m.fileObjects[m.thisFile];
        var loadedFile = getFileBuffer(currentFile);

        //.then(

        //function(buffer)
        //{
        var uploadFileXHR = {
            method: 'POST',
            url: m.url,
            data: undefined,
            processData: false,
            tryCount: 0,
            retryLimit: 3,
            done: function (r) {
                toastr.success('File ' + currentFile.name + ' uploaded!', 'File Uploaded!');

                if (typeof m.done == 'function') {
                    m.done(r);
                }

            },
            fail: function (response, errorCode, errorMessage) {

                if (typeof m.fail == 'function') {
                    m.fail(response);
                }
                else {
                    if (response.status == 409) {
                        if (this.tryCount <= this.retryLimit) {
                            this.tryCount++;
                            //try again
                            $.ajax(this);
                            return;
                        }
                        else {
                            toastr.error('Error Submitting Data!', 'Data Not Submitted!');
                        }
                        //console.log(response)
                        //handle error
                    }
                    else if (response.status == 400)
                    {
                    	if(response.responseJSON && response.responseJSON.error &&  response.responseJSON.error.message)
                    	{
                    		var fileMessage = response.responseJSON.error.message.value;
                    		
                    		toastr.error(fileMessage , 'File not saved');
                    	}
                    	

                    }
                    else {
                        console.log(errorCode)
                        //handle error
                    }
                }

            },
        }

        //$.fn.spCommon.ajax(uploadFileXHR);	        				
        //});
        return { xhrRequest: uploadFileXHR, theFile: loadedFile }
    }

    var getFileBuffer = function (file) {

        var deferred = $.Deferred();
        var reader = new FileReader();

        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    };

    // Render and initialize the client-side People Picker.
    function initializePeoplePicker(m) {

        // Create a schema to store picker properties, and set the properties.
        var schema = {};
        if (m.type == 'User') {
            schema['PrincipalAccountType'] = 'User';
        }
        else {
            schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';

        }
        schema['SearchPrincipalSource'] = 15;
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = m.multi;
        schema['MaximumEntitySuggestions'] = 50;
        schema['SharePointGroupID'] = m.selectiongroup;
        schema['Width'] = '100%';

        var prepop = m.users ? m.users : null;
        // Render and initialize the picker. 
        // Pass the ID of the DOM element that contains the picker, an array of initial
        // PickerEntity objects to set the picker value, and a schema that defines
        // picker properties.
        this.SPClientPeoplePicker_InitStandaloneControlWrapper(m.id, prepop, schema);
    }

    // Query the picker for user information.
    function getUserInfo() {

        // Get the people picker object from the page.
        var peoplePicker = this.SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

        // Get information about all users.
        var users = peoplePicker.GetAllUserInfo();
        var userInfo = '';
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            for (var userProperty in user) {
                userInfo += userProperty + ':  ' + user[userProperty] + '<br>';
            }
        }

        $('#resolvedUsers').html(userInfo);

        // Get user keys.
        var keys = peoplePicker.GetAllUserKeys();
        $('#userKeys').html(keys);

        // Get the first user's ID by using the login name.
        getUserId(users[0].Key);
    }

    function ensureUserSuccess() {
        //	createitem(this.user.get_id());
        console.log(this.user.get_id())
        //	$('#userId').html();
    }

    function onFail(sender, args) {
        alert('Query failed. Error: ' + args.get_message());
    }

    // Get the user ID.
    function getUserId(loginName) {
        var context = new SP.ClientContext.get_current();
        this.user = context.get_web().ensureUser(loginName);
        context.load(this.user);
        context.executeQueryAsync(
            Function.createDelegate(null, ensureUserSuccess),
            Function.createDelegate(null, onFail)
        );
    }

    function loadPickersWithData(m) {
        $(m.objectParent).find('.people-picker').each(function (i, element) {

            clearPicker({ selector: $(element).prop('id') + "_TopSpan" });

            var parentName = $(element).data('name');
            if ($('[name="' + parentName + '"]').data('prepopulate')) {
                var data = {};
                var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[$(element).prop('id') + "_TopSpan"]
                data.users = [];
                var prepop = $('[name="' + parentName + '"]').data('prepopulate');
                if ($('[name="' + parentName + '"]').data('multi')) {
                    data.users = prepop != undefined && prepop.results != undefined ? prepop.results : [];

                    for (var ii = 0; ii < data.users.length; ii++) {
                        var usrObj = { Key: data.users[ii].Name }
                        peoplePicker.AddUnresolvedUser(usrObj, true);
                    }

                }
                else {
                    if (prepop.Name) {
                        data.users.push(prepop);

                        for (var ii = 0; ii < data.users.length; ii++) {
                            var usrObj = { Key: data.users[ii].Name }

                            peoplePicker.AddUnresolvedUser(usrObj, true);
                        }
                    }
                }
            }

        });
    }

    function clearPicker(m) {
        var getIDPeoplePicker = m.selector
        var ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[getIDPeoplePicker];
        var usersobject = ppobject.GetAllUserInfo();
        usersobject.forEach(function (index) {
            ppobject.DeleteProcessedUser(usersobject[index]);
        });
    }

    function initPeoplePickers() {
        $('.people-picker').each(function (i, element) {
            var data = $(element).data();
            data.id = $(element).prop('id');

            $.fn.spCRUD.initializePeoplePicker(data);
        });

        $('.sp-peoplepicker-topLevel').addClass('form-control');
        $('.sp-peoplepicker-topLevel').css('width', '');
    }

    function loadFillinModal(e) {
        var thisData = $(e).data()

        if (thisData.owner && thisData.source) {
            $('#modal-fillin-' + thisData.source + '-' + thisData.owner).modal('show')
        }

        $('.fill-in-btn').unbind('click', addFillinValue);
        $('.fill-in-btn').bind('click', addFillinValue);
    }

    function addFillinValue() {
        var thisValue = $(this).parents('.modal').find('.fill-in-value').val();

        if (thisValue) {
            var thisData = $(this).data();
            var ownerModal = $(this).parents('.modal');

            switch (thisData.choicetype) {
                case "dropdown":
                case 0: //dropdown
                    thisData.value = { id: thisValue, text: thisValue };
                    thisData.selector = '#' + thisData.uiid;

                    addValue2Select(thisData);
                    break;
                case "radio":
                case 1: //radio
                    thisData.value = { id: thisValue, text: thisValue };
                    thisData.selector = '#' + thisData.uiid;

                    addValue2Radio(thisData);

                    console.log('add radio');
                    break;
            }
        }
    }

    function addValue2Radio(m) {
        if (m.selector && m.value && m.value.id && m.value.text) {
            var numberOfChecks = $(m.selector).find('.form-check').length;
            var nextNumber = numberOfChecks + 1;
            var optionSyntax = '<div class="form-check">' +
                '	<input class="form-check-input" for="' + m.uuid + '" type="radio" name="' + m.source + '.' + m.for + '" data-entity="' + m.entity + '" id="' + m.action + '.' + m.source + '.' + m.for + '' + nextNumber + '" data-name="' + m.for + '" value="' + m.value.id + '" >' +
                '	<label class="form-check-label" for="">' + m.value.text + '</label>' +
                '</div>'

            var newOption = $(optionSyntax)

            $(m.selector).append(newOption);

            $('input[for="' + m.uuid + '"][value="' + m.value.id + '"]').prop('checked', true);
        }
    }

    function addValue2Select(m) {
        if (m.selector && m.value && m.value.id && m.value.text) {
            var data = {
                id: m.value.id,
                text: m.value.text
            };

            var newOption = new Option(data.text, data.id, false, true);
            $(m.selector).append(newOption).trigger('change');
        }
    }

    return {
        initPeoplePickers: function (m) { return initPeoplePickers() },
        initializePeoplePicker: function (m) { return initializePeoplePicker(m) },
        getUserInfo: function (m) { return getUserInfo(m) },
        getUserId: function (m) { return getUserId(m) },
        data: function (m) { return thisApp; },
        getStruct: function (m) {
            return getListStructure(m);
        },
        getList: function (m) {
            if (!inEditMode) {
                theLoader.show({ id: 'initiateApp' })
                theseLists = m.objects;
                loadLists();
                //$.fn.spCommon.theList(m);
                setTimeout(function () { theLoader.hide({ id: 'initiateApp' }) }, 2000);
            }
        },
        clear: function (m) {
            $('#sp-app-contents').empty();
            $('.spa-app-items').empty();
        },
        fileLoader: function (m) {
            fileLoader(m);
        },
        saveData: function (m) {
            return saveForm(m);
        },
        clearData: function (m) {
            return clearForm(m);
        },
        lookupDataPoints: function () {
            return lookupDataPoints;
        },
        loadFillinModal: function () {
            return loadFillinModal($(this))
        }
    }
})();
