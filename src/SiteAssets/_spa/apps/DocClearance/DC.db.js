var thisLists = [{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'P11',
		type: "Generic List",
		Description: 'Document Clearance Priorities',
		Columns: [{
			type: 'Text',
			Title: 'Priority',
			MaxLength: 100
		}, ]
	},
	{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'S11',
		type: "Generic List",
		Description: 'Document Clearance Sources',
		Columns: [{
			type: 'Text',
			Title: 'Source',
			MaxLength: 100
		}]
	},
	{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'M11',
		type: "Generic List",
		Description: 'Document Markings',
		Columns: [{
			type: 'Text',
			Title: 'Marking',
			MaxLength: 100
		}]
	},
	{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'PC11',
		type: "Generic List",
		Description: 'Document Portfiolio Category',
		Columns: [{
			type: 'Text',
			Title: 'PortfiolioCategory',
			MaxLength: 100
		}]
	},
	{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'LP11',
		type: "Generic List",
		Description: 'Document Lead Portfolios',
		Columns: [{
			type: 'Text',
			Title: 'LeadPortfolio',
			MaxLength: 100
		}]
	},
	{
		url: _spPageContextInfo.webAbsoluteUrl,
		Title: 'DCMain',
		type: "Document Library",
		Description: 'Document Clearance App',
		Columns: [{
			type: 'FieldLookup',
			Title: 'Priority',
			LookupListId: {
				listName: "P11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Priority'
		},
		{
			type: 'FieldLookup',
			Title: 'Source',
			LookupListId: {
				listName: "S11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Source'
		},
		{
			type: 'FieldLookup',
			Title: 'Marking',
			LookupListId: {
				listName: "M11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Marking'
		},
		{
			type: 'FieldLookup',
			Title: 'PortfiolioCategory',
			LookupListId: {
				listName: "PC11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'PortfiolioCategory'
		},
		{
			type: 'FieldLookup',
			Title: 'LeadPortfolio',
			LookupListId: {
				listName: "LP11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'LeadPortfolio'
		}
	]
	}
];

$(document).ready(function () {

	if (!inEditMode) {
		$.fn.spDB.createApp(thisLists);
	} else {
		$('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
	}
});