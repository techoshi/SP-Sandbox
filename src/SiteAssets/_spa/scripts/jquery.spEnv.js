var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
var inEditMode = false;
var inTestMode = false;
var spSettings = {
    maxQueryItems: 5000
};

if (inDesignMode == "1") {
    inEditMode = true;
}

var tables = {};
var mGlobal = {};
mGlobal.page = {};

var spPermissions = {
	loaded : false,
	site : []
};

$.fn.moveUp = function() {
    before = $(this).prev();
    $(this).insertBefore(before);
};

$.fn.moveDown = function() {
    after = $(this).next();
    $(this).insertAfter(after);
};

$.fn.spEnvironment = {
	updatePermission : function(m) {
		if(!spPermissions.loaded)
		{
			Object.defineProperty(spPermissions, "privileges", {
			  value: m,
			  writable: false,
			  enumerable: true,
			  configurable: true
			});	
			
			spPermissions.loaded = true;
			Object.freeze(spPermissions);						
		}		
 	}	
};


$.fn.getType = function () { return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase(); };