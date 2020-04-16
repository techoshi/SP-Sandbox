import "../../spa.spEnv";
import * as spDB from "../../spa.spDB";

var DocClearanceList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'ST11',
	type: "Generic List",
	Description: 'Document Clearance Status',
	Columns: [{
		type: 'FieldText',
		Title: 'Status',
		MaxLength: 100
	}
	]
} as SharePointListStruct;
var UserTypes = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'UT11',
	type: "Generic List",
	Description: 'Document Clearance User Types',
	Columns: [{
		type: 'FieldText',
		Title: 'RoleType',
		MaxLength: 100
	},
	{
		type: 'FieldUser',
		Title: 'DefaultUser',
		AllowMultipleValues: false
	}
	]
} as SharePointListStruct;
var WorkflowList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'W11',
	type: "Generic List",
	Description: 'Document Clearance Workflow',
	Columns: [{
		type: 'FieldText',
		Title: 'WorkflowType',
		MaxLength: 100
	},]
} as SharePointListStruct;
var PrioritiesList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'P11',
	type: "Generic List",
	Description: 'Document Clearance Priorities',
	Columns: [{
		type: 'FieldText',
		Title: 'Priority',
		MaxLength: 100
	},]
} as SharePointListStruct;
var SourcesList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'S11',
	type: "Generic List",
	Description: 'Document Clearance Sources',
	Columns: [{
		type: 'FieldText',
		Title: 'Source',
		MaxLength: 100
	}]
} as SharePointListStruct;
var MarkingsList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'M11',
	type: "Generic List",
	Description: 'Document Markings',
	Columns: [{
		type: 'FieldText',
		Title: 'Marking',
		MaxLength: 100
	}]
} as SharePointListStruct;
var MainList = {
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
	// {
	// 	type: 'FieldLookup',
	// 	Title: 'WorkflowType',
	// 	LookupListId: {
	// 		listName: "W11"
	// 	},
	// 	AllowMultipleValues: false,
	// 	LookupFieldName: 'WorkflowType'
	// },
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
		type: 'FieldText',
		Title: 'CurrentPerson',
		DefaultValue: 'Not Assigned'
	},
	{
		type: 'FieldText',
		Title: 'CurrentStatus',
		DefaultValue: 'Pending'
	}
	]
} as SharePointListStruct;
var WorkList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'WORK',
	type: "Generic List",
	Description: 'Document Clearance WorkFlow',
	hasSequence : true,
	hasActive: true,
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'DCMain',
			LookupListId: {
				listName: "DCMain"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Title'
		},
		{
			type: 'FieldLookup',
			Title: 'RoleType',
			LookupListId: {
				listName: "UT11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'RoleType'
		},
		{
			type: 'FieldUser',
			Title: 'Participant',
			AllowMultipleValues: false,
		},
		{
			type: 'FieldLookup',
			Title: 'Status',
			LookupListId: {
				listName: "ST11"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Status'
		},
		{
			type: 'FieldDateTime',
			Title: 'DateOfDecision'
		}
	]
} as SharePointListStruct;
var NoteList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'Note',
	type: "Generic List",
	Description: 'Document Clearance WorkFlow',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'DCMain',
			LookupListId: {
				listName: "DCMain"
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Title'
		},
		{
			type: 'FieldText',
			Title: 'Sequence'
		},
		{
			type: 'FieldText',
			Title: 'CurrentStatus'
		},
		{
			type: 'FieldMultiLineText',
			Title: 'NoteEntry'
		},
	]
} as SharePointListStruct;

spDB.thisLists.push(DocClearanceList);
spDB.thisLists.push(UserTypes);
spDB.thisLists.push(WorkflowList);
spDB.thisLists.push(PrioritiesList);
spDB.thisLists.push(SourcesList);
spDB.thisLists.push(MarkingsList);
spDB.thisLists.push(MainList);
spDB.thisLists.push(WorkList);
spDB.thisLists.push(NoteList);

require("./DC.defaultData");
spDB.spDB.initUI();