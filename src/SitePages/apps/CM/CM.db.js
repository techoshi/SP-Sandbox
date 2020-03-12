$(document).ready(function () {

	if (!inEditMode) {
		$.fn.spDB.createApp([{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Contracts',
				type : "Generic List",
				Description: 'Contract Management App',
				Columns: [{
						type: 'Text',
						Title: 'ContractCN',
						MaxLength: 100
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
			},
			{
				url: _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists",
				Title: 'Contractors',
				type : "Generic List",
				Description: 'Contractors List in Contracts App',
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