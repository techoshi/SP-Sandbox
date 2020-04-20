import * as $ from "jquery";
import * as spCRUD from"../../spa.spCRUD";

var Offices = <spaLoadListStruct>{};
{
    Offices.name = 'Offices';
    Offices.search = ['Office_Name'];
    Offices.singular = 'Office';
    Offices.path = _spPageContextInfo.webAbsoluteUrl;
};

var Divisions = <spaLoadListStruct>{};
{
    Divisions.name = 'Divisions';
    Divisions.search = ['Division_Name'];
    Divisions.singular = 'Division';
};

var Positions = <spaLoadListStruct>{};
{
    Positions.name = 'Positions';
    Positions.search = ['Position_Title'];
    Positions.singular = 'Position';
};

var Billets = <spaLoadListStruct>{};
{
    Billets.name = 'Billets';
    Billets.singular = 'Billet';
    Billets.relationships = [
        { parent: 'Office', child: 'Division', lookupField: 'Division' }
    ];
};

var Duties = <spaLoadListStruct>{};
{
    Duties.name = 'Duties';
    Duties.singular = 'Duty';
    Duties.relationships = [
        { parent: 'Office', child: 'Division', lookupField: 'Division' },
        { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' }
    ];
};

var Activities = <spaLoadListStruct>{};
{
    Activities.name = 'Activities';
    Activities.singular = 'Activity';
    Activities.relationships = [
        { parent: 'Office', child: 'Division', lookupField: 'Division' },
        { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
        { parent: 'Billet', child: 'Duty' }
    ];
};

var Procedures = <spaLoadListStruct>{};
{
    Procedures.name = 'Procedures';
    Procedures.singular = 'Procedure';
    Procedures.relationships = [
        { parent: 'Office', child: 'Division', lookupField: 'Division' },
        { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
        { parent: 'Billet', child: 'Duty', lookupField: 'Duty' },
        { parent: 'Duty', child: 'Activity' }
    ];
};

var Personnel = <spaLoadListStruct>{};
{
    Personnel.name = 'Personnel';
    Personnel.singular = 'Person';
    Personnel.relationships = [
        { parent: 'Office', child: 'Division', lookupField: 'Division' },
        { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
        { parent: 'Billet', child: 'Duty' }
    ];
};

var spLists = [
    Offices,
    Divisions,
    Positions,
    Billets,
    Duties,
    Activities,
    Procedures,
    Personnel
];

$(document).ready(function () {

    spCRUD.spCRUD.clear({});

    spCRUD.spCRUD.getList({
        objects: spLists
    });
});

