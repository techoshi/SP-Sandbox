$.fn.spAsyncQueue = (function () {

    var PendingRequests = [];
    var waitingForRequest = true;

    function addCall(m) {
        PendingRequests.push({
            loaded: false,
            call: m
        });
    }

    var ajaxCallsID = window.setInterval(function () {

        if (waitingForRequest) {
            waitingForRequest = false;

            PendingRequests = _.filter(PendingRequests, function (o) { return o.loaded == undefined || o.loaded == false; });

            if (PendingRequests.length > 0) {
                theLoader.show({ id: 'async-loader' });
                spRest(PendingRequests[0].call)
            }
            else {
                theLoader.hide({ id: 'async-loader' });
                waitingForRequest = true;
            }
        }
    }, 50)

    function spRest(m) {

        var headers = m.headers != undefined ? m.headers : {};
        headers["accept"] = "application/json;odata=verbose"; //It defines the Data format   
        headers["content-type"] = "application/json;odata=verbose"; //It defines the content type as JSON  
        headers["X-RequestDigest"] = $("#__REQUESTDIGEST").val(); //It gets the digest value           		

        var ajaxReturn = $.ajax({
            method: m.method,
            url: m.url,
            data: m.data,
            async: m.async != undefined ? m.async : true,
            processData: m.processData != undefined ? m.processData : true,
            headers: headers,
            retryLimit: m.retryLimit != undefined ? m.retryLimit : 0,
            tryCount: m.tryCount != undefined ? m.tryCount : 0,
        })
            .done(function (response, textStatus, request) {

                if (request.getResponseHeader('X-RequestDigest')) {
                    $('#__REQUESTDIGEST').val();
                }

                if (typeof m.done == 'function') {
                    m.done(response);
                }
            })
            .fail(function (response, errorCode, errotMessage) {
                if (typeof m.fail == 'function') {
                    m.fail(response, errorCode, errotMessage);
                }
            })
            .always(function (response, textStatus, request) {
                //Nothing
                if (typeof m.always == 'function') {
                    m.always(response);
                }

                if (PendingRequests.length > 0) {
                    PendingRequests[0].loaded = true;
                }
                waitingForRequest = true;
            });

        if (m.async == false && ajaxReturn.statusText == 'OK') {
            return ajaxReturn.responseJSON;
        }
    }

    return {
        call: function (m) {
            return addCall(m);
        },
        queue: function () {
            return PendingRequests;
        }
    }
})();	
