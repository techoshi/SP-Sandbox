import * as $ from "jquery";
import "../../polyfills";
import * as spEnv from "../../spa.spEnv";
import "../../spa.spCRUD";
import "../../dt-helper";
import "../../matth.uuid";
import "select2"

$(document).ready(function () {

    spEnv.$pa.spCRUD.clear({});

    spEnv.$pa.spCRUD.getList({

        objects: [            

            { name: 'Offices', search: ['Office_Name'], singular: 'Office', path: _spPageContextInfo.webAbsoluteUrl },
            { name: 'Divisions', search: ['Division_Name'], singular: 'Division' },
            { name: 'Positions', search: ['Position_Title'], singular: 'Position' },
            {
                name: 'Billets', singular: 'Billet',
                relationships: [
                    { parent: 'Office', child: 'Division', lookupField: 'Division' } 
                ]
            },
            {
                name: 'Duties', singular: 'Duty',
                relationships: [
                    { parent: 'Office', child: 'Division', lookupField: 'Division' },
                    { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' }
                ]
            },
            {
                name: 'Activities', singular: 'Activity',
                relationships: [
                    { parent: 'Office', child: 'Division', lookupField: 'Division' },
                    { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
                    { parent: 'Billet', child: 'Duty' }
                ]
            },
            {
                name: 'Procedures', singular: 'Procedure', relationships: [
                    { parent: 'Office', child: 'Division', lookupField: 'Division' },
                    { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
                    { parent: 'Billet', child: 'Duty', lookupField: 'Duty' },
                    { parent: 'Duty', child: 'Activity' }
                ]
            },
            {
                name: 'Personnel', singular: 'Person',
                relationships: [
                    { parent: 'Office', child: 'Division', lookupField: 'Division' },
                    { parent: 'Division', child: 'Billet', lookupField: 'BilletIdentifier' },
                    { parent: 'Billet', child: 'Duty' }
                ]
            }
        ]
    });
});

