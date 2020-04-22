import * as spDB from "../../spa.spDB";

function getPrimes() {
    return {
        name: 'PC',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [
            {
                "Title": "Prime",
                "PrimeContractor": "Eminent IT",
            },
            {
                "Title": "Prime",
                "PrimeContractor": "Lintech Global",
            },
            {
                "Title": "Prime",
                "PrimeContractor": "CACI",
            },
            {
                "Title": "Prime",
                "PrimeContractor": "Buchanon & Edwards",
            },
            {
                "Title": "Prime",
                "PrimeContractor": "Lisa Consulting",
            }
        ]
    };
}

function getNaics() {
    return {
        name: 'NC',
        path: _spPageContextInfo.webAbsoluteUrl,
        baseTemplate: "100",
        data: [
            {
                "Title": "518210 - Data Processing, Hosting, and Related Services",
                "NaicsCode": "518210",
            },
            {
                "Title": "519190 - All Other Information Services",
                "NaicsCode": "519190",
            },
            {
                "Title": "541430 - Graphic Design Services",
                "NaicsCode": "541430",
            },
            {
                "Title": "541511 - Custom Computer Programming",
                "NaicsCode": "541511",
            },
            {
                "Title": "541512 - Computer System Design Services",
                "NaicsCode": "541512",
            },
            {
                "Title": "541513 - Computer Facilities Management Services",
                "NaicsCode": "541513",
            },
            {
                "Title": "541519 - Other Computer Related Services",
                "NaicsCode": "541519",
            },
            {
                "Title": "561110 - Office Administrative Services",
                "NaicsCode": "561110",
            },
            {
                "Title": "611420 - Computer Training",
                "NaicsCode": "611420",
            }
        ]
    };
}

spDB.thisDataLists.push(getPrimes());
spDB.thisDataLists.push(getNaics());