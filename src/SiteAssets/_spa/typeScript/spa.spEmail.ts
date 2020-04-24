import * as spCommon from "./spa.spCommon";

export var spEmail = (function () {
    function sendEmail(m: any) {
        //Get the relative url of the site
        var siteurl = _spPageContextInfo.webServerRelativeUrl;
        var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";

        var emailStruct = {
            'properties': {
                '__metadata': {
                    'type': 'SP.Utilities.EmailProperties'
                },
                'From': m.from,
                'To': {
                    'results': [m.to]
                },
                'Body': m.body,
                'Subject': m.subject
            }
        }

        var ajaxEmailStruct = {
            url: urlTemplate,
            method: "POST",
            data: JSON.stringify(emailStruct),
            headers: {},
            done: function (data: any) {
                alert('Email Sent Successfully');
            },
            fail: function (err: any) {
                alert('Error in sending Email: ' + JSON.stringify(err));
            }
        }

        spCommon.spCommon.ajax(ajaxEmailStruct);        
    }

    return {
        send: function (m: any) {
            sendEmail(m);
        }
    }
})();