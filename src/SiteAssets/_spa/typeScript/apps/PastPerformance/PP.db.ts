import "../../spa.spEnv";
import * as spDB from "../../spa.spDB";

var PrimeContractors = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'PC',
	type: "Generic List",
	Description: 'Prime Contractors List',
	Columns: [{
		type: 'FieldText',
		Title: 'PrimeContractor',
		MaxLength: 100
	}]
} as SharePointListStruct;

var NaicsCodes = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'NC',
	type: "Generic List",
	Description: 'Naics Code List',
	Columns: [{
		type: 'FieldText',
		Title: 'NaicsCode',
		MaxLength: 100
	}]
} as SharePointListStruct;

var PastPerformanceApp = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'PP',
	type: "Generic List",
	Description: 'Past Performance App',
	Columns: [
		{
			type: 'FieldText',
			Title: 'ContractTitle',
			MaxLength: 100
		},
		{
			type: 'FieldText',
			Title: 'ContractNo',
			MaxLength: 100
		},
		{
			type: 'FieldLookup',
			Title: 'PrimeContractor',
			LookupListId: {
				listName: PrimeContractors.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'PrimeContractor'
		},
		{
			type: 'FieldCurrency',
			Title: 'ContractAmount'
		},
		{
			type: 'FieldText',
			Title: 'ContractOwner',
			MaxLength: 100
		},
		{
			type: 'FieldDateTime',
			Title: 'StartDate'
		},
		{
			type: 'FieldDateTime',
			Title: 'EndDate'
		},
		{
			type: 'FieldLookup',
			Title: 'NaicsCode',
			LookupListId: {
				listName: NaicsCodes.Title
			},
			AllowMultipleValues: true,
			LookupFieldName: 'NaicsCode'
		}
	]
} as SharePointListStruct;

spDB.thisLists.push(PrimeContractors);
spDB.thisLists.push(NaicsCodes);
spDB.thisLists.push(PastPerformanceApp);

//require("./DC.defaultData");
spDB.spDB.initUI();