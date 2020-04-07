import * as $ from 'jquery';
import * as _ from 'lodash';

declare var MSOWebPartPageFormName: any;

type mGlobal = {
	page: {}
}

type page = {
	name: string;
}

// interface env {
// 	updatePermission: object
// }

export var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;
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
