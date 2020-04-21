import * as $ from "jquery";
import * as spCRUD from"../../spa.spCRUD";

var PastPerformance = <spaLoadListStruct>{};
{
    PastPerformance.name = 'PP';
    PastPerformance.search = ['Office_Name'];
    PastPerformance.singular = 'Past Performance';
    PastPerformance.tabTitle = "Past Performance";
    PastPerformance.path = _spPageContextInfo.webAbsoluteUrl;
};

var NAICS = <spaLoadListStruct>{};
{
    NAICS.name = 'NC';
    NAICS.search = [''];
    NAICS.singular = 'NAICS Code';
    NAICS.tabTitle = "NAICS Codes";
    NAICS.path = _spPageContextInfo.webAbsoluteUrl;
};

var PrimeContractor = <spaLoadListStruct>{};
{
    PrimeContractor.name = 'PC';
    PrimeContractor.search = [''];
    PrimeContractor.singular = 'Prime Contractor';
    PrimeContractor.tabTitle = "Prime Contractors";
    PrimeContractor.path = _spPageContextInfo.webAbsoluteUrl;
};

var spLists = [
    PastPerformance,
    NAICS,
    PrimeContractor
]

$(document).ready(function () {

    spCRUD.spCRUD.clear({});

    spCRUD.spCRUD.getList({
        objects: spLists
    });
});