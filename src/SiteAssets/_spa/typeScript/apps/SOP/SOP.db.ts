import "../../spa.spEnv";
import * as spDB from "../../spa.spDB";

var OfficeList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Offices',
	type: "Generic List",
	Description: 'List of Offices',
	Columns: [{
		type: 'FieldText',
		Title: 'Office',
		MaxLength: 100
	},
	{
		type: 'FieldText',
		Title: 'OfficeName',
		MaxLength: 100
	}
	]
} as SharePointListStruct;

var DivisionsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Divisions',
	type: "Generic List",
	Description: 'List of Divisions',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldText',
			Title: 'Division',
			MaxLength: 100
		},
		{
			type: 'FieldText',
			Title: 'DivisionName',
			MaxLength: 100
		}
	]
} as SharePointListStruct;

var PositionsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Positions',
	type: "Generic List",
	Description: 'List of Divisions',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldText',
			Title: 'PositionName',
			MaxLength: 100
		}
	]
} as SharePointListStruct;

var BilletsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Billets',
	type: "Generic List",
	Description: 'List of Divisions',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldLookup',
			Title: 'PositionName',
			LookupListId: {
				listName: PositionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'PositionName'
		},
		{
			type: 'FieldText',
			Title: 'BilletName',
			MaxLength: 100
		},{
			type: 'FieldText',
			Title: 'BilletIdentifier',
			MaxLength: 100
		}
	]
} as SharePointListStruct;

var DutiesList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Duties',
	type: "Generic List",
	Description: 'List of Divisions',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldLookup',
			Title: 'BilletName',
			LookupListId: {
				listName: BilletsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'BilletName'
		},
		{
			type: 'FieldText',
			Title: 'DutyName',
			MaxLength: 100
		},
		{
			type: 'FieldMultiLineText',
			Title: 'DutyDescription'
		}
	]
} as SharePointListStruct;

var ActivitiesList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Activities',
	type: "Generic List",
	Description: 'List of Activities',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldLookup',
			Title: 'BilletName',
			LookupListId: {
				listName: BilletsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'BilletName'
		},
		{
			type: 'FieldLookup',
			Title: 'DutyName',
			LookupListId: {
				listName: DutiesList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DutyName'
		},
		{
			type: 'FieldText',
			Title: 'ActivityName',
			MaxLength: 100
		},
		{
			type: 'FieldMultiLineText',
			Title: 'ActivityDescription'
		}
	]
} as SharePointListStruct;

var ProceduresList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Procedures',
	type: "Document Library",
	Description: 'Library of Procedures',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldLookup',
			Title: 'BilletName',
			LookupListId: {
				listName: BilletsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'BilletName'
		},
		{
			type: 'FieldLookup',
			Title: 'DutyName',
			LookupListId: {
				listName: DutiesList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DutyName'
		},
		{
			type: 'FieldLookup',
			Title: 'ActivityName',
			LookupListId: {
				listName: ActivitiesList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'ActivityName'
		}
	]
} as SharePointListStruct;

var PersonnelList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Personnel',
	type: "Generic List",
	Description: 'List of Divisions',
	Columns: [
		{
			type: 'FieldUser',
			Title: 'Person',
			AllowMultipleValues: false
		},
		{
			type: 'FieldLookup',
			Title: 'OfficeName',
			LookupListId: {
				listName: OfficeList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'OfficeName'
		},
		{
			type: 'FieldLookup',
			Title: 'DivisionName',
			LookupListId: {
				listName: DivisionsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'DivisionName'
		},
		{
			type: 'FieldLookup',
			Title: 'BilletName',
			LookupListId: {
				listName: BilletsList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'BilletName'
		},
	]
} as SharePointListStruct;

spDB.thisLists.push(OfficeList);
spDB.thisLists.push(DivisionsList);
spDB.thisLists.push(PositionsList);
spDB.thisLists.push(DutiesList);
spDB.thisLists.push(ActivitiesList);
spDB.thisLists.push(ProceduresList);
spDB.thisLists.push(PersonnelList);