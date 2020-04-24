import * as $ from "jquery";
import * as spa from "../../spa.spEnv";
import * as spCRUD from "../../spa.spCRUD";
import * as toastr from "toastr"; 

var appTemplate = {
    sendToPerson: require("./templates/sendToPerson.hbs")
};

var DcMainWork = <spaLoadListStruct>{};
{
    DcMainWork.name = "WORK";
    DcMainWork.tabTitle = "Document Clearance Flow";
    DcMainWork.sectionName = "Approval/Review Area";
    DcMainWork.condition = "DCMain eq {{ID}}";
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

                    //$('.modal[data-owner="dcmain"] .send-to-person').unbind('click', thisFunction);
                    //$('.modal[data-owner="dcmain"] .send-to-person').bind('click', thisFunction);     
                    $('.modal[data-owner="dcmain"]').off('click', '.send-to-person', thisFunction);
                    $('.modal[data-owner="dcmain"]').on('click', '.send-to-person', thisFunction)
                }
            } as spaRepeatableOverload
        ]
    }
    DcMainWork.repeatable = repeatableWork;
    DcMainWork.wholeForm = false;
    DcMainWork.columns = {
        visible: ["RoleType", "RoleUser", "Participant", "Status", "DateOfDecision"],
        hidden: ["Title", "DCMain", "Sequence"],
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

var DCMainNotes = <spaLoadListStruct>{};
{
    DCMainNotes.hidden = true;
    DCMainNotes.name = "Note";
    DCMainNotes.sectionName = "Notes";
    DCMainNotes.singular = "Note Entry";
    DCMainNotes.condition = "DCMain eq {{ID}}";
    var repeatableNote = <spaRepeatable>{};
    {
        repeatableNote.enable = true;
        repeatableNote.hasSequence = false;
    }
    DCMainNotes.repeatable = repeatableNote;
    DCMainNotes.metaDataVisible = true;
    DCMainNotes.wholeForm = false;
    DCMainNotes.availableParent = ["edit"];
    DCMainNotes.dataEditable = false;
    DCMainNotes.columns = {
        visible: ["NoteEntry"],
        hidden: ["Title", "DCMain", "Sequence", "CurrentStatus"],
        readOnly: []
    };
    DCMainNotes.form = {
        columns: [{
            name: "NoteEntry",
            bootstrapGridOverride: {
                class: "col-md-12"
            },
            css: {}
        }]
    };
    DCMainNotes.table = {
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
    DCMainNotes.search = [""];
};

var DCMainChildren = [];
DCMainChildren.push(DcMainWork);
DCMainChildren.push(DCMainNotes);

var DCMain = <spaLoadListStruct>{};
{
    DCMain.name = "DCMain";
    DCMain.tabTitle = "Document Clearance";
    DCMain.search = [""];
    DCMain.singular = "Document Clearance";
    DCMain.columns = {
        visible: [],
        hidden: ["Title"],
        readOnly: ["CurrentPerson", "CurrentStatus"]
    };
    DCMain.table = {
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
    DCMain.children = DCMainChildren;
};

var Priorities = <spaLoadListStruct>{};
{
    Priorities.name = "P11";
    Priorities.tabTitle = "Clearance Priorities";
    Priorities.search = [""];
    Priorities.singular = "Clearance Priority";
    Priorities.config = true;
};

var Sources = <spaLoadListStruct>{};
{
    Sources.name = "S11";
    Sources.tabTitle = "Clearance Sources";
    Sources.search = [""];
    Sources.singular = "Clearance Source";
    Sources.config = true;
};

var Marking = <spaLoadListStruct>{};
{
    Marking.name = "M11";
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
    DocStatus.name = "ST11";
    DocStatus.tabTitle = "Doc Status";
    DocStatus.search = [""];
    DocStatus.singular = "Document Status";
    DocStatus.config = true;
};

var RoleTypes = <spaLoadListStruct>{};
{
    RoleTypes.name = "UT11";
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
    DCMain,
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

