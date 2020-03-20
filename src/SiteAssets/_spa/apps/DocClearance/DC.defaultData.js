function getStatusData() {
    return {
        listName: 'ST11',
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
        listName: 'UT11',
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
        listName: 'P11',
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
        listName: 'S11',
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
        listName: 'M11',
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

function loadAppData()
{
    $.fn.spDB.loadData(getStatusData());
    $.fn.spDB.loadData(getRoles());
    $.fn.spDB.loadData(getPriorities());
    $.fn.spDB.loadData(getSources());
    $.fn.spDB.loadData(getMarkings());
}