import * as $ from 'jquery';
import * as _ from 'lodash';

// import 'material-design-icons'
// import 'font-awesome'
import "jquery-ui-bundle"
import 'bootstrap';
import 'toastr'
import "../styles/project.css"


import "./polyfills";
import "./dt-helper"
import "./matth.uuid";
import "select2"

import "../styles/loader.css"
import "../styles/style1.css"
import "../styles/fileloader2.css"
import "../styles/style3.css"
import "../styles/fileloader.css"
import "../styles/style5.css"
import "../styles/modal.css"
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
		datatableNavigation: undefined as any,
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
	spAsyncQueue: undefined as any
}

$pa.env.tabBody = require("../handlebars/sp_tab_container.hbs");
$pa.env.fileAttachment = require("../handlebars/sp_file_attachment.hbs");
$pa.env.fileInventory = require("../handlebars/sp_file_inventory_template.hbs");
$pa.env.tabTemplate = require("../handlebars/tabs-template.hbs");
$pa.env.anchorList = require("../handlebars/list-anchor-items-template.hbs");
$pa.env.baseForm = require("../handlebars/sp_forms_template.hbs"); 
$pa.env.deleteItem = require("../handlebars/sp_delete_item.hbs");
$pa.env.baseModal = require("../handlebars/sp-modal-template.hbs");
$pa.env.datatable_refresh_html = require("../handlebars/datatable_refresh_html.hbs");
$pa.env.datatableNavigation = require("../handlebars/datatable_nav.hbs");
$pa.env.spTableTemplate = require("../handlebars/sp_table_template.hbs");
$pa.env.spJsTreeTemplate = require("../handlebars/sp_jstree_template.hbs");
$pa.env.spSearchCondition = require("../handlebars/sp-search-condition.hbs");
$pa.env.fillinModal = require("../handlebars/sp-modal-fillin-template.hbs");
$pa.env.promptModal = require("../handlebars/prompt-modal-template.hbs");
$pa.env.spDropDownOptions = require("../handlebars/sp-lookup-dropdown.hbs");
$pa.env.bootstrapAlert = require("../handlebars/bootstrap-alert.hbs");
$pa.env.spaAccordion = require("../handlebars/spa_accordion.hbs");
$pa.env.spaAccordionCard = require("../handlebars/spa_accordion_card.hbs");
$pa.env.spaChildFormRow = require("../handlebars/spa-child-form-row.hbs");
$pa.env.thisNavLiTemplate = require("../handlebars/bootstrap-nav-li.hbs");
$pa.env.thisNavDivTemplate = require("../handlebars/bootstrap-nav-div.hbs");

require("./spa.spCommon");
require("./spa.spEmail");
require("./spa.spAsyncQueue");