import * as $ from "jquery";
import * as spa from "../../spa.spEnv";
import * as spCRUD from "../../spa.spCRUD";
import * as toastr from "toastr"; 

var appTemplate = {
    sendToPerson: require("./templates/sendToPerson.hbs")
};

var DcMainWork = <spaLoadListStruct>{};
{
    DcMainWork.name = "DocumentClearanceWork";
    DcMainWork.tabTitle = "Document Clearance Flow";
    DcMainWork.sectionName = "Approval/Review Area";
    DcMainWork.condition = "DocumentClearance eq {{ID}}";
    var repeatableWork = <spaRepeatable>{};
    {
        repeatableWork.enable = true;
        repeatableWork.hasSequence = true;
        repeatableWork.hasActive = true,
        repeatableWork.overloads = [
            {
                html: appTemplate.sendToPerson(),
                bind: function() {

                    function thisFunction() { toastr.success('Clicked'); };
 
                    $('.modal[data-owner="documentclearance"]').off('click', '.send-to-person', thisFunction);
                    $('.modal[data-owner="documentclearance"]').on('click', '.send-to-person', thisFunction)
                }
            } as spaRepeatableOverload
        ]
    }
    DcMainWork.repeatable = repeatableWork;
    DcMainWork.wholeForm = false;
    DcMainWork.columns = {
        visible: ["RoleType", "RoleUser", "Participant", "Status", "DateOfDecision"],
        hidden: ["Title", "DocumentClearance", "Sequence"],
        readOnly: ["DateOfDecision"]
    };
    DcMainWork.availableParent = ["edit"];
    DcMainWork.singular = "Participant";
    DcMainWork.hidden = true;
    DcMainWork.table = {
        css: {
            "width": "200px",
            "min-width": "200px"
        },
        columns: [{
            name: "Title",
            css: {
                "width": "300px",
                "min-width": "300px"
            }
        }]
    };
    DcMainWork.search = [""];
};

var DocumentClearanceNotes = <spaLoadListStruct>{};
{
    DocumentClearanceNotes.hidden = true;
    DocumentClearanceNotes.name = "DocClearanceNote";
    DocumentClearanceNotes.sectionName = "Notes";
    DocumentClearanceNotes.singular = "Note Entry";
    DocumentClearanceNotes.condition = "DocumentClearance eq {{ID}}";
    var repeatableNote = <spaRepeatable>{};
    {
        repeatableNote.enable = true;
        repeatableNote.hasSequence = false;
    }
    DocumentClearanceNotes.repeatable = repeatableNote;
    DocumentClearanceNotes.metaDataVisible = true;
    DocumentClearanceNotes.wholeForm = false;
    DocumentClearanceNotes.availableParent = ["edit"];
    DocumentClearanceNotes.dataEditable = false;
    DocumentClearanceNotes.columns = {
        visible: ["NoteEntry"],
        hidden: ["Title", "DocumentClearance", "Sequence", "CurrentStatus"],
        readOnly: []
    };
    DocumentClearanceNotes.form = {
        columns: [{
            name: "NoteEntry",
            bootstrapGridOverride: {
                class: "col-md-12"
            },
            css: {}
        }]
    };
    DocumentClearanceNotes.table = {
        css: {
            "width": "200px",
            "min-width": "200px"
        },
        columns: [{
            name: "Title",
            css: {
                "width": "300px",
                "min-width": "300px"
            }
        }]
    };
    DocumentClearanceNotes.search = [""];
};

var DocumentClearanceChildren = [];
DocumentClearanceChildren.push(DcMainWork);
DocumentClearanceChildren.push(DocumentClearanceNotes);

var DocumentClearance = <spaLoadListStruct>{};
{
    DocumentClearance.name = "DocumentClearance";
    DocumentClearance.tabTitle = "Document Clearance";
    DocumentClearance.search = [""];
    DocumentClearance.singular = "Document Clearance";
    DocumentClearance.columns = {
        visible: [],
        hidden: ["Title"],
        readOnly: ["CurrentPerson", "CurrentStatus"]
    };
    DocumentClearance.table = {
        css: {
            "width": "200px",
            "min-width": "200px"
        },
        columns: [{
            name: "Title",
            css: {
                "width": "300px",
                "min-width": "300px"
            }
        }]
    };
    DocumentClearance.children = DocumentClearanceChildren;
};

var Priorities = <spaLoadListStruct>{};
{
    Priorities.name = "DocClearancePriorities";
    Priorities.tabTitle = "Clearance Priorities";
    Priorities.search = [""];
    Priorities.singular = "Clearance Priority";
    Priorities.config = true;
};

var Sources = <spaLoadListStruct>{};
{
    Sources.name = "DocClearanceSources";
    Sources.tabTitle = "Clearance Sources";
    Sources.search = [""];
    Sources.singular = "Clearance Source";
    Sources.config = true;
};

var Marking = <spaLoadListStruct>{};
{
    Marking.name = "DocClearanceMarkings";
    Marking.tabTitle = "Markings";
    Marking.search = [""];
    Marking.singular = "Marking";
    Marking.config = true;
};

var PortfolioCat = <spaLoadListStruct>{};
{
    PortfolioCat.name = "PC11";
    PortfolioCat.tabTitle = "Portfolio Categories";
    PortfolioCat.search = [""];
    PortfolioCat.singular = "Portfolio Category";
    PortfolioCat.config = true;
};

var LeadPortfolio = <spaLoadListStruct>{};
{
    LeadPortfolio.name = "LP11";
    LeadPortfolio.tabTitle = "Lead Portfolios";
    LeadPortfolio.search = [""];
    LeadPortfolio.singular = "Lead Portfolio";
    LeadPortfolio.config = true;
};

var DocStatus = <spaLoadListStruct>{};
{
    DocStatus.name = "DocClearanceTypes";
    DocStatus.tabTitle = "Doc Status";
    DocStatus.search = [""];
    DocStatus.singular = "Document Status";
    DocStatus.config = true;
};

var RoleTypes = <spaLoadListStruct>{};
{
    RoleTypes.name = "DocClearanceRoles";
    RoleTypes.tabTitle = "Role Types";
    RoleTypes.search = [""];
    RoleTypes.singular = "Role Type";
    RoleTypes.config = true;
};

var Participants = <spaLoadListStruct>{};
{
    Participants.name = "RU11";
    Participants.tabTitle = "Role Users";
    Participants.search = [""];
    Participants.singular = "Role User";
    Participants.config = true;
};

var spLists = [
    DocumentClearance,
    Priorities,
    Sources,
    Marking,
    PortfolioCat,
    LeadPortfolio,
    DocStatus,
    RoleTypes,
    Participants
]

$(document).ready(function () {

    spCRUD.spCRUD.clear({});

    spCRUD.spCRUD.getList({
        objects: spLists
    });
});

