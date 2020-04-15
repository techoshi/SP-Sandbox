import "../../spa.spEnv";
import * as spDB from "../../spa.spDB";

var ContractList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Contracts',
	type: "Generic List",
	Description: 'Contract Management App',
	Columns: [{
		type: 'FieldText',
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
} as SharePointListStruct;
var ContractorsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Contractors',
	type: "Generic List",
	Description: 'Contractors List in Contracts App',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'ContractCN',
			LookupListId: {
				listName: "Contracts"
			} as any,
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
} as SharePointListStruct;
var ProjectsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Projects',
	type: "Generic List",
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
} as SharePointListStruct;


spDB.thisLists.push(ContractList);
spDB.thisLists.push(ContractorsList);
spDB.thisLists.push(ProjectsList);