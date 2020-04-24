/*jshint scripturl:true*/
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as toastr from "toastr";
import 'bootstrap';
import 'jstree';
import * as spEnv from "./spa.spEnv";
import * as spCommon from "./spa.spCommon";
import * as spQuery from "./spa.spQuery";
import * as spLoader from "./theLoader";
import * as spPrompt from "./spa.spPrompt";

declare var SP: any;
declare var SPClientPeoplePicker: any;
declare var SPClientPeoplePicker_InitStandaloneControlWrapper: any;

export var spCRUD = (function () {
    var modalTypes = ['create', 'view', 'edit', 'delete'];

    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();

    var thisApp = {
        objects: {},
        lastSave: {
            mainSaveData: {
                ID : undefined,
                Name: undefined
            },
            action: { action : undefined, loaded : false},
            owner: "",
            templateType: "0",
        }
    };

    var clearLastSave = function () {
        for (var prop in thisApp.lastSave) {
            if(typeof thisApp.lastSave[prop] != "object")
            { 
                thisApp.lastSave[prop] = undefined;
            }
            else{
                if(Array.isArray(thisApp.lastSave[prop]))
                {
                    thisApp.lastSave[prop] = [];
                }
                else{
                    for (var prop2 in thisApp.lastSave[prop])
                    {
                        thisApp.lastSave[prop2] = undefined;
                    }
                }                
            }
        }
    };

    var theseLists = [];
    var lookupDataPoints = {};

    var settings = {
        hasConfig: false,
        loadConfigs: false,
        hashidden: false
    };

    function loadConfigsLists() {
        settings.loadConfigs = true;
        loadLists();
    }

    var currentRecord = {
        FileLeafRef : ""
    };

    function addUiGuidsToItem(m: any) {
        if (Array.isArray(m)) {
            for (var i = 0; i < m.length; i++) {
                m[i].uiID = Math.uuidFast();
            }
        }
    }

    function removeFile(e: any) {
        var thisRowIndex = $(this).parents('tr').index();
        var parent = $(this).parents('.file_inventory');
        var thisOwner = $(parent).data('filecontainer');

        var thisFileInput = $(parent).siblings('.box.has_advanced_upload').find('input.box__file');

        var FileArray = $(thisFileInput).data().files;

        var index;

        FileArray.splice(thisRowIndex, 1);

        showFiles({
            box: thisOwner,
            files: FileArray
        });
    }

    function initObjectParams(e: spaLoadListStruct) {
        e.thisVar = e.thisVar ? e.thisVar : e.name;
        e.name = e.name.toLowerCase();
        e.thisObjectLower = e.name;
        e.owner = e.name;
        e.source = e.name;
        e.path = e.path ? e.path : _spPageContextInfo.webAbsoluteUrl;
        e.loaded = typeof e.loaded == "boolean" && e.loaded == true ? true : false;
        e.title = e.thisVar;
        e.tabTitle = e.tabTitle ? e.tabTitle : e.thisVar;
        e.sectionName = e.sectionName ? e.sectionName : e.tabTitle;
        e.spType = e.spType ? e.spType : e.title;
        e.loadActionButtons = true;
        e.dataEditable = typeof e.dataEditable == "boolean" ? e.dataEditable : true;
        e.metaDataVisible = typeof e.metaDataVisible == "boolean" ? e.metaDataVisible : false;

        return e;
    }

    function loadLists() {

        //var tempList = _.filter(theseLists, function (o) { return o.loaded == undefined || o.loaded == false; });
        for (var i = 0; i < theseLists.length; i++) {
            initObjectParams(theseLists[i]);
        }

        settings.hasConfig = _.filter(theseLists, { loaded: false, config: true }).length > 0 ? true : false;

        settings.hashidden = _.filter(theseLists, { loaded: false, hidden: true }).length > 0 ? true : false;

        spCommon.spCommon.getUserPermissions({
            urls: _.uniq(_.map(theseLists, 'path')),
            accountName: _spPageContextInfo.userLoginName,
            done : function() {
                var waitForPermissions = setInterval(function () {
                    if (theseLists && spEnv.spPermissions.loaded) {
                        clearInterval(waitForPermissions);
                        for (var i = 0; i < theseLists.length; i++) {
                            if (theseLists[i].loaded != true) {
                                theseLists[i].loaded = false;
        
                                var expectedObject = theseLists[i];
        
                                thisApp.objects[theseLists[i].source] = expectedObject;
                                if (spCommon.spCommon.checkUserPermission({
                                    path: expectedObject.path,
                                    privilege: "viewListItems"
                                }) && (expectedObject.config != true || settings.loadConfigs == true)) {
                                    expectedObject.loaded = true;
                                    loadTabStructure(expectedObject);
                                    getListMeta(expectedObject);
                                }
                            }
                        }
                    }
                }, 50);
            }
        });        
    }

    function getListMeta(m: any) {
        var thisAjax = {
            method: 'GET',
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists?$filter=Title eq '" + m.thisVar + "'",
            done: function (a: any) {
                if (a.d && a.d.results && a.d.results.length > 0) {
                    thisApp.objects[m.source].listData = a.d.results[0];
                    thisApp.objects[m.source].id = thisApp.objects[m.source].listData.Id;

                    var ajaxCallStructure = getCallStructure(m);
                    spCommon.spCommon.ajax(ajaxCallStructure);
                }
            },
            fail: function (a: any) {
                toastr.error("Failed to get list data for " + m.thisVar);
            },
            always: function (a: any) {

            }
        };

        spCommon.spCommon.ajax(thisAjax);
    }

    function getCallStructure(m: any) {
        return getListStructure({
            path: m.path,
            source: m.thisVar,
            meta: m,
            afterCompletion: function () {
                getListLookups(m);
            }
        });
    }

    function updateLookups(m: any) {
        if (lookupDataPoints) {
            var filterThisCaller = function (r: any) {
                return r.name.toLowerCase() == owner;
            };

            for (var owner in lookupDataPoints) {
                var thisLookup = lookupDataPoints[owner];
                var thisCaller = _.filter(theseLists, filterThisCaller);
                var relationships = thisCaller[0].relationships;


                if (thisLookup && thisLookup[m.id] && thisLookup[m.id].response && thisLookup[m.id].response.d && thisLookup[m.id].response.d.results) {
                    if (lookupDataPoints[owner]) {
                        var lookupField = "";
                        var thisField = _.find(thisCaller[0].relationships, {
                            child: thisLookup[m.id].owner
                        });
                        if (relationships && thisField) {
                            lookupField = thisField.lookupField;
                        } else {
                            lookupField = thisLookup[m.id].owner;
                        }

                        /*lookupDataPoints[owner][m.id].response.d.results = mGlobal.page[m.owner].currentJsonData.fullData;		            		
						for (var thisLookupData = 0; thisLookupData < lookupDataPoints[owner][m.id].response.d.results.length; thisLookupData++) 
						{							
							lookupDataPoints[owner][m.id].response.d.results[thisLookupData].lookupText = lookupDataPoints[owner][m.id].response.d.results[thisLookupData][lookupField];												            					                   
		            	}
		            	
		            	//Set Alpha Order
		            	lookupDataPoints[owner][m.id].response.d.results = _.orderBy(lookupDataPoints[owner][m.id].response.d.results, [lookupField ],['asc']);*/
                    }
                }
            }
        }
    }

    function getListLookups(m: any) {
        var thisSPListLookups = _.filter(spCRUD.data().objects[m.source].d.results, function (o) {
            return o.TypeAsString == "Lookup";
        });

        for (var iLookUp = 0; iLookUp < thisSPListLookups.length; iLookUp++) {
            getLookupData({
                parentObject: m,
                object: thisSPListLookups[iLookUp],
                listGuid: thisSPListLookups[iLookUp].LookupList.replace('{', '').replace('}', '')
            });
        }
    }

    function decideWhichLookupColumn(a: any) {

        var doesItHaveRows = _.filter(a.data, function (i) { return i[a.column]; });
        var usedLookup = doesItHaveRows && doesItHaveRows.length > 0 ? a.column : "Title";

        return usedLookup;
    }

    function loadTheLookupData(o) {
        var m = o.m;
        var a = o.a;

        var command = { data: a.d.results, column: m.object.LookupField };

        var usedLookup = decideWhichLookupColumn(command);

        for (var thisLookupData = 0; thisLookupData < a.d.results.length; thisLookupData++) {

            a.d.results[thisLookupData].lookupText = a.d.results[thisLookupData][usedLookup];
        }
    }

    function reloadLookupData(m: any) {
        var thisLookupContainer = lookupDataPoints[m.owner];

        var reloadLookupDataDone = function (a) {

            if (lookupDataPoints[m.owner] == undefined) {
                lookupDataPoints[m.owner] = {
                    lists: []
                };
            }

            lookupDataPoints[m.owner].lastupdate = Date.now();

            if (lookupDataPoints[m.owner] != undefined && lookupDataPoints[m.owner][m.listGuid] == undefined) {
                lookupDataPoints[m.owner][element.guid].response = a;

            }

            loadTheLookupData({
                m: {
                    parentObject: m,
                    listGuid: element.guid,
                    object: {
                        LookupField: element.owner
                    }
                },
                a: a
            });
        };

        if (thisLookupContainer && thisLookupContainer.lists && thisLookupContainer.lists.length > 0) {
            for (var currentListIndex = 0; currentListIndex < thisLookupContainer.lists.length; currentListIndex++) {
                var element = thisLookupContainer.lists[currentListIndex];
                if (thisLookupContainer.lastupdate && thisLookupContainer.lastupdate > Date.now() - (15 * 1000)) {
                    return false;
                }

                spCommon.spCommon.ajax({
                    source: m.source,
                    method: 'GET',
                    async: false,
                    url: m.path + "/_api/web/lists(guid'" + element.guid + "')/items",
                    done: reloadLookupDataDone
                });
            }
        }
    }

    function getLookupData(m: any) {

        if (lookupDataPoints[m.parentObject.owner] &&
            lookupDataPoints[m.parentObject.owner][m.listGuid] &&
            lookupDataPoints[m.parentObject.owner][m.listGuid].response &&
            lookupDataPoints[m.parentObject.owner][m.listGuid].response.d &&
            lookupDataPoints[m.parentObject.owner][m.listGuid].response.d.results.length > 0
        ) {
            loadTheLookupData({
                m: m,
                a: lookupDataPoints[m.owner][m.listGuid].response
            });
        } else {
            spCommon.spCommon.ajax({
                source: m.parentObject.source,
                method: 'GET',
                url: m.parentObject.path + "/_api/web/lists(guid'" + m.listGuid + "')/items",
                done: function (a: any) {

                    if (lookupDataPoints[m.parentObject.owner] == undefined) {
                        lookupDataPoints[m.parentObject.owner] = {
                            lists: []
                        };
                    }

                    lookupDataPoints[m.parentObject.owner].lastupdate = Date.now();

                    var override;

                    if (m.parentObject && m.parentObject.relationships) {
                        override = _.find(m.parentObject.relationships, function (o) {
                            return o.child == m.object.Title;
                        });
                    }

                    var Title = override ? override.lookupField : m.object.Title;

                    if (lookupDataPoints[m.parentObject.owner] != undefined && lookupDataPoints[m.parentObject.owner][m.listGuid] == undefined) {
                        lookupDataPoints[m.parentObject.owner][m.listGuid] = {
                            list: m.listGuid,
                            response: a,
                            owner: Title,
                            parentForm: m.parentObject.owner
                        };
                    }

                    if (_.filter(lookupDataPoints[m.parentObject.owner].lists, function (o) {
                        return o == m.listGuid;
                    }).length == 0) {
                        lookupDataPoints[m.parentObject.owner].lists.push({
                            guid: m.listGuid,
                            owner: Title,
                            parentForm: m.parentObject.owner
                        });
                    }

                    loadTheLookupData({
                        m: m,
                        a: a
                    });
                }
            });
        }
    }

    var showFiles = function (sfm: any) {
        sfm.create = false;
        sfm.view = false;
        sfm.edit = false;
        sfm.officeLinks = false;
        if (sfm.parentObject) {
            sfm.owner = sfm.parentObject.source;

            switch (sfm.parentObject.action) {
                case "create":
                    sfm.create = true;
                    break;
                case "view":
                    sfm.view = true;
                    sfm.officeLinks = true;
                    break;
                case "edit":
                    sfm.edit = true;
                    sfm.officeLinks = true;
                    break;
            }
        }
        var newFileArray = [];
        for (var i = 0; i < sfm.files.length; i++) {
            if (sfm.files[i].size == undefined) {
                sfm.files[i].extension = spCommon.spCommon.getFileExtension(sfm.files[i].FileName, false);
                sfm.files[i].exactURL = window.location.origin + sfm.files[i].ServerRelativeUrl;
            }

            var thisTempFileObject = {};
            for (var ii in sfm.files[i]) {
                thisTempFileObject[ii] = sfm.files[i][ii];
            }
            thisTempFileObject[ii] = typeof sfm.files[i].ServerRelativeUrl == "boolean" ? sfm.files[i].ServerRelativeUrl : false;
            newFileArray.push(thisTempFileObject);
        }

        sfm.files = newFileArray;

        $('[data-filecontainer=' + sfm.box + '] .box__inventory').html(spEnv.$pa.env.fileInventory(sfm));

        $('.box__inventory tbody tr .Remove-File').unbind('click', removeFile);
        $('.box__inventory tbody tr .Remove-File').bind('click', removeFile);

        //var thisValue = m.files.length > 1 ? ($input.attr('data-multiple-caption') || '').replace( '{count}', m.files.length ) : m.files[0].name;
        //$label.text(thisValue);
    };

    function fileLoader(m: any) {
        var validation = m.validation == undefined ? {} : m.validation;
        var allowedExtensions = validation.allowedExtensions == undefined ? [] : validation.allowedExtensions;
        var sizeLimit = validation.sizeLimit == undefined ? -1 : validation.sizeLimit;

        var $form = $(m.thisObject);

        if (isAdvancedUpload) {
            $form.addClass('has_advanced_upload');
        }

        var $input = $form.find('input[type="file"]');
        var $label = $form.find('label');

        var checkExtension = function (m: any) {
            if (m.allowedExtensions.length > 0) {
                var thisExtension = spCommon.spCommon.getExtension(m.file.name);

                var addFile = m.allowedExtensions.indexOf(thisExtension.toLowerCase()) > -1;

                if (!addFile) {
                    toastr.error('File ' + m.file.name + ' not added to queue.', ' File extension ' + thisExtension + ' not allowed');
                }

                return addFile;
            } else {
                return true;
            }
        };

        var checkFileSize = function (m: any) {
            if (!isNaN(m.sizeLimit) && m.sizeLimit > -1) {
                var thisFileSize = m.file.size;

                var addFile = m.sizeLimit >= thisFileSize;

                if (!addFile) {
                    toastr.error('File ' + m.file.name + ' not added to queue.', ' File size too large and not allowed');
                }

                return addFile;
            } else {
                return true;
            }
        };

        if (isAdvancedUpload) {

            $form.on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
                e.preventDefault();
                e.stopPropagation();
            }).on('dragover dragenter', function () {
                $form.addClass('is_dragover');
            }).on('dragleave dragend drop', function () {
                $form.removeClass('is_dragover');
            }).on('drop', function (e) {
                if (e.originalEvent.dataTransfer.files) {
                    if ($(this).find('input').prop('multiple') == false) {
                        $(this).find('input').data('files', []);
                    }

                    var droppedFiles = $(this).find('input').data('files') == undefined ? [] : $(this).find('input').data('files');

                    for (var thisFile = 0; thisFile < e.originalEvent.dataTransfer.files.length; thisFile++) {
                        if (checkExtension({
                            allowedExtensions: allowedExtensions,
                            file: e.originalEvent.dataTransfer.files[thisFile]
                        }) &&
                            checkFileSize({
                                sizeLimit: sizeLimit,
                                file: e.originalEvent.dataTransfer.files[thisFile]
                            })
                        ) {
                            droppedFiles.push(e.originalEvent.dataTransfer.files[thisFile]);
                        }
                    }

                    $(this).find('input').data('files', droppedFiles);

                    showFiles({
                        box: $(this).prop('id'),
                        files: droppedFiles
                    });
                }
            });
        }

        var fileObjectChanged = function (e: any) {
            if (e.target.files) {
                if ($(e.currentTarget).prop('multiple') == false) {
                    $(this).data('files', []);
                }

                var droppedFiles = $(this).data('files') == undefined ? [] : $(this).data('files');

                for (var thisFile = 0; thisFile < e.target.files.length; thisFile++) {
                    if (checkExtension({
                        allowedExtensions: allowedExtensions,
                        file: e.target.files[thisFile]
                    }) &&
                        checkFileSize({
                            sizeLimit: sizeLimit,
                            file: e.target.files[thisFile]
                        })
                    ) {
                        droppedFiles.push(e.target.files[thisFile]);
                    }
                }

                $(this).data('files', droppedFiles);

                showFiles({
                    box: $(this).parents('.box').prop('id'),
                    files: droppedFiles
                });
            }
        };

        //$form.each(function(i, element){ 
        //	$('#' + $form[i].id ).find('input[type="file"]') .on('change', fileObjectChanged)
        //})

        $input.on('change', fileObjectChanged);
    }

    function loadTabStructure(m: any) {

        if ($('.spa-app-items li').length == 0) {
            thisApp.objects[m.source.toLowerCase()].active = true;
        }

        $('.spa-app-items').append(spEnv.$pa.env.thisNavLiTemplate(thisApp.objects[m.source.toLowerCase()]));

        var tabContent = spEnv.$pa.env.thisNavDivTemplate(thisApp.objects[m.source.toLowerCase()]);

        //Plug here
        $('#sp-app-contents').append(tabContent);

        var thisDefaultLink = "javascript:void(0)";
        var actionItems = spEnv.$pa.env.anchorList({
            actions: [{
                href: thisDefaultLink,
                id: 'create-item-' + m.source.toLowerCase(),
                title: 'Create',
                i: '<i class="fa fa-plus"></i>',
                attributes: 'data-action="create" data-owner="' + m.source + '"',
                classes: 'launch-action'
            },
            {
                href: thisDefaultLink,
                id: 'view-item-' + m.source.toLowerCase(),
                title: 'View',
                i: '<i class="fa fa-file-text-o"></i>',
                attributes: 'data-action="view" data-owner="' + m.source + '"',
                classes: 'launch-action'
            },
            {
                href: thisDefaultLink,
                id: 'edit-item-' + m.source.toLowerCase(),
                title: 'Edit',
                i: '<i class="fa fa-edit"></i>',
                attributes: 'data-action="edit" data-owner="' + m.source + '"',
                classes: 'launch-action'
            },
            {
                href: thisDefaultLink,
                id: 'delete-item-' + m.source.toLowerCase(),
                title: 'Delete',
                i: '<i class="fa fa-trash"></i>',
                attributes: 'data-action="delete" data-owner="' + m.source + '"',
                classes: 'launch-action'
            }
            ]
        });

        var miscItems = spEnv.$pa.env.anchorList({
            actions: [{
                href: thisDefaultLink,
                id: 'config-item-' + m.source.toLowerCase(),
                title: 'Edit Lookup Values',
                i: '<i class="fa fa-cog"></i>',
                attributes: 'data-action="config-lookups" data-owner="' + m.source + '"',
                classes: 'launch-config'
            },]
        });

        var TabsActions = spEnv.$pa.env.tabTemplate({
            name: m.source.toLowerCase(),
            tabs: [{
                active: true,
                div_id: 'action-tab-div-' + m.source.toLowerCase(),
                li_id: 'action-tab-li-' + m.source.toLowerCase(),
                li_title: 'Actions',
                htmlContent: actionItems
            },
            {
                active: false,
                div_id: 'filters-tab-div-' + m.source.toLowerCase(),
                li_id: 'filters-tab-li-' + m.source.toLowerCase(),
                li_title: 'Filters'
            },
            {
                active: false,
                div_id: 'misc-tab-div-' + m.source.toLowerCase(),
                li_id: 'misc-tab-li-' + m.source.toLowerCase(),
                li_title: 'Misc',
                htmlContent: miscItems
            }
            ]
        });

        $('#spActions-wrap-' + m.source.toLowerCase()).html(TabsActions);

        function datatableLink(e: any) {
            var linkData = $(this).data();

            setTimeout(function () {
                if (spEnv.tables[linkData.owner] && spEnv.tables[linkData.owner].ajax) {
                    spEnv.tables[linkData.owner].ajax.reload();
                }
            }, 300);
        }

        $('.nav-link.datatable-link[data-owner="' + m.source + '"]').unbind('click', datatableLink);
        $('.nav-link.datatable-link[data-owner="' + m.source + '"]').bind('click', datatableLink);

        function gridLink(e: any) {
            var linkData = $(this).data();
            spLoader.theLoader.show({
                id: "load-grid "
            });
            if ($('#lf-grid-' + linkData.owner + ' .iframeContainer iframe').length == 0) {
                var pathRoute = thisApp.objects[m.source.toLowerCase()].baseTemplate == '101' ? "/" + linkData.owner + "/Forms" : "/" + "Lists" + "/" + linkData.owner;

                var thisListPath = thisApp.objects[m.source.toLowerCase()].path + pathRoute + "/" + linkData.owner + "PrimaryView.aspx";
                $('#lf-grid-' + linkData.owner + ' .iframeContainer').append('<iframe id="lf-iframe-{{name}}" src="' + thisListPath + '" width="600" height="650" frameborder="0" style="border:0; border: 0px; width: 100%; min-width: 1500px; height: 600px;" allowfullscreen></iframe>');
            }

            setTimeout(function () {
                var width = $("iframe:visible").parents('.tab-pane').width();
                $("iframe:visible").width(width);
                spLoader.theLoader.hide({
                    id: "load-grid "
                });
            }, 1000);

        }

        $('.nav-link.grid-link[data-owner="' + m.source + '"]').unbind('click', gridLink);
        $('.nav-link.grid-link[data-owner="' + m.source + '"]').bind('click', gridLink);

        function reloadChildren() {
            var linkData = $(this).data();

            setTimeout(function () {
                var activeChild = $('.nav-link.datatable-link[data-owner="' + linkData.owner + '"].active');
                if ($(activeChild).is(':visible')) {
                    $(activeChild).trigger('click');
                }
            }, 300);
        }

        $('.spa-app-items .nav-link[data-owner="' + m.source + '"]').unbind('click', reloadChildren);
        $('.spa-app-items .nav-link[data-owner="' + m.source + '"]').bind('click', reloadChildren);
    }

    function loadCRUD(m: any) {
        //Goes Here
        //loadTabStructure(m)

        var baseTemplate = '100';

        if (thisApp.objects[m.source.toLowerCase()].d && thisApp.objects[m.source.toLowerCase()].d.results && thisApp.objects[m.source.toLowerCase()].d.results.length > 0) {
            if (_.find(thisApp.objects[m.source.toLowerCase()].d.results, {
                EntityPropertyName: "FileLeafRef"
            })) {
                thisApp.objects[m.source.toLowerCase()].type = "Document Library";
                thisApp.objects[m.source.toLowerCase()].d.results[0].multiple = false;
                baseTemplate = '101';
            } else {
                thisApp.objects[m.source.toLowerCase()].type = "List";
            }
        }

        $('#spTable-wrap-' + m.source.toLowerCase()).html(spEnv.$pa.env.spTableTemplate(m.meta));
        $('#lf-tree-' + m.source.toLowerCase()).html(spEnv.$pa.env.spJsTreeTemplate(m.meta));

        thisApp.objects[m.source.toLowerCase()].baseTemplate = baseTemplate;
        $('#nav-tab-' + m.source.toLowerCase()).data(thisApp.objects[m.source.toLowerCase()]);

        $('#tree_size_' + m.source.toLowerCase()).bind("loaded.jstree", function (event, data) {
            data.instance.open_all();
        });

        $('#tree_size_' + m.source.toLowerCase()).jstree();

        spQuery.spQuery.genTable({
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
        $('#misc-tab-div-' + m.source.toLowerCase() + ' .launch-config').unbind('click', loadConfigsLists);
        $('#misc-tab-div-' + m.source.toLowerCase() + ' .launch-config').bind('click', loadConfigsLists);
    }

    function updateLookupLists(m: any) {
        var LookupColumns = _.filter(m.data, function (o) {
            return o.TypeAsString == "Lookup";
        });

        var findLookup = function (o: any) {
            return o.InternalName == thisLookup.InternalName;
        };

        if (LookupColumns) {
            for (var lc = 0; lc < LookupColumns.length; lc++) {
                var thisLookup = LookupColumns[lc];

                var foundLookup = _.find(m.data, findLookup);

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
    }

    var markHiddenObjects = function (childObject: any) {

        if (childObject && childObject.columns && (childObject.columns.hidden || childObject.columns.readOnly) && childObject.d) {
            childObject.d.results = _.filter(childObject.d.results, function (o) {

                if (childObject.columns.hidden) {
                    var markHidden = childObject.columns.hidden.indexOf(o.StaticName) > -1;
                    if (markHidden) {
                        o.hidden = true;
                    }
                }

                if (childObject.columns.readOnly) {
                    var markReadOnly = childObject.columns.readOnly.indexOf(o.StaticName) > -1;
                    if (markReadOnly) {
                        o.readOnly = true;
                    }
                }

                return true;
            });
        }

        return childObject;
    };

    function initModalContent(m: any) {
        var crudModal = "";

        var thisParentObject = thisApp.objects[m.source.toLowerCase()];
        var thisCurrentObject = thisApp.objects[m.source].d.results;

        addUiGuidsToItem(thisCurrentObject);

        updateLookupLists({ data: thisCurrentObject, source: m.source });

        var hasChild = false;

        var childObject;
        var childObjectRoot;
        var modalSelector = "#modal-" + m.action + '-' + m.source;

        

        thisParentObject.formType = m.action;
        var mainFormContent;
        if (m.action != "delete") {
            thisParentObject = markHiddenObjects(thisParentObject);
            mainFormContent = spEnv.$pa.env.baseForm(thisParentObject);

            var actionsForChildren = ["edit", "view"];

            if (Array.isArray(thisParentObject.children)) {
                if (actionsForChildren.indexOf(m.action) > -1) {


                    var updateChildResultsMethod = function (o) {
                        if (o.StaticName == "Attachments") {
                            o.hidden = true;
                        }

                        if (currentChild.d && currentChild.d.results) {
                            addUiGuidsToItem(currentChild.d.results);
                            updateLookupLists({ data: currentChild.d.results, source: currentChild.source });
                        }

                        reloadLookupData(currentChild);

                        return true;
                    };

                    for (var index = 0; index < thisParentObject.children.length; index++) {
                        var currentChild = thisParentObject.children[index];

                        if (currentChild) {
                            hasChild = true;
                            childObject = currentChild;

                            if (hasChild) {
                                if (childObject.html == undefined) {
                                                                        
                                    childObject.loadActionButtons = false;

                                    childObject.d = typeof childObject.d == "object" ? childObject.d : {};
                                    childObject.d.results = _.filter(childObject.d.results, updateChildResultsMethod);

                                    childObject = markHiddenObjects(childObject);
                                }
                                else {
                                    childObject.html = undefined;
                                }
                            }
                        }
                    }
                    mainFormContent += spEnv.$pa.env.spaAccordion(m);
                }
            }

            crudModal += spEnv.$pa.env.baseModal({
                id: m.action + '-' + m.source,
                owner: m.source,
                action: m.action,
                title: m.action.capitalize() + ' ' + m.singular,
                minWidth: "65%",
                content: mainFormContent
            });

        } else {
            mainFormContent = spEnv.$pa.env.deleteItem(thisParentObject);

            crudModal += spEnv.$pa.env.baseModal({
                id: m.action + '-' + m.source,
                owner: m.source,
                action: m.action,
                title: m.action.capitalize() + ' ' + m.singular,
                content: mainFormContent
            });
        }

        $('body').append(crudModal);               

        

        $(modalSelector).on("click", ".move-child-up", function () {
            var thisLi = $(this).parents('li');

            $(thisLi).moveUp();
        });

        $(modalSelector).on("click", ".move-child-down", function () {
            var thisLi = $(this).parents('li');
            $(thisLi).moveDown();
        });

        var deleteObject = function (m: any) {

            var thisItem = $(this);
            var thisItemData = $(thisItem).data();
            var parentObject = _.find(theseLists, function (o) { return o.source == thisItemData.source; });
            var thisLI = $(this).parents('li.li-child-form');    
            var thisForm = $(thisLI).find('.form-container');  
            var thisFormID = $(thisForm).find('input[data-name="ID"]');
            var hasValue = $(thisFormID).val() ? true : false;                                   
            
            spPrompt.promptDialog.prompt({
                promptID: 'Delete-Object',
                body: 'Are you sure you want to delete this item?',
                header: 'Delete Item',
                closeOnEscape: true,
                open: function (event, ui) {
                    //toastr.success('Data has been successfully submitted.', 'Form Submitted!');
                },
                buttons: [{
                    text: "Cancel",
                    active: false,
                    close: true,
                    click: function () {
    
                    }
                },
                {
                    text: "Delete",
                    active: true,
                    close: true,
                    click: function () {
                        if(hasValue)
                        {
                            var thisFormRequest = {
                                formObjects : {
                                    ID : $(thisFormID).val()
                                },
                                caller : thisLI,
                                action : "delete",
                                source : thisItemData.source,
                                callerType : "child"
                            };   

                            saveForm(thisFormRequest);
                        }
                        else
                        {
                            $(thisLI).remove();
                        }
                        //$(this).parents('.modal').modal('close');
                        //$($(this).parents('.modal')).modal('hide');
                        //deleteItemAttachment(thisObjectData);
    
                    }
                }
                ]
            });
        };

        $(modalSelector).on('click', '[name="DeleteChildEntry"]', deleteObject);

        if (hasChild) {

            var triggerloadChildRow = function (e: any) {
                var m = $(this).data();
                m.fromButton = "add";
                loadChildRow(m);
            };

            for (var index2 = 0; index2 < thisParentObject.children.length; index2++) {
                var currentChild2 = thisParentObject.children[index2];
                $('.add-child[data-ownersource="' + currentChild2.source + '"]').unbind('click', triggerloadChildRow);
                $('.add-child[data-ownersource="' + currentChild2.source + '"]').bind('click', triggerloadChildRow);
            }
        }

        var fillinObjects = _.filter(spCRUD.data().objects[m.source].d.results, {
            FillInChoice: true
        });

        if (fillinObjects) {
            //@ts-ignore
            var tempObject = _.cloneDeep(spCRUD.data().objects[m.source], true);
            tempObject.d.results = fillinObjects; //fillinObjects.length > 0 ? fillinObjects : tempObject.d.results;

            for (var fi = 0; fi < fillinObjects.length; fi++) {
                $('body').append(spEnv.$pa.env.fillinModal(tempObject));
            }
        }

        function updateChild() {
            var LookupData = $(this).data();
            var currentValue = $(this).val();

            var thisLookupContainer = spCRUD.lookupDataPoints()[LookupData.owner].lists;

            var childDropDown = _.find(thisLookupContainer, {
                owner: LookupData.child
            });

            if (childDropDown) {
                var theChildList = spCRUD.lookupDataPoints()[LookupData.owner][childDropDown.guid];

                if (theChildList && theChildList.response && theChildList.response.d && theChildList.response.d.results) {
                    var thisData = theChildList.response.d.results;

                    var matchedOptions = _.filter(thisData, function (o) {
                        return o[LookupData.name] == currentValue;
                    });

                    for (var thisLookupData = 0; thisLookupData < matchedOptions.length; thisLookupData++) {
                        var usethisColumn = LookupData.lookupfield.length == 0 ? childDropDown.owner : LookupData.lookupfield;

                        //var usedLookupColumns = _.get(matchedOptions[thisLookupData], usethisColumn) == undefined ? "Title" : usethisColumn;
                        var usedLookupColumn = decideWhichLookupColumn({ data: matchedOptions[thisLookupData], column: usethisColumn });

                        matchedOptions[thisLookupData].lookupText = matchedOptions[thisLookupData][usedLookupColumn];
                    }
                    LookupData.results = matchedOptions;
                    var optionsHtml = spEnv.$pa.env.spDropDownOptions({
                        Title: LookupData.selectname,
                        LookupData: LookupData
                    });

                    $('[name="' + LookupData.owner + '.' + LookupData.child + '"]').html(optionsHtml);
                    $('[name="' + LookupData.owner + '.' + LookupData.child + '"]').trigger('change');
                }
            }
        }

        loadFormDataForSelectRow(m);

        var thisMo = m.action;
        $('#modal-' + thisMo + '-' + m.source + ' .form-container button').prependTo('#modal-' + thisMo + '-' + m.source + ' .modal-footer');

        fileLoader({
            thisObject: '.' + m.source.toLowerCase() + '-attachments',
            validation: {
                allowedExtensions: ["jpeg", "jpg", "gif", "png", "docx", "pdf", "xlsx", "txt", "xls", "ppt", "pptx", "doc", "zip", "7z", "psd"],
                sizeLimit: 1024 * 1024 * 1024 * 2, // 50 kB = 50 * 1024 bytes,
                multiple: thisApp.objects[m.source.toLowerCase()].type == "Document Library" ? false : true
            }
        });

        $('.btn.save-data').unbind('click', saveModalForm);
        $('.btn.save-data').bind('click', saveModalForm);
        $('.btn.clear-data').unbind('click', spCRUD.clearData);
        $('.btn.clear-data').bind('click', spCRUD.clearData);
        $('.btn.delete-data').unbind('click', saveModalForm);
        $('.btn.delete-data').bind('click', saveModalForm);
        $('.sp-fill-in').unbind('click', spCRUD.loadFillinModal);
        $('.sp-fill-in').bind('click', spCRUD.loadFillinModal);

        if (m.relationships && m.relationships.length > 0) {
            for (var rel = 0; rel < m.relationships.length; rel++) {
                var thisRelationship = m.relationships[rel];

                $('#modal-' + thisMo + '-' + m.source + ' [name="' + m.source + '.' + thisRelationship.parent + '"]').unbind('change', updateChild);
                $('#modal-' + thisMo + '-' + m.source + ' [name="' + m.source + '.' + thisRelationship.parent + '"]').bind('change', updateChild);
            }
        }

        initFormObject(m);

        disableReadOnlyFields({ selector : modalSelector });
    }

    var disableReadOnlyFields = function(m: any)
    {
        $(m.selector).find('[data-readonly="true"]').prop('readonly', true).prop('disabled', true).addClass('no-select object-disabled');
    }

    var addChildRow = function (a: any) {

        var html = spEnv.$pa.env.baseForm(a);

        return html;
    };

    var loadChildRow = function (e: any) {

        var myChildren = [];
        if (Array.isArray(e)) {
            myChildren = e;
        }
        else {
            myChildren.push(e);
        }

        if (myChildren.length > 0) {

            var htmlLiString = "";
            for (var index = 0; index < myChildren.length; index++) {
                var m = myChildren[index];

                var thisParentObject = thisApp.objects[m.source];

                var currentChild = _.find(thisParentObject.children, { name: m.ownersource });
               
                if (e.fromButton == "add") {
                    currentChild.formType = "create";
                }
                else {
                    currentChild.formType = "edit";
                }

                if (currentChild) {
                    currentChild.formType = thisParentObject.formType;
                    currentChild.action = thisParentObject.formType;
                    if (currentChild.d && currentChild.d.results) {
                        addUiGuidsToItem(currentChild.d.results);
                    }

                    var thisChildParentRef = _.find(currentChild.d.results, { EntityPropertyName: thisParentObject.thisVar });

                    if (thisChildParentRef && thisParentObject.lastSelectedRecord && thisParentObject.lastSelectedRecord.d) {
                        thisChildParentRef.currentParentID = thisParentObject.lastSelectedRecord.d.ID;
                    }

                    if (m.fromButton == "add") {
                        currentChild.formType = "create";
                    }

                    currentChild.html = addChildRow(currentChild);
                    var rowContent = spEnv.$pa.env.spaChildFormRow(currentChild);

                    htmlLiString += rowContent;
                }
            }

            var firstChild = _.find(myChildren, {});

            $('#' + firstChild.container + ' ul').append(htmlLiString);

            thisApp.objects[firstChild.source].action = firstChild.action;

            initFormObject(thisApp.objects[firstChild.source]);
            disableReadOnlyFields({ selector : '#' + firstChild.container + ' ul' });

            var allForms = $('#' + firstChild.container + ' ul li .form-container');

            if ($(allForms).length == myChildren.length) {
                $(allForms).each(function (formIndex, formElement) {

                    var thisParentObject = thisApp.objects[myChildren[formIndex].source];

                    var currentChild = _.find(thisParentObject.children, { name: myChildren[formIndex].ownersource });


                    if (e[formIndex] && e[formIndex].rowData) {
                        var latestEntryContainer = $(formElement);

                        currentChild.dataPresent = true;
                        currentChild.formSelector = latestEntryContainer;
                        currentChild.actionData = e[formIndex].rowData;
                        currentChild.disableClear = true;
                        loadDataToDom(currentChild, e[formIndex].rowData);
                        //loadFormData(currentChild);

                    }
                });
            }
        }       
    };

    function initFormObject(m: any) {
        initPeoplePickers();

        $('.sp-calendar').datepicker();

        $('#modal-' + m.action + '-' + m.source).find('.select2-js, .sp-lookup').select2({
            dropdownParent: $('#modal-' + m.action + '-' + m.source),
            width: '100%'
        });

        $('#modal-' + m.action + '-' + m.source + ' [data-toggle="popover"]').popover();
    }

    function modalLoader(m: any) {
        var action = m.action;
        var owner = m.owner.toLowerCase();

        var thisCaller = _.filter(theseLists, function (r) {
            return r.name.toLowerCase() == owner;
        });

        if (thisCaller) {
            $('.modal[data-owner="' + owner + '"] .people-picker').each(function (i, element) {
                var thisID = $(element).prop('id');

                delete SPClientPeoplePicker.SPClientPeoplePickerDict[thisID + "_TopSpan"];
            });

            $('.modal[data-owner="' + owner + '"]').remove();
            $('.fillin-modal').remove();

            thisCaller[0].action = action;
            thisCaller[0].owner = owner;
            if (typeof m.dataPresent == "boolean" && m.dataPresent) {
                thisCaller[0].dataPresent = m.dataPresent;
                thisCaller[0].actionData = m.actionData;
            } else {
                thisCaller[0].dataPresent = false;
            }
            reloadLookupData(thisCaller[0]);
            initModalContent(thisCaller[0]);
        }
    }

    function modalBinds() {
        var thisData = $(this).data();
        clearLastSave();
        modalLoader(thisData);
    }

    function reloadEditForm() {
        var foundRow = [];

        if (spCRUD.data().lastSave.action.action == "save" && spCRUD.data().lastSave.action.loaded == false) {
            var allAvailableData = spEnv.mGlobal.page[spCRUD.data().lastSave.owner].currentJsonData.fullData;

            if (spCRUD.data().lastSave.templateType == "100") {
                foundRow = _.filter(allAvailableData, function (f) {
                    return f.ID == spCRUD.data().lastSave.mainSaveData.ID;
                });
            } else if (spCRUD.data().lastSave.templateType == "101") {
                foundRow = _.filter(allAvailableData, function (f) {
                    return f.FileLeafRef == spCRUD.data().lastSave.mainSaveData.Name;
                });
            }
        }

        var thisData = {
            owner: spCRUD.data().lastSave.owner,
            action: "edit",
            dataPresent : true,
            actionData : undefined
        };

        if (foundRow.length > 0) {
            thisData.dataPresent = true;
            thisData.actionData = foundRow[0];
        }
        modalLoader(thisData);
    }

    function loadFormDataForSelectRow(m: any) {
        m.formSelector = $('#form-' + m.action + '-' + m.owner + '');
        m.selectedRow = $('#' + m.owner + ' tbody tr.selected').index();

        if (m.dataPresent == false) {

            if (!isNaN(m.selectedRow) && m.selectedRow > -1) {
                m.actionData = m.selectedRow > -1 ? spEnv.tables[m.owner].ajax.json().data[m.selectedRow] : m.actionData;
                m.dataPresent = true;
            }

            if (m.action != 'create' && (m.selectedRow == -1)) {
                toastr.error('Please select a row to ' + m.action + '.', 'No row selected!');
                return -1;
            }
        }

        loadFormData(m);
    }

    function hideLoaderShowModal(m: any) {
        spLoader.theLoader.hide({
            id: m.owner + '-item-load'
        });
        $('#modal-' + m.action + '-' + m.owner + '').modal('show');
    }

    function getQueryForObject(s: any) {
        var actionURL = "";

        var itemQueryStruct = {
            tableName: s.owner,
            tableID: s.owner,
            tableSelector: '#' + s.owner,
            tableStructure: s,
            templateType: s.baseTemplate,
            queryFilter: s.queryFilter,
            itemCall: false
        };

        if (s.baseTemplate == '101') {
            //actionURL += '?$select=Title,ID,EncodedAbsUrl,*'
            itemQueryStruct.itemCall = true;
        }

        actionURL += "?" + spQuery.spQuery.getItemQuery(itemQueryStruct);
        return actionURL;
    }

    function loadDataToDom(m: any, returnedData: any) {
        var actionData = m.actionData ? m.actionData : {};

        if (m.baseTemplate == '101') {
            returnedData.FileLeafRef = actionData.FileLeafRef;
        }

        var parentLi = $(m.formSelector).parents('li.li-child-form');

        if (m.metaDataVisible && parentLi) {
            var modifiedDateSelector = $(parentLi).find('[name="modifiedDate"]');
            var modifiedBySelector = $(parentLi).find('[name="modifiedBy"]');

            if (modifiedDateSelector && returnedData.Modified) {
                $(modifiedDateSelector).html(moment(returnedData.Modified).format('MM/DD/YYYY hh:mm a'));
            }

            if (modifiedBySelector && returnedData.Editor && returnedData.Editor.Title) {
                $(modifiedBySelector).html(returnedData.Editor.Title);
            }
        }

        $(m.formSelector).find('input, select, textarea, .people-picker-data').each(function (dIndex, dElement) {
            if ($(dElement).data('name')) {
                if (!$(dElement).hasClass('people-picker-data')) {
                    switch ($(dElement).getType()) {
                        case 'select':

                            if ($(dElement).prop('multiple')) {
                                var thisSelectData = returnedData[$(dElement).data('entity')];
                                if (thisSelectData && thisSelectData.results) {
                                    $(dElement).val(thisSelectData.results);
                                }
                            } else {
                                var theData = $(dElement).data();
                                var whichWay = theData.selectname ? theData.selectname : theData.name;
                                if ($(dElement).hasClass('sp-lookup')) {
                                    var thisSelectData1 = returnedData[$(dElement).data('selectname')];
                                    if (thisSelectData1) {
                                        $(dElement).val(thisSelectData1.Id);
                                    }
                                } else {
                                    //Choice
                                    var thisSelectData2 = returnedData[$(dElement).data('entity')];

                                    var tempChoiceVal = $(dElement).find('[value="' + thisSelectData2 + '"]');

                                    if (tempChoiceVal.length > 0) {
                                        $(dElement).val(thisSelectData2);
                                    } else {

                                        addValue2Select({
                                            value: {
                                                id: thisSelectData2,
                                                text: thisSelectData2
                                            },
                                            selector: $(dElement)
                                        });
                                    }
                                }
                            }

                            break;
                        case 'radio':
                            var thisRadioData = $(dElement).parents('.sp-radio-wrapper').data();
                            var thisRadioValue = returnedData[$(dElement).data('entity')];
                            if ($(dElement).val() == thisRadioValue) {
                                $(dElement).prop('checked', true);
                            }

                            if ($(dElement).parents('.sp-radio-wrapper').find('input[value="' + thisRadioValue + '"]') && $('#' + thisRadioData.uuid + ' input').is(':checked') == false) {
                                thisRadioData.value = {
                                    id: thisRadioValue,
                                    text: thisRadioValue
                                };
                                thisRadioData.selector = '#' + thisRadioData.uuid;
                                addValue2Radio(thisRadioData);
                            }
                            break;
                        case 'checkbox':
                            var thisCheck = returnedData[$(dElement).data('entity')];

                            if (thisCheck) {
                                $(dElement).prop('checked', true);
                            } else {
                                $(dElement).prop('checked', false);
                            }

                            break;
                        default:
                            if ($(dElement).hasClass('sp-calendar')) {
                                var calendarDate = returnedData[$(dElement).data('entity')];

                                if (calendarDate) {
                                    calendarDate = moment(calendarDate).format('MM/DD/YYYY');
                                }
                                $(dElement).val(calendarDate);
                            } else if ($(dElement).data('entity') == "Attachments" || $(dElement).data('entity') == "FileLeafRef") {
                                var attachValue = returnedData[$(dElement).data('entity')];

                                if (attachValue == false) {
                                    $(dElement).val('');
                                } else {
                                    $(dElement).val('');
                                }
                            } else {
                                $(dElement).val(returnedData[$(dElement).data('entity')]);
                            }
                            break;
                    }
                } else {
                    $(dElement).data('prepopulate', returnedData[$(dElement).data('entity')]);
                }
            }
        });

        if (m.action == 'view' || m.dataEditable == false) {
            $(m.formSelector).find('input, select, textarea').prop('readonly', true).prop('disabled', true).addClass('no-select object-disabled');
        }        

        //for (var mo = 0; mo < modalTypes.length; mo++) {
        //    var thisMo = modalTypes[mo];
        $(m.formSelector).find('.select2-js, .sp-lookup').select2({
            dropdownParent: $(m.formSelector),
            width: '100%'
        });
        //}

        //initPeoplePickers();
        //Loads any people selectors
        loadPickersWithData({
            disableClear: m.disableClear,
            objectParent: $(m.formSelector)
        });
    }

    function loadFormData(m: spaLoadListStruct) {
        var action = m.action;
        var owner = m.owner;

        var selectedRow = m.selectedRow;

        var actionURL = "";
        var actionData = m.actionData ? m.actionData : {};
        var itemURL = "";

        spLoader.theLoader.show({
            id: owner + '-item-load'
        });

        currentRecord = undefined;

        switch (action) {
            case 'view':
            case 'edit':

                itemURL = actionData['odata.editLink'] ? actionData['odata.editLink'] : "/web/lists(guid'" + m.id + "')/items";

                actionURL = actionData['odata.editLink'] ? actionData['odata.editLink'] : "/web/lists(guid'" + m.id + "')/items";

                actionURL += getQueryForObject(m);

                var getDataForType = ['view', 'edit'];

                var getServerDataDone = function (a) {
                    var returnedData = a.d;
                    currentRecord = returnedData;

                    m.lastSelectedRecord = a;

                    loadDataToDom(m, returnedData);
                    
                    if (m.baseTemplate != '101') {
                        var attachments = [];
                        if (returnedData.AttachmentFiles && returnedData.AttachmentFiles.results) {
                            attachments = returnedData.AttachmentFiles.results;
                        }

                        //								var thisFile = [{ FileName : returnedData.FileLeafRef }]
                        showFiles({
                            box: action + '-' + owner + '-' + 'attachments',
                            itemURL: itemURL,
                            files: attachments,
                            parentObject: m
                        });
                        $('.Delete-Attachment-File').unbind('click', deleteItemAttachmentPrompt);
                        $('.Delete-Attachment-File').bind('click', deleteItemAttachmentPrompt);
                    } else {
                        var relativeFilePath = spCommon.spCommon.getRelativeURL({
                            url: returnedData.EncodedAbsUrl
                        });
                        var attachments2 = [{
                            FileName: returnedData.FileLeafRef,
                            ServerRelativeUrl: relativeFilePath,
                            parentObject: m
                        }];
                        $(m.formSelector).data('FileLeafRef', relativeFilePath);
                        showFiles({
                            box: action + '-' + owner + '-' + 'attachments',
                            files: attachments2,
                            parentObject: m
                        });
                    }

                    if (m.children && Array.isArray(m.children) && m.children.length > 0) {
                        var callChildAjax = function (cm) {
                            var loadChildObject = function (a) {

                                if (a && a.d && a.d.results && Array.isArray(a.d.results)) {

                                    var childRowsQueue = [];

                                    for (var index = 0; index < a.d.results.length; index++) {
                                        var thisObjectEntry = a.d.results[index];

                                        var thisChildParentRef = _.find(thisObjectEntry, { EntityPropertyName: m.thisVar });

                                        //Load Parent ID into Child Record
                                        if (typeof thisObjectEntry[m.spType] == "object" && thisObjectEntry[m.spType].Id) {
                                            thisObjectEntry[m.spType + "Id"] = thisObjectEntry[m.spType].Id;
                                        }

                                        childRowsQueue.push({
                                            ownersource: cm.thisChild.source,
                                            source: cm.m.source,
                                            action: action,
                                            sptype: cm.m.spType,
                                            owner: "",
                                            container: "child-card-body-" + cm.thisChild.source,
                                            rowData: thisObjectEntry
                                        });
                                    }

                                    loadChildRow(childRowsQueue);
                                }
                            };

                            spCommon.spCommon.ajax({
                                source: cm.thisChild.owner,
                                method: 'GET',
                                url: cm.url,
                                done: loadChildObject
                            });
                        };
                        
                        for (var index = 0; index < m.children.length; index++) {
                            var thisChild = m.children[index];
                            var parentID = m.lastSelectedRecord.d.ID;
                            
                            
                                                      

                            if (thisChild.condition) {
                                var ConditionHB = spCommon.spCommon.addHandlebar(thisChild.condition);

                                thisChild.queryFilter = ConditionHB({ ID: parentID });
                                var thisQuery = getQueryForObject(thisChild);
                                var thisChildPath = thisChild.path + "/_api/web/lists/getbytitle('" + thisChild.spType + "')/items";

                                callChildAjax({ m: m, url: thisChildPath + thisQuery, thisChild: thisChild });
                                //console.log(thisQuery);
                            }
                            else {
                                getQueryForObject(thisChild);

                            }

                            if(thisChild.repeatable.overloads && Array.isArray(thisChild.repeatable.overloads) && thisChild.repeatable.overloads.length > 0)
                            {
                                for (let index = 0; index < thisChild.repeatable.overloads.length; index++) {
                                    const element = thisChild.repeatable.overloads[index];
                                    
                                    if(typeof element.bind == "function")
                                    {
                                        element.bind();
                                    }
    
                                } 
                            }
                        }
                    }

                    hideLoaderShowModal(m);
                };

                if (getDataForType.indexOf(action) > -1 && m.dataPresent) {
                    spCommon.spCommon.ajax({
                        source: m.owner,
                        method: 'GET',
                        url: m.path + "/_api/" + actionURL + "",
                        done: getServerDataDone
                    });
                } else {
                    hideLoaderShowModal(m);
                }
                break;
            case 'delete':

                actionURL = actionData['odata.editLink'];

                $(m.formSelector).find('[name="' + owner + '.ID"]').val(actionData.ID);

                hideLoaderShowModal(m);

                break;
            case 'create':
            default:
                hideLoaderShowModal(m);
                break;
        }
    }

    function deleteItemAttachment(dm: any) {
        var parentObject = _.find(theseLists, function (o) {
            return o.source == dm.owner;
        });

        if (parentObject.path) {
            var deleteURL = parentObject.path + "/_api/" + dm.item + "/AttachmentFiles/getByFileName('" + dm.name + "')";
            console.log(deleteURL);

            var crudRequest2 = {
                headers: deleteHeader({}),
                method: 'POST',
                source: dm.owner,
                url: deleteURL,
                data: undefined,
                done: function (a: any) {
                    $('[data-filecontainer="edit-' + dm.owner + '-attachments"] tbody tr:eq(' + dm.tableRow + ')').remove();
                    toastr.success('Attachment ' + dm.name + ' deleted!', 'Attachment Deleted!');
                    spEnv.tables[dm.owner].ajax.reload();
                },
                fail: function (a: any) {
                    toastr.error('There was an issue deleting the Attachment!', 'Attachment not deleted!');
                },
                always: function (a: any) {

                }
            };

            spCommon.spCommon.ajax(crudRequest2);
        }
    }

    function deleteItemAttachmentPrompt() {
        var thisObject = $(this);
        var tableRow = $(thisObject).parents('tr').index();
        var thisObjectData = $(thisObject).data();
        thisObjectData.tableRow = tableRow;
        spPrompt.promptDialog.prompt({
            promptID: 'Delete-Item-Attachment',
            body: 'Are you sure you want to delete this attachment?',
            header: 'Delete File',
            closeOnEscape: true,
            open: function (event, ui) {
                //toastr.success('Data has been successfully submitted.', 'Form Submitted!');
            },
            buttons: [{
                text: "Cancel",
                active: false,
                close: true,
                click: function () {

                }
            },
            {
                text: "Delete",
                active: true,
                close: true,
                click: function () {
                    //$(this).parents('.modal').modal('close');
                    $($(this).parents('.modal')).modal('hide');
                    deleteItemAttachment(thisObjectData);

                }
            }
            ]
        });
    }

    function getListStructure(m: any) {
        return {
            source: m.source,
            method: 'GET',
            url: m.path + "/_api/web/lists/getbytitle('" + m.source + "')/fields?$filter=Hidden eq false and ReadOnlyField eq false",
            done: function (a: any) {

                _.merge(thisApp.objects[m.source.toLowerCase()], a);

                globalThis.spaObjects = thisApp.objects;

                var hasBootstrapGridOverride = false;
                var bootstrapGridOverride;

                var bsGridOverrideMethod = function (thisObject: any, element: any) {
                    if (thisObject.form && thisObject.form.columns) {
                        var thisMatchedObject = _.find(thisObject.form.columns, { name: element.StaticName });

                        if (thisMatchedObject && thisMatchedObject.bootstrapGridOverride && thisMatchedObject.bootstrapGridOverride.class) {
                            bootstrapGridOverride = thisMatchedObject.bootstrapGridOverride.class;
                        }
                        hasBootstrapGridOverride = bootstrapGridOverride ? true : false;
                    }
                };

                //Extend Objects                 
                thisApp.objects[m.source.toLowerCase()].d.results = _.map(thisApp.objects[m.source.toLowerCase()].d.results, function (element) {

                    var thisObject = thisApp.objects[m.source.toLowerCase()];

                    bsGridOverrideMethod(thisObject, element);

                    return _.extend({}, element, {
                        //Mark all List Objects Hidden before Displaying if has m.meta.dtColumns
                        spLoadObject: (m.meta.dtColumns && m.meta.dtColumns.length) > 0 ? false : true,
                        hidden: false,
                        readOnly: false,
                        spObjectOrder: thisApp.objects[m.source.toLowerCase()].d.results.length,
                        bootstrapGridOverride: bootstrapGridOverride,
                        hasBootstrapGridOverride: hasBootstrapGridOverride
                    });
                });

                //Extend Objects with Injected Columns
                if (m.meta.dtColumns && m.meta.dtColumns.length > 0) {
                    if (!_.find(m.meta.dtColumns, "Attachments")) {
                        m.meta.dtColumns.push("Attachments");
                        //m.meta.dtColumns.push("Content Type");
                    }

                    var findThisObjectIntheInjectedColumns = function (o: any) {
                        return o.Title == m.meta.dtColumns[lc];
                    };

                    for (var lc = 0; lc < m.meta.dtColumns.length; lc++) {
                        var thisObject = _.find(thisApp.objects[m.source.toLowerCase()].d.results, findThisObjectIntheInjectedColumns);

                        if (thisObject) {
                            thisObject.spLoadObject = true;
                            thisObject.spObjectOrder = lc;
                        }

                        // Use Lodash to sort array by 'spObjectOrder'
                        thisApp.objects[m.source.toLowerCase()].d.results = _.orderBy(thisApp.objects[m.source.toLowerCase()].d.results, ['spObjectOrder'], ['asc']);
                    }
                }

                var findThisObjectThatsParentRelationship = function (o: any) {
                    return o.Title == thisRelationship.parent;
                };

                if (m.meta.relationships && m.meta.relationships.length > 0) {
                    for (var rel = 0; rel < m.meta.relationships.length; rel++) {
                        var thisRelationship = m.meta.relationships[rel];

                        var thisObject2 = _.find(thisApp.objects[m.source.toLowerCase()].d.results, findThisObjectThatsParentRelationship);

                        if (thisObject2) {
                            thisObject2.dropDownRelationship = thisObject2.dropDownRelationship ? thisObject2.dropDownRelationship : {};
                            thisObject2.hasDropDownRelationship = true;
                            if (thisObject2.dropDownRelationship) {
                                thisObject2.dropDownRelationship.child = thisRelationship.child;
                                thisObject2.dropDownRelationship.lookupField = thisRelationship.lookupField;
                                thisObject2.dropDownRelationship.childDD = thisRelationship.child + "Id";
                            }
                        }
                    }
                }

                loadCRUD(m);
            },
            fail: function (a: any) { },
            always: function (a: any) {

            }
        };
    }

    var getFileBuffer = function (file: any) {

        var deferred = $.Deferred();
        var reader = new FileReader();

        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        };
        reader.readAsArrayBuffer(file);
        return deferred.promise();
    };

    function clearForm(m: any) {
        m = typeof m == 'object' && m != undefined ? m : {};

        var thisData = $(m.currentTarget).data();
        var formSelector = '#' + thisData.owner;
        $(formSelector).data('FileLeafRef', '');

        var theseFormObjects = $(formSelector).find('input, select, textarea');

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

    function updateHeader(headers: any) {
        headers["IF-MATCH"] = "*"; //Overrite the changes in the sharepoint list item
        headers["X-HTTP-Method"] = "MERGE";

        return headers;
    }

    function deleteHeader(headers: any) {
        headers["IF-MATCH"] = "*"; //Overrite the changes in the sharepoint list item
        headers["X-HTTP-Method"] = "DELETE";

        return headers;
    }

    function getFormData(f: any) {
        f.formObjects = typeof f.formObjects == "object" ? f.formObjects : {};
        f.fileObjects = typeof f.fileObjects == "object" && Array.isArray(f.fileObjects) ? f.fileObjects : [];
        var formObjects = f.formObjects;
        var fileObjects = f.fileObjects;
        var theseFormObjects = $(f.formSelector).find('input, select, textarea, .people-picker');
        if (f.formSelector) {
            $(theseFormObjects).each(function (i, element) {

                var onlyAddValidObjects = $(element).parents('.sp-peoplepicker-topLevel').length == 0;

                if (onlyAddValidObjects) {
                    var thisCurrentObject = $(element).data('entity') ? $(element).data('entity').replace(/-/g, '_x002d_') : '';

                    switch ($(element).prop('type')) {
                        case "hidden":
                            if ($(element).hasClass('people-picker-data')) {
                                formObjects[thisCurrentObject] = $('.people-picker[name="' + $(element).prop('name') + '"] ').find('[id$="_TopSpan_HiddenInput"]').val();
                            }
                            else {
                                var thisHiddenData = $(element).data();

                                if (thisHiddenData.owner == f.thisObject.owner) {
                                    if (thisCurrentObject == "ID") {
                                        formObjects[thisCurrentObject] = $(element).val() ? $(element).val() : null;
                                    }
                                    else {
                                        formObjects[thisCurrentObject] = $(element).val() ? $(element).val() : "";
                                    }
                                }
                            }
                            break;
                        case "date":
                            if ($(element).val()) {
                                formObjects[thisCurrentObject] = moment($(element).val()).format();
                            }
                            break;
                        case "checkbox":
                            formObjects[thisCurrentObject] = $(element).is(":checked");
                            break;
                        case "textarea":
                        case "text":
                            if ($(element).hasClass('sp-calendar')) {
                                var thisDate:String;
                                var tempDate = $(element).val();
                                if (tempDate) {
                                    thisDate = moment(tempDate, ["MM-DD-YYYY"]).format();
                                }
                                else {
                                    thisDate = null;
                                }

                                formObjects[thisCurrentObject] = thisDate != undefined && thisDate.toLowerCase() != "invalid date" ? thisDate : null;
                            } else {
                                var thisValue = $(element).val();
                                formObjects[thisCurrentObject] = thisValue ? thisValue : null;
                            }
                            break;
                        case "radio":
                            if ($(element).prop('checked')) {
                                formObjects[thisCurrentObject] = $(element).val() ? $(element).val() : null;
                            }
                            break;
                        case "select-one":
                            formObjects[thisCurrentObject] = $(element).find('option:selected').val() ? $(element).find('option:selected').val() : null;
                            break;
                        case "select-multiple":
                            var multiValue = $(element).val();
                            var finalValue = { 
                                "__metadata": { "type": "Collection(Edm.String)" },
                                results : multiValue ? multiValue : []
                            };

                            formObjects[thisCurrentObject] = finalValue;
                            break;
                        case "file":
                            fileObjects = $(element).data().files;
                            break;
                    }
                } else {
                    if ($(element).parents('.people-picker') && $(element).prop('id').indexOf('_TopSpan_HiddenInput') > -1) {
                        var parentObject = $(element).parents('.people-picker');
                        var parentID = $(parentObject).prop('id');
                        var parentData = $(parentObject).data();
                        var rootObject = $('input[name="' + parentData.name + '"]');
                        var rootObjectName = $(rootObject).data('name');

                        var theseValues = SPClientPeoplePicker.SPClientPeoplePickerDict[parentID + "_TopSpan"].GetAllUserInfo();

                        if (theseValues) {
                            var ids = [];

                            for (var u = 0; u < theseValues.length; u++) {
                                switch (theseValues[u].EntityType) {
                                    case "SPGroup":
                                        //@ts-ignore
                                        ids.push(theseValues[u].EntityData.SPGroupID);
                                        break;
                                    case "User":
                                        var thisUser = spCommon.spCommon.ajax({
                                            //source: f.thisData.owner,
                                            method: 'GET',
                                            // headers: {
                                            //     "X-HTTP-Method": "PUT",
                                            //     "accept": "application/json; odata=verbose"
                                            //     },
                                            async: false,
                                            //data : { 'logonName': theseValues[u].Key },
                                            url: spCRUD.data().objects[parentData.owner].path + "/_api/web/siteusers(@v)?@v='" + encodeURIComponent(theseValues[u].Key) + "'",
                                            //url: spCRUD.data().objects[parentData.owner].path + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + encodeURIComponent(theseValues[u].Key) + "'" 
                                            //url: spCRUD.data().objects[parentData.owner].path + "/_api/web/ensureuser('"+  encodeURIComponent(theseValues[u].Key) +"')",
                                        });

                                        if (thisUser && thisUser.d) {
                                            ids.push(thisUser.d.Id);
                                        } else {
                                            toastr.info('User ' + theseValues[u].DisplayText + ' was not found!');
                                        }
                                        break;
                                }
                            }
                            if ($(rootObject).data('multi')) {
                                formObjects[$(rootObject).data('name').replace(/-/g, '_x002d_') + "Id"] = {
                                    results: ids
                                };
                            } else {
                                formObjects[$(rootObject).data('name').replace(/-/g, '_x002d_') + "Id"] = ids.length > 0 ? ids[0] : null;
                            }
                        }
                    }
                }
            });
        }

        formObjects.__metadata = {
            'type': 'SP.Data.' + f.thisObject.spType.replace(/-/g, '') + 'ListItem' // it defines the ListEnitityTypeName  
        };

        f.formObjects = formObjects;
        f.fileObjects = fileObjects;

        return f;
    }

    function getDestionationUrl(z: any) {
        var thisUrl;

        var thisValue;
        if (z.formObjects && z.formObjects.ID) {
            thisValue = z.formObjects.ID;
        }
        else {
            thisValue = z.caller ? $(z.caller).find('[data-name="ID"]').val() : undefined;
        }

        switch (z.action.toLowerCase()) {
            default:
            case 'save':
                thisUrl = z.path + "/_api/web/lists/GetByTitle('" + z.spType + "')/items";
                break;
            case 'update':
                z.headers = updateHeader(z.headers);
                thisUrl = z.path + "/_api/web/lists/GetByTitle('" + z.spType + "')/items(" + thisValue + ")";
                break;
            case 'delete':
                z.headers = deleteHeader(z.headers);
                thisUrl = z.path + "/_api/web/lists/GetByTitle('" + z.spType + "')/items(" + thisValue + ")";
                break;
        }

        return { url: thisUrl, headers: z.headers };
    }

    function saveModalForm(m: any)
    {
        m.thisData = $(m.currentTarget).data();
        m.caller = '#' + m.thisData.caller;
        m.action = m.thisData.action;
        m.source = m.thisData.source;
        m.callerType = "modal";
        saveForm(m);
    }

    function saveForm(m: any) {

        var thisData = m.thisData;
        var caller = m.caller;
        
        var thisActionType = m.action;
        var parentObject = _.find(theseLists, function (o) { return o.source == m.source; });
        
        var baseTemplate = parentObject.baseTemplate;

        var destinationURL = '';
        var headers = {};
        var formObjects = m.formObjects ? m.formObjects : {};
        var fileObjects = [];
        var multiTypes = [];

        if (parentObject.path) {

            var postStruct = getDestionationUrl({
                action: thisActionType.toLowerCase(),
                path: parentObject.path,
                spType: parentObject.spType,
                caller: caller,
                headers: headers,
                formObjects: formObjects
            });

            destinationURL = postStruct.url;
            headers = postStruct.headers;
            if(m.action != "delete")
            {
                var processedFormData = getFormData({ formSelector: caller, formObjects: formObjects, /*thisData: thisData,*/ thisObject: thisApp.objects[m.source] });
                formObjects = processedFormData.formObjects;
                fileObjects = processedFormData.fileObjects;
            
                var childForms = [];

                $('.child-wrapper .card').each(function (c, childElement) {
                    var thisChildBody = $(childElement).find('.card-body ul li');

                    if (thisChildBody) {
                        $(thisChildBody).each(function (cli, liElement) {
                            var thisForm = $(liElement).find('.form-container');
                            var thisChildData = $(thisForm).data();
                            var thisFormData = getFormData({ formSelector: thisForm, formObjects: {}, thisData: thisData, thisObject: thisApp.objects[thisChildData.source] });
                            thisFormData.thisActionType = "save";
                            thisFormData.caller = $(thisForm)[0].id;
                            childForms.push(thisFormData);
                        });
                    }
                });
            }
        }

        function closeModalRefreshData(s: any)
        {
            if(m.callerType == "modal")
            {
                var callerId = s.caller;
                $(callerId).parents('.modal').modal('hide');

                setTimeout(function () {
                    //var thisowner = $(callerId).parents('.modal').data('owner');
                    $(callerId).parents('.modal').remove();
                    $('.fillin-modal').remove();
                    spEnv.tables[s.source].ajax.reload();
                }, 200);
            }

            if(m.callerType == "child")
            {   
                $(m.caller).remove();
            }
        }

        if (destinationURL && !spEnv.inTestMode) {
            if (baseTemplate == '100') {
                var crudRequest2 = {
                    headers: headers,
                    method: 'POST',
                    url: destinationURL,
                    data: thisActionType.toLowerCase() == 'delete' ? undefined : JSON.stringify(formObjects),
                    fail: function (a: any) {
                        toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                    },
                    always: function (a: any) {

                    },
                    done: undefined
                };

                crudRequest2.done = function (r: any) {

                    switch (thisActionType.toLowerCase()) {
                        default:
                        case 'save':
                            var returnedData = r.d;
                            thisApp.lastSave.mainSaveData = r.d;
                            thisApp.lastSave.owner = thisData.owner;
                            thisApp.lastSave.action = { action : thisActionType.toLowerCase(), loaded : false };
                            thisApp.lastSave.templateType = baseTemplate;

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
                                    returnedData: {
                                        ID: $(caller).find('[data-name="ID"]').val()
                                    },
                                    fileObjects: fileObjects,
                                    thisData: thisData
                                });
                            }, 50);

                            toastr.success('Data has been successfully submitted.', 'Form Submitted!');
                            break;
                        case 'delete':
                            if (r && r.responseJSON && r.responseJSON.error && r.responseJSON.error.message && r.responseJSON.error.message.value.indexOf('list is related to an item in the')) {
                                toastr.success('Data has been successfully deleted.', 'Item Deleted!');
                            } else {
                                toastr.success('Data has been successfully deleted.', 'Item Deleted!');

                            }
                            break;
                    }

                    closeModalRefreshData(m);                    
                };

                crudRequest2.fail = function (r: any) {
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

                    closeModalRefreshData(m);                                      
                };

                spCommon.spCommon.ajax(crudRequest2);
            } else if (baseTemplate == '101') {
                switch (thisActionType.toLowerCase()) {
                    default:
                    case 'save':

                        triggerDocumentLibraryUpload({
                            parentObject: parentObject,
                            overwrite: false,
                            fileObjects: fileObjects,
                            thisData: thisData,
                            fail: function (f2: any) {
                                var matchedError = false;

                                if (matchedError == false && f2.responseJSON.error.message.value.indexOf('already exists')) {
                                    toastr.error(f2.responseJSON.error.message.value.replace('i:0#.f|membership|', ''), 'File already exists!');
                                    matchedError = true;
                                }

                            },
                            done: function (r2: any) {
                                thisApp.lastSave.mainSaveData = r2.d;
                                thisApp.lastSave.owner = parentObject.owner;
                                thisApp.lastSave.action = { action : thisActionType.toLowerCase(), loaded : false };
                                thisApp.lastSave.templateType = baseTemplate;

                                switch (thisActionType.toLowerCase()) {
                                    default:
                                    case 'save':

                                        headers = updateHeader(headers);

                                        formObjects.__metadata = {
                                            'type': 'SP.ListItem' // it defines the ListEnitityTypeName  
                                        };

                                        var crudRequest2 = {
                                            headers: headers,
                                            method: 'POST',
                                            url: r2.d.ListItemAllFields.__deferred.uri,
                                            data: JSON.stringify(formObjects),
                                            fail: function (a: any) {
                                                toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                                            },
                                            always: function (a: any) {

                                            },
                                            done: function (a: any) {
                                                
                                                closeModalRefreshData(m);
                                                                                            
                                                toastr.success('File meta has been successfully submitted.', 'Form Submitted!');
                                            }
                                        };

                                        spCommon.spCommon.ajax(crudRequest2);

                                        break;
                                    case 'update':
                                        clearLastSave();

                                        break;
                                }
                            }
                        });
                        break;
                    case 'update':
                        headers = updateHeader(headers);

                        if (fileObjects && fileObjects.length > 0) {
                            var currentRecord = spCRUD.currentRecord()

                            if (fileObjects[0].name.toLowerCase() == currentRecord.FileLeafRef.toLowerCase()) {
                                triggerDocumentLibraryUpload({
                                    parentObject: parentObject,
                                    overwrite: true,
                                    fileObjects: fileObjects,
                                    thisData: thisData,
                                    fail: function (f2: any) {
                                        var matchedError = false;

                                        if (matchedError == false && f2.responseJSON.error.message.value.indexOf('already exists')) {
                                            toastr.error(f2.responseJSON.error.message.value.replace('i:0#.f|membership|', ''), 'File already exists!');
                                            matchedError = true;
                                        }

                                    },
                                    done: function (r2: any) {

                                        switch (thisActionType.toLowerCase()) {
                                            default:
                                            case 'update':

                                                headers = updateHeader(headers);

                                                formObjects.__metadata = {
                                                    'type': 'SP.ListItem' // it defines the ListEnitityTypeName  
                                                };

                                                var crudRequest2 = {
                                                    headers: headers,
                                                    method: 'POST',
                                                    url: r2.d.ListItemAllFields.__deferred.uri,
                                                    data: JSON.stringify(formObjects),
                                                    fail: function (a: any) {
                                                        toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                                                    },
                                                    always: function (a: any) {
                                                        clearLastSave();
                                                    },
                                                    done: function (a: any) {

                                                        closeModalRefreshData(m);

                                                        toastr.success('File meta has been successfully submitted.', 'Form Submitted!');
                                                    }
                                                };

                                                spCommon.spCommon.ajax(crudRequest2);

                                                break;
                                        }
                                    }
                                });

                            } else {
                                toastr.error('File name must be the same in order to update file.', 'Form Not Submitted!');
                            }
                        } else {
                            formObjects.__metadata = {
                                'type': 'SP.ListItem' // it defines the ListEnitityTypeName  
                            };
                            var updateFileLeafRef = $(caller).data().FileLeafRef;
                            var url101Update = parentObject.path + "/_api/Web/GetFileByServerRelativePath(decodedurl='" + updateFileLeafRef + "')/ListItemAllFields";

                            var crudRequest21 = {
                                headers: headers,
                                method: 'POST',
                                url: url101Update,
                                data: JSON.stringify(formObjects),
                                fail: function (a: any) {
                                    toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                                },
                                always: function (a: any) {

                                    var childRequestFail = function (a1: any) {
                                        toastr.error('There was an issue saving the data, please refresh the page and try again.', 'Form Not Submitted!');
                                    };

                                    for (var index = 0; index < childForms.length; index++) {
                                        var childObject = childForms[index];

                                        var childPostStruct = getDestionationUrl({
                                            action: childObject.formObjects.ID ? "update" : "save",
                                            path: childObject.thisObject.path,
                                            spType: childObject.thisObject.spType,
                                            caller: childObject.thisObject.caller,
                                            formObjects: childObject.formObjects,
                                            headers: childObject.formObjects.ID ? updateHeader({}) : {}
                                        });

                                        var crudChildRequest = {
                                            headers: childPostStruct.headers,
                                            method: 'POST',
                                            url: childPostStruct.url,
                                            data: childObject.thisActionType.toLowerCase() == 'delete' ? undefined : JSON.stringify(childObject.formObjects),
                                            fail: childRequestFail,
                                            always: function (a: any) {

                                            }
                                        };

                                        spCommon.spCommon.ajax(crudChildRequest);
                                    }
                                },
                                done: function (a: any) {

                                    closeModalRefreshData(m);

                                    toastr.success('File meta has been successfully submitted.', 'Form Submitted!');
                                }
                            };

                            spCommon.spCommon.ajax(crudRequest21);
                        }

                        break;
                    case 'delete':
                        var crudRequest3 = {
                            headers: headers,
                            method: 'POST',
                            url: destinationURL,
                            data: undefined,
                            done: function (a: any) {
                                toastr.success('File has been deleted successfully submitted.', 'File deleted!');
                            },
                            fail: function (r: any) {

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
                            always: function (a: any) {
                                clearLastSave();
                            }
                        };

                        closeModalRefreshData(m);                        

                        spCommon.spCommon.ajax(crudRequest3);

                        break;
                }
            }
        }
    }

    function triggerDocumentLibraryUpload(m: any) {
        var overWriteFile = typeof m.overwrite == 'boolean' ? m.overwrite : false;

        var thesePendingFiles = [];

        if (m.fileObjects) {
            for (var thisFile = 0; thisFile < m.fileObjects.length; thisFile++) {
                var itemForQueue = uploadTheFile({
                    fileObjects: m.fileObjects,
                    thisFile: thisFile,
                    thisData: m.thisData,
                    url: m.parentObject.path + "/_api/web/lists/GetByTitle('" + m.parentObject.spType + "')/RootFolder/Files/add(overwrite=" + overWriteFile + ", url='" + m.fileObjects[thisFile].name + "')",
                    done: m.done,
                    fail: m.fail,
                    loaded : false
                });

                thesePendingFiles.push(itemForQueue);
            }
        } else {
            toastr.info('Please load a file in the form.');
        }

        function processQueue() {
            var tempList = _.filter(thesePendingFiles, function (o) {
                return o.loaded == undefined || o.loaded == false;
            });

            if (tempList.length > 0) {
                tempList[0].theFile.then(function (buffer: any) {
                    tempList[0].xhrRequest.data = buffer;
                    tempList[0].xhrRequest.always = function (r: any) {

                        if (_.find(thesePendingFiles, function (o) {
                            return o.loaded == undefined || o.loaded == false;
                        })) {
                            _.find(thesePendingFiles, function (o) {
                                return o.loaded == undefined || o.loaded == false;
                            }).loaded = true;
                        }

                        processQueue();
                    };

                    spCommon.spCommon.ajax(tempList[0].xhrRequest);
                });
            }
        }

        processQueue();
    }

    function triggerGenericListUploads(m: any) {
        var thesePendingFiles = [];

        if (m.fileObjects) {
            for (var thisFile = 0; thisFile < m.fileObjects.length; thisFile++) {
                var itemForQueue = uploadTheFile({
                    fileObjects: m.fileObjects,
                    thisFile: thisFile,
                    thisData: m.thisData,
                    returnedData: m.returnedData,
                    url: m.parentObject.path + "/_api/web/lists/GetByTitle('" + m.parentObject.spType + "')/items(" + m.returnedData.ID + ")/AttachmentFiles/add(FileName='" + m.fileObjects[thisFile].name + "')",
                    loaded : false
                });                

                thesePendingFiles.push(itemForQueue);
            }
        }

        function processQueue() {
            var tempList = _.filter(thesePendingFiles, function (o) {
                return o.loaded == undefined || o.loaded == false;
            });

            if (tempList.length > 0) {
                tempList[0].theFile.then(function (buffer) {
                    tempList[0].xhrRequest.data = buffer;
                    tempList[0].xhrRequest.always = function (r) {

                        if (_.find(thesePendingFiles, function (o) {
                            return o.loaded == undefined || o.loaded == false;
                        })) {
                            _.find(thesePendingFiles, function (o) {
                                return o.loaded == undefined || o.loaded == false;
                            }).loaded = true;
                        }

                        processQueue();
                    };

                    spCommon.spCommon.ajax(tempList[0].xhrRequest);
                });
            }
        }

        processQueue();
    }

    function uploadTheFile(m: any) {
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
            done: function (r: any) {
                toastr.success('File ' + currentFile.name + ' uploaded!', 'File Uploaded!');

                if (typeof m.done == 'function') {
                    m.done(r);
                }

            },
            fail: function (response: any, errorCode: any, errorMessage: any) {

                if (typeof m.fail == 'function') {
                    m.fail(response);
                } else {
                    if (response.status == 409) {
                        if (this.tryCount <= this.retryLimit) {
                            this.tryCount++;
                            //try again
                            $.ajax(this);
                            return;
                        } else {
                            toastr.error('Error Submitting Data!', 'Data Not Submitted!');
                        }
                        //console.log(response)
                        //handle error
                    } else if (response.status == 400) {
                        if (response.responseJSON && response.responseJSON.error && response.responseJSON.error.message) {
                            var fileMessage = response.responseJSON.error.message.value;

                            toastr.error(fileMessage, 'File not saved');
                        }


                    } else {
                        console.log(errorCode);
                        //handle error
                    }
                }

            },
        };

        //spCommon.spCommon.ajax(uploadFileXHR);	        				
        //});
        return {
            xhrRequest: uploadFileXHR,
            theFile: loadedFile
        };
    }

    // Render and initialize the client-side People Picker.
    function initializePeoplePicker(m: any) {

        // Create a schema to store picker properties, and set the properties.
        var schema = {
            PrincipalAccountType: '',
            SearchPrincipalSource: undefined,
            ResolvePrincipalSource: undefined,
            AllowMultipleValues : undefined,
            MaximumEntitySuggestions: undefined,
            SharePointGroupID: undefined,
            Width: undefined
        };

        if (m.type == 'User') {
            schema.PrincipalAccountType = 'User';
        } else {
            schema.PrincipalAccountType = 'User,DL,SecGroup,SPGroup';

        }
        schema.SearchPrincipalSource = 15;
        schema.ResolvePrincipalSource = 15;
        schema.AllowMultipleValues = m.multi;
        schema.MaximumEntitySuggestions = 50;
        schema.SharePointGroupID = m.selectiongroup;
        schema.Width = '100%';

        var prepop = m.users ? m.users : null;
        // Render and initialize the picker. 
        // Pass the ID of the DOM element that contains the picker, an array of initial
        // PickerEntity objects to set the picker value, and a schema that defines
        // picker properties.
        SPClientPeoplePicker_InitStandaloneControlWrapper(m.id, prepop, schema);
    }

    // Query the picker for user information.
    function getUserInfo(m: any) {

        // Get the people picker object from the page.
        var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;

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
        console.log(this.user.get_id());
        //	$('#userId').html();
    }

    function onFail(sender: any, args: any) {
        alert('Query failed. Error: ' + args.get_message());
    }

    // Get the user ID.
    function getUserId(loginName: any) {
        //@ts-ignore
        var context = new SP.ClientContext.get_current();
        this.user = context.get_web().ensureUser(loginName);
        context.load(this.user);
        context.executeQueryAsync(
            Function.createDelegate(null, ensureUserSuccess),
            Function.createDelegate(null, onFail)
        );
    }

    function loadPickersWithData(m: any) {
        m.disableClear = typeof m.disableClear == "boolean" ? m.disableClear : false;

        $(m.objectParent).find('.people-picker').each(function (i, element) {

            if (m.disableClear) {
                clearPicker({
                    selector: $(element).prop('id') + "_TopSpan"
                });
            }

            var parentName = $(element).data('name');

            var thisPickerPrePopulateObject = $(m.objectParent).find('[name="' + parentName + '"]');

            if ($(thisPickerPrePopulateObject).data('prepopulate')) {
                var data = {
                    users : []
                };
                var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict[$(element).prop('id') + "_TopSpan"];
                
                var prepop = $(thisPickerPrePopulateObject).data('prepopulate');
                if ($(thisPickerPrePopulateObject).data('multi')) {
                    data.users = prepop != undefined && prepop.results != undefined ? prepop.results : [];

                    for (var ii = 0; ii < data.users.length; ii++) {
                        var usrObj = {
                            Key: data.users[ii].Name
                        };
                        //@ts-ignore
                        peoplePicker.AddUnresolvedUser(usrObj, true);
                    }

                } else {
                    if (prepop.Name) {
                        data.users.push(prepop);

                        for (var ii2 = 0; ii2 < data.users.length; ii2++) {
                            var usrObj2 = {
                                Key: data.users[ii2].Name
                            };

                            if (peoplePicker && data && data.users && data.users[ii2].Name) {
                                //@ts-ignore
                                peoplePicker.AddUnresolvedUser(usrObj2, true);
                            }
                        }
                    }
                }
            }
        });
    }

    function clearPicker(m: any) {
        var getIDPeoplePicker = m.selector;
        var ppobject = SPClientPeoplePicker.SPClientPeoplePickerDict[getIDPeoplePicker];
        var usersobject = ppobject.GetAllUserInfo();
        usersobject.forEach(function (index) {
            //@ts-ignore
            ppobject.DeleteProcessedUser(usersobject[index]);
        });
    }

    function initPeoplePickers() {
        $('.people-picker').each(function (i, element) {
            var data = $(element).data();
            data.id = $(element).prop('id');
            data.pickerLoaded = typeof data.pickerLoaded == "boolean" ? data.pickerLoaded : false;

            if (data.pickerLoaded == false) {
                spCRUD.initializePeoplePicker(data);
            }

            $(element).data('pickerLoaded', true);
        });

        $('.sp-peoplepicker-topLevel').addClass('form-control');
        $('.sp-peoplepicker-topLevel').css('width', '');
    }

    function loadFillinModal(e: any) {
        var thisData = $(e).data();

        if (thisData.owner && thisData.source) {
            $('#modal-fillin-' + thisData.source + '-' + thisData.owner).modal('show');
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
                    thisData.value = {
                        id: thisValue,
                        text: thisValue
                    };
                    thisData.selector = '#' + thisData.uiid;

                    addValue2Select(thisData);
                    break;
                case "radio":
                case 1: //radio
                    thisData.value = {
                        id: thisValue,
                        text: thisValue
                    };
                    thisData.selector = '#' + thisData.uiid;

                    addValue2Radio(thisData);

                    console.log('add radio');
                    break;
            }
        }
    }

    function addValue2Radio(m: any) {
        if (m.selector && m.value && m.value.id && m.value.text) {
            var numberOfChecks = $(m.selector).find('.form-check').length;
            var nextNumber = numberOfChecks + 1;
            var optionSyntax = '<div class="form-check">' +
                '	<input class="form-check-input" for="' + m.uuid + '" type="radio" name="' + m.source + '.' + m.for + '" data-entity="' + m.entity + '" id="' + m.action + '.' + m.source + '.' + m.for + '' + nextNumber + '" data-name="' + m.for + '" value="' + m.value.id + '" >' +
                '	<label class="form-check-label" for="">' + m.value.text + '</label>' +
                '</div>';

            var newOption = $(optionSyntax);

            $(m.selector).append(newOption);

            $('input[for="' + m.uuid + '"][value="' + m.value.id + '"]').prop('checked', true);
        }
    }

    function addValue2Select(m: any) {
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
        loadPickersWithData: function (m: any) {
            return loadPickersWithData(m);
        },
        initPeoplePickers: function (m: any) {
            return initPeoplePickers();
        },
        initializePeoplePicker: function (m: any) {
            return initializePeoplePicker(m);
        },
        getUserInfo: function (m: any) {
            return getUserInfo(m);
        },
        getUserId: function (m: any) {
            return getUserId(m);
        },
        data: function () {
            return thisApp;
        },
        getStruct: function (m: any) {
            return getListStructure(m);
        },
        getList: function (m: any) {
            if (!spEnv.inEditMode) {
                $('head').append('<style type="text/css">.ms-webpart-zone { display: none; } </style>');

                spLoader.theLoader.show({
                    id: 'initiateApp'
                });
                var newObjectOrder = [];

                for (var index = 0; index < m.objects.length; index++) {
                    var element = m.objects[index];
                    newObjectOrder.push(element);

                    if (element.children) {
                        for (var index2 = 0; index2 < element.children.length; index2++) {
                            var childElement = element.children[index2];
                            childElement.parent = element.name.toLowerCase();
                            newObjectOrder.push(childElement);
                        }
                    }
                }

                theseLists = newObjectOrder;
                loadLists();
                //spCommon.spCommon.theList(m);
                setTimeout(function () {
                    spLoader.theLoader.hide({
                        id: 'initiateApp'
                    });
                }, 2000);
            }
            else {
                $('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
            }
        },
        clear: function (m: any) {
            $('#sp-app-contents').empty();
            $('.spa-app-items').empty();
        },
        fileLoader: function (m: any) {
            fileLoader(m);
        },
        saveData: function (m: any) {
            return saveForm(m);
        },
        clearData: function (m: any) {
            return clearForm(m);
        },
        lookupDataPoints: function () {
            return lookupDataPoints;
        },
        loadFillinModal: function () {
            return loadFillinModal($(this));
        },
        updateLookups: function (m: any) {
            updateLookups(m);
        },
        currentRecord: function () {
            return currentRecord;
        },
        reloadEditForm: function () {
            return reloadEditForm();
        }
    };
})();


// spEnv.$pa.spEmail.send({
//     from: "risi@eminent-it.company",
//     to: "risi@eminent-it.company",
//     body : "Test body",
//     subject : "Test"
// });