/*jshint scripturl:true*/
import * as $ from 'jquery';
import * as _ from 'lodash';
import * as Handlebars from 'handlebars';
import * as spEnv from "./spa.spEnv";
import * as spAsync from "./spa.spAsyncQueue";
import * as spPrompt from "./spa.spPrompt";
import * as spLoader from "./theLoader";
import * as toastr from "toastr"; 

spEnv.$pa.spCommon = (function () {
    var thisSite = {
        objects: {} as any
    };

    var continueToUpdateContext = true;
    
    function updateDigest() {
        spAjax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/contextinfo",
            async: true,
            method: 'POST',
            done: function (r:any) {
                $('#__REQUESTDIGEST').val(r.d.GetContextWebInformation.FormDigestValue);
            },
            fail: function (response:any, errorCode:any, errorMessage:any) {
                continueToUpdateContext = false;

                spPrompt.promptDialog.prompt({
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
                            	spLoader.theLoader.show({ id : 'reload-page' });
                            	setTimeout(function () { window.location.reload(); }, 500);
                            }
                        }]
                });
            }
        });
    }

    setInterval(function () {
        if (continueToUpdateContext) {
            /*_spPageContextInfo.webServerRelativeUrl, _spFormDigestRefreshInterval*/
            updateDigest();
        }
    }, 1 * 15000);


    function registerForms() {
        alert('Click Saved');
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

    function spAjax(m:any) {
        /*var source = m.source;
	
        var thisData =  {
            '__metadata': {  
                'type': 'SP.Data.' + source + 'ListItem' // it defines the ListEnitityTypeName  
            }
        }*/

        var headers = m.headers != undefined ? m.headers : {};
        headers.Accept = headers.Accept ? headers.Accept : "application/json; odata=verbose"; //It defines the Data format   
        headers["content-type"] = headers["content-type"] ? headers["content-type"] : "application/json;odata=verbose"; //It defines the content type as JSON  
        headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val(); //It gets the digest value           		

        var ajaxParam = {
            method: m.method,
            url: m.url,
            data: m.data,
            async: m.async != undefined ? m.async : true,
            processData: m.processData != undefined ? m.processData : true,
            headers: headers,
            retryLimit: m.retryLimit != undefined ? m.retryLimit : 0,
            tryCount: m.tryCount != undefined ? m.tryCount : 0,
        }

        var ajaxReturn = $.ajax(ajaxParam)
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

        if (m.async == false && ajaxReturn.status == 200) {
            return ajaxReturn.responseJSON;
        }
    }

    function getExtension(path:string) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
            // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }

    initSettings();

    function getRelativeURL(m:any) {
        if (typeof m.url == 'string') {
            return m.url.replace(/^.*\/\/[^\/]+/, '');
        }
    }

    function getSiteLists(m:any) {

        var thisAjax = {
            source: m.source,
            method: 'GET',
            url: m.path + "/_api/web/lists?$filter=Hidden eq false", // and BaseType ne 1",
            done: function (a:any) {

                thisSite.objects = a;

                if (typeof m.afterCompletion == 'function') {
                    m.afterCompletion();
                }
            },
            fail: function (a:any) {
            },
            always: function (a:any) {
                //loadLists();
            }
        };

        spEnv.$pa.spCommon.ajax(thisAjax);
    }
    
    return {
        ajax: function (m:any) { return spAjax(m); },
        getExtension: function (m:any) {
            return getExtension(m);
        },
        addHandlebar: function (o:any) {
            return o ? Handlebars.compile(o) : function () { console.log('Handlebar Not Present'); };
        },
        addHandlebarPartial: function (m:any) {
            if (typeof m == 'object' && m.name) {
                return m.content ? Handlebars.registerPartial(m.name, m.content) : Handlebars.registerPartial(m.name, '');
            }
        },
        ordinal_suffix_of: function (i:any) {
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
        getRelativeURL: function (m:any) {
            return getRelativeURL(m);
        },
        theList: function (m:any) { return thisSite; },
        getUserPermissions : function (m:any)
		{
			for (var i = 0; i < m.urls.length; i++) { 
				
				//console.log(m.urls[i]);
				
				var site = { path : m.urls[i], privileges : [] };
			
				var ajaxStruct = {
					url : m.urls[i] + "/_api/web/getusereffectivepermissions(@u)?@u='" + encodeURIComponent("i:0#.f|membership|" + m.accountName) + "'",
					method : 'GET',
					async: true,
					done : function (a:any) { 

                        var returnedData = a;
				
                        var permissions = new SP.BasePermissions();
                        permissions.initPropertiesFromJson(returnedData.d.GetUserEffectivePermissions);
                        
                        var permLevels = [];
                        
                        //@ts-ignore
                        for(var permLevelName in SP.PermissionKind.prototype) {
                            if (SP.PermissionKind.hasOwnProperty(permLevelName)) {
                               //@ts-ignore
                               var permLevel = SP.PermissionKind.parse(permLevelName);
                               if(permissions.has(permLevel)){
                                  permLevels.push(permLevelName);
                                }
                            }     
                        }
                        site.privileges = permLevels; 
                        
                        spEnv.spPermissions.site.push(site);
					}
                };
                spAsync.spAsyncQueue.call(ajaxStruct);
            }
			
            spEnv.spPermissions.loaded = true;
                        
            if(typeof m.done == "function")
            {
                var permInterval = setInterval(function(){
                    if(spAsync.spAsyncQueue.queue().length == 0)
                    {
                        clearInterval(permInterval);
                        m.done();
                    }
                }, 50);                
            }
		},
		checkUserPermission : function (m:any)
		{
			if(spEnv.spPermissions.loaded && _.find(spEnv.spPermissions.site, { path : m.path, privileges: [m.privilege] }))
			{
				return true;
			}
			else
			{
				return false;
			}
        },
        getFileExtension : function (fileNameOrURL : string, showUnixDotFiles : boolean) {
            /* First, let's declare some preliminary variables we'll need later on. */
            var fileName;
            var fileExt;
        
            /* Now we'll create a hidden anchor ('a') element (Note: No need to append this element to the document). */
            var hiddenLink = document.createElement('a');
        
            /* Just for fun, we'll add a CSS attribute of [ style.display = "none" ]. Remember: You can never be too sure! */
            hiddenLink.style.display = "none";
        
            /* Set the 'href' attribute of the hidden link we just created, to the 'fileNameOrURL' argument received by this function. */
            hiddenLink.setAttribute('href', fileNameOrURL);
        
            /* Now, let's take advantage of the browser's built-in parser, to remove elements from the original 'fileNameOrURL' argument received by this function, without actually modifying our newly created hidden 'anchor' element.*/
            fileNameOrURL = fileNameOrURL.replace(hiddenLink.protocol, ""); /* First, let's strip out the protocol, if there is one. */
            fileNameOrURL = fileNameOrURL.replace(hiddenLink.hostname, ""); /* Now, we'll strip out the host-name (i.e. domain-name) if there is one. */
            fileNameOrURL = fileNameOrURL.replace(":" + hiddenLink.port, ""); /* Now finally, we'll strip out the port number, if there is one (Kinda overkill though ;-)). */
        
            /* Now, we're ready to finish processing the 'fileNameOrURL' variable by removing unnecessary parts, to isolate the file name. */
        
            /* Operations for working with [relative, root-relative, and absolute] URL's ONLY [BEGIN] */
        
            /* Break the possible URL at the [ '?' ] and take first part, to shave of the entire query string ( everything after the '?'), if it exist. */
            fileNameOrURL = fileNameOrURL.split('?')[0];
        
            /* Sometimes URL's don't have query's, but DO have a fragment [ # ](i.e 'reference anchor'), so we should also do the same for the fragment tag [ # ]. */
            fileNameOrURL = fileNameOrURL.split('#')[0];
        
            /* Now that we have just the URL 'ALONE', Let's remove everything to the last slash in URL, to isolate the file name. */
            fileNameOrURL = fileNameOrURL.substr(1 + fileNameOrURL.lastIndexOf("/"));
        
            /* Operations for working with [relative, root-relative, and absolute] URL's ONLY [END] */
        
            /* Now, 'fileNameOrURL' should just be 'fileName' */
            fileName = fileNameOrURL;
        
            /* Now, we check if we should show UNIX dot-files, or not. This should be either 'true' or 'false'. */
            if (showUnixDotFiles == false) {
                /* If not ('false'), we should check if the filename starts with a period (indicating it's a UNIX dot-file). */
                if (fileName.startsWith(".")) {
                    /* If so, we return a blank string to the function caller. Our job here, is done! */
                    return "";
                }
            }
        
            /* Now, let's get everything after the period in the filename (i.e. the correct 'file extension'). */
            fileExt = fileName.substr(1 + fileName.lastIndexOf("."));
        
            /* Now that we've discovered the correct file extension, let's return it to the function caller. */
            return fileExt;
        }
    }
})();

if($('#DeltaPlaceHolderMain').length == 0)
{
    $('#DeltaPlaceHolderMain')
    $('body').append('<div id="DeltaPlaceHolderMain"></div>');
}

$('#DeltaPlaceHolderMain').append(spEnv.$pa.env.tabBody());

$('.container').on('click', 'tbody tr', function () {

    var thisTable = $(this).parents('table').data('table');

    if ($(this).hasClass('selected')) {
        if (spEnv.tables && spEnv.tables[thisTable]) {
            spEnv.tables[thisTable].lastRow = undefined;
        }

        $(this).removeClass('selected');
    }
    else {
        $(this).parents('table').find('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        if (spEnv.tables && spEnv.tables[thisTable]) {
            spEnv.tables[thisTable].lastRow = { id: $(this).prop('id'), data: spEnv.tables[thisTable].ajax.json().data[$(this).index()], spData: spEnv.tables[thisTable].ajax.json().spData[$(this).index()] };
        }
    }
});
