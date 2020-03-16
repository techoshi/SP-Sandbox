$(document).ready(function () {

	if (!inEditMode) {
		$.fn.spDB.createApp([{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Priorities',
				type : "Generic List",
				Description: 'Application for Priority Levels',
				Columns: [{
						type: 'Text',
						Title: 'Priority',
						MaxLength: 100
					},
				]
			},
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Sources',
				type : "Generic List",
				Description: 'Document Sources',
				Columns: [
					{
						type: 'Text',
						Title: 'Source',
						MaxLength: 100
					}
				]
			},
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Markings',
				type : "Generic List",
				Description: 'Document Markings',
				Columns: [
					{
						type: 'Text',
						Title: 'Marking',
						MaxLength: 100
					}
				]
			},			
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Markings',
				type : "Generic List",
				Description: 'Document Sources',
				Columns: [
					{
						type: 'Text',
						Title: 'Marking',
						MaxLength: 100
					}
				]
			},			
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'PortfiolioCategories',
				type : "Generic List",
				Description: 'Document Sources',
				Columns: [
					{
						type: 'Text',
						Title: 'PortfiolioCategory',
						MaxLength: 100
					}
				]
			},			
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'LeadPortfolios',
				type : "Generic List",
				Description: 'Document Sources',
				Columns: [
					{
						type: 'Text',
						Title: 'LeadPortfolio',
						MaxLength: 100
					}
				]
			},
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Projects',
				type : "Generic List",
				Description: 'Projects List in Contracts App',
				Columns: [{
						type: 'FieldLookup',
						Title: 'ContractCN',
						LookupListId: {
							listName: "Contracts"
						},
						AllowMultipleValues: false,
						LookupFieldName: 'ContractCN'
					},
					{
						type: 'FieldUser',
						Title: 'Contractor',
						AllowMultipleValues: false
					},
					{
						type: 'FieldDateTime',
						Title: 'StartDate'
					},
					{
						type: 'FieldDateTime',
						Title: 'EndDate'
					}
				]
			}
		]);

		$.fn.spDB.createApp();
	} else {
		$('#DeltaPlaceHolderMain').append('<h1>The JS Application does not load during SharePoint Edit Mode</h1>');
	}
});