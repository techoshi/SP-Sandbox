import * as spDB from "../../spa.spDB";

function getStatusData() {
    return {
        name: 'DocClearanceTypes',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [{
                "Title": "Pending",
                "Status": "Pending",
            },
            {
                "Title": "Approved",
                "Status": "Approved",
            },
            {
                "Title": "Denied",
                "Status": "Denied",
            }
        ]
    };
}

function getRoles() {
    return {
        name: 'DocClearanceRoles',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [{
                "Title": "Lead Analyst",
                "RoleType": "Lead Analyst",
            },
            {
                "Title": "Peer Reviewer",
                "RoleType": "Peer Reviewer",
            },
            {
                "Title": "PA Manager",
                "RoleType": "PA Manager",
            },
            {
                "Title": "FCR Manager",
                "RoleType": "FCR Manager",
            },
            {
                "Title": "OBA Manager",
                "RoleType": "OBA Manager",
            },
            {
                "Title": "SRO Manager",
                "RoleType": "SRO Manager",
            },
            {
                "Title": "OA Manager",
                "RoleType": "OA Manager",
            },
            {
                "Title": "PSP Manager",
                "RoleType": "PSP Manager",
            },
            {
                "Title": "PRE Manager",
                "RoleType": "PRE Manager",
            },
            {
                "Title": "OBA Director",
                "RoleType": "OBA Director",
            },
            {
                "Title": "RPBI Director",
                "RoleType": "RPBI Director",
            },
            {
                "Title": "OPP Director",
                "RoleType": "OPP Director",
            },
            {
                "Title": "BP Director",
                "RoleType": "BP Director",
            }
        ]
    };
}

function getPriorities() {
    return {
        name: 'DocClearancePriorities',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [{
                "Title": "Routine",
                "Priority": "Routine",
            },
            {
                "Title": "Urgent",
                "Priority": "Urgent",
            },
            {
                "Title": "Low",
                "Priority": "Low",
            }
        ]
    };
}

function getSources() {
    return {
        name: 'DocClearanceSources',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [{
                "Title": "BP Clearances",
                "Source": "BP Clearances",
            },
            {
                "Title": "Email",
                "Source": "Email",
            },
            {
                "Title": "Fax",
                "Source": "Fax",
            },
            {
                "Title": "Other",
                "Source": "Other",
            }
        ]
    };
}

function getMarkings() {
    return {
        name: 'DocClearanceMarkings',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [
            {
                "Title": "Official",
                "Marking": "Official",
            },
            {
                "Title": "Official - SBU",
                "Marking": "Official - SBU",
            },
            {
                "Title": "Official - Privacy/PII",
                "Marking": "Official - Privacy/PII",
            },
            {
                "Title": "Official - Transitory",
                "Marking": "Official - Transitory",
            }
        ]
    };
}

spDB.thisDataLists.push(getStatusData());
spDB.thisDataLists.push(getRoles());
spDB.thisDataLists.push(getPriorities());
spDB.thisDataLists.push(getSources());
spDB.thisDataLists.push(getMarkings());