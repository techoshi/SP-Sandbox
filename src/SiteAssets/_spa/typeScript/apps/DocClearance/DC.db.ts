import "../../spa.spEnv";
import * as spDB from "../../spa.spDB";

var DocClearanceList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'DocClearanceTypes',
	type: "Generic List",
	Description: 'Document Clearance Status',
	Columns: [{
		type: 'FieldText',
		Title: 'Status',
		MaxLength: 100
	}
	]
} as SharePointListStruct;
var RoleTypes = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'DocClearanceRoles',
	type: "Generic List",
	Description: 'Document Clearance User Types',
	Columns: [
		{
			type: 'FieldText',
			Title: 'RoleType',
			MaxLength: 100
		},
		{
			type: 'FieldUser',
			Title: 'Participant'
		}
	]
} as SharePointListStruct;


var WorkflowList = {
	url: _spPageContextInfo.webAbsoluteUrl,
	Title: 'DocClearanceWFTypes',
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
	Title: 'DocClearancePriorities',
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
	Title: 'DocClearanceSources',
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
	Title: "DocClearanceMarkings",
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
	Title: 'DocumentClearance',
	type: "Document Library",
	Description: 'Document Clearance App',
	Columns: [{
		type: 'FieldLookup',
		Title: 'Priority',
		LookupListId: {
			listName: PrioritiesList.Title
		},
		AllowMultipleValues: false,
		LookupFieldName: 'Priority'
	},
	// {
	// 	type: 'FieldLookup',
	// 	Title: 'WorkflowType',
	// 	LookupListId: {
	// 		listName: WorkflowList.Title
	// 	},
	// 	AllowMultipleValues: false,
	// 	LookupFieldName: 'WorkflowType'
	// },
	{
		type: 'FieldLookup',
		Title: 'Source',
		LookupListId: {
			listName: SourcesList.Title
		},
		AllowMultipleValues: false,
		LookupFieldName: 'Source'
	},
	{
		type: 'FieldLookup',
		Title: 'Marking',
		LookupListId: {
			listName: MarkingsList.Title
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
	Title: 'DocumentClearanceWork',
	type: "Generic List",
	Description: 'Document Clearance WorkFlow',
	hasSequence: true,
	hasActive: true,
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'DocumentClearance',
			LookupListId: {
				listName: MainList.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'Title'
		},
		{
			type: 'FieldLookup',
			Title: 'RoleType',
			LookupListId: {
				listName: RoleTypes.Title
			},
			AllowMultipleValues: false,
			LookupFieldName: 'RoleType'
		},
		{
			type: 'FieldUser',
			Title: 'Participant'
		},		
		{
			type: 'FieldLookup',
			Title: 'Status',
			LookupListId: {
				listName: DocClearanceList.Title
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
	Title: "DocClearanceNote",
	type: "Generic List",
	Description: 'Document Clearance WorkFlow',
	Columns: [
		{
			type: 'FieldLookup',
			Title: 'DocumentClearance',
			LookupListId: {
				listName: MainList.Title
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
spDB.thisLists.push(RoleTypes);
spDB.thisLists.push(WorkflowList);
spDB.thisLists.push(PrioritiesList);
spDB.thisLists.push(SourcesList);
spDB.thisLists.push(MarkingsList);
spDB.thisLists.push(MainList);
spDB.thisLists.push(WorkList);
spDB.thisLists.push(NoteList);

require("./DC.defaultData");
spDB.spDB.initUI();