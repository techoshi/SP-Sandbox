import * as $ from 'jquery';
import * as _ from 'lodash';

// import 'material-design-icons'
// import 'font-awesome'
import "jquery-ui-bundle"
import 'bootstrap';
import 'toastr'
import "../styles/project.css"
import 'datatables.net';
import 'datatables.net-bs4';
import 'datatables.net-autofill';
import 'datatables.net-buttons';
import 'datatables.net-fixedheader';
import 'datatables.net-keytable';
import 'datatables.net-responsive';
import 'datatables.net-rowgroup';
import 'datatables.net-select';

import "./polyfills";
import "./dt-helper"
import "./matth.uuid";
import "select2"

import "../styles/loader.css"
import "../styles/style1.css"
import "../styles/style2.css"
import "../styles/style3.css"
import "../styles/fileloader.css"
import "../styles/style5.css"
import "../styles/style6.css"
import "../styles/style7.css"
import "../styles/iframe.css"

declare var MSOWebPartPageFormName: any;

type mGlobal = {
	page: {},
}

type page = {
	name: string;
}

// interface env {
// 	updatePermission: object
// }
var checkDesignMode = false;
try
{
if(MSOWebPartPageFormName && document && document.forms && document.forms[MSOWebPartPageFormName])
{
	checkDesignMode = true;
}
}
catch(e)
{
	checkDesignMode = false;
}

export var inDesignMode = checkDesignMode ? document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value : "0";
export var inEditMode = false;
export var inTestMode = false;
export var spSettings = {
	maxQueryItems: 5000
};

if (inDesignMode == "1") {
	inEditMode = true;
}

export var tables = {};
export var mGlobal = {
	page: {} as page
};

export var spPermissions = {
	loaded: false,
	site: []
};

$.fn.extend({
	moveUp: function () {
		var before = $(this).prev();
		$(this).insertBefore(before);
	},
	moveDown: function () {
		var after = $(this).next();
		$(this).insertAfter(after);
	},
	getType : function () { 
		return this[0].tagName == "INPUT" ? this[0].type.toLowerCase() : this[0].tagName.toLowerCase(); 
	}
});

// declare function theLoaderTemplate(x: object): string;

export var $pa = {
	fn: {} as any,
	env: {
		updatePermission: function (m: any) {
			if (!spPermissions.loaded) {
				Object.defineProperty(spPermissions, "privileges", {
					value: m,
					writable: false,
					enumerable: true,
					configurable: true
				});

				spPermissions.loaded = true;
				Object.freeze(spPermissions);
			}
		},
		theLoaderTemplate: undefined as any,
		tabBody: undefined as any,
		fileAttachment: undefined as any,
		fileInventory: undefined as any,
		tabTemplate: undefined as any,
		anchorList: undefined as any,
		baseForm: undefined as any,
		deleteItem: undefined as any,
		baseModal: undefined as any,
		datatable_refresh_html: undefined as any,
		spTableTemplate: undefined as any,
		spJsTreeTemplate: undefined as any,
		spSearchCondition: undefined as any,
		fillinModal: undefined as any,
		promptModal: undefined as any,
		spDropDownOptions: undefined as any,
		bootstrapAlert: undefined as any,
		spaAccordion: undefined as any,
		spaAccordionCard: undefined as any,
		spaChildFormRow: undefined as any,
		thisNavLiTemplate: undefined as any,
		thisNavDivTemplate: undefined as any,
	},
	spCommon: undefined as any,
	spCRUD: undefined as any,
	spQuery: undefined as any,
	spDB: undefined as any,
	spAsyncQueue: undefined as any,
}

require("./spa.spCommon");