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

globalThis.spaLogger = false;

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
		theLoaderTemplate: require("../handlebars/the_loader_template.hbs"),
		tabBody: require("../handlebars/sp_tab_container.hbs"),
		fileAttachment: require("../handlebars/sp_file_attachment.hbs"),
		fileInventory: require("../handlebars/sp_file_inventory_template.hbs"),
		tabTemplate: require("../handlebars/tabs-template.hbs"),
		anchorList: require("../handlebars/list-anchor-items-template.hbs"),
		baseForm: require("../handlebars/sp_forms_template.hbs"),
		deleteItem: require("../handlebars/sp_delete_item.hbs"),
		baseModal: require("../handlebars/sp-modal-template.hbs"),
		datatable_refresh_html: require("../handlebars/datatable_refresh_html.hbs"),
		datatableNavigation: require("../handlebars/datatable_nav.hbs"),
		spTableTemplate: require("../handlebars/sp_table_template.hbs"),
		spJsTreeTemplate: require("../handlebars/sp_jstree_template.hbs"),
		spSearchCondition: require("../handlebars/sp-search-condition.hbs"),
		fillinModal: require("../handlebars/sp-modal-fillin-template.hbs"),
		promptModal: require("../handlebars/prompt-modal-template.hbs"),
		spDropDownOptions: require("../handlebars/sp-lookup-dropdown.hbs"),
		bootstrapAlert: require("../handlebars/bootstrap-alert.hbs"),
		spaAccordion: require("../handlebars/spa_accordion.hbs"),
		spaAccordionCard: require("../handlebars/spa_accordion_card.hbs"),
		spaChildFormRow: require("../handlebars/spa-child-form-row.hbs"),
		thisNavLiTemplate: require("../handlebars/bootstrap-nav-li.hbs"),
		thisNavDivTemplate: require("../handlebars/bootstrap-nav-div.hbs"),
	},
	spCommon: undefined as any,
	spCRUD: undefined as any,
	spQuery: undefined as any,
	spDB: undefined as any,
	spAsyncQueue: undefined as any
}

require("./spa.spCommon");
require("./spa.spEmail");
require("./spa.spAsyncQueue");