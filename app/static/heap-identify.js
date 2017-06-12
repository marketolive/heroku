var APP = APP || {};

/**************************************************************************************
 *
 *  This function gets the specified cookie for the current domain. It loops through
 *  the string contained in document.cookie and looks for the given cookie.
 *
 *  @Author Andrew Garcia
 *
 *  @function
 *
 *  @param {String} cookieName - Represents the key to search for inside document.cookie
 *
 **************************************************************************************/

APP.getCookie = function (cookieName) {
    console.log("Getting: Cookie " + cookieName);
    
    var name = cookieName + '=',
    cookies = document.cookie.split(';'),
    currCookie;
    
    for (var ii = 0; ii < cookies.length; ii++) {
        currCookie = cookies[ii].trim();
        if (currCookie.indexOf(name) == 0) {
            return currCookie.substring(name.length, currCookie.length);
        }
    }
    console.log("Getting: Cookie " + cookieName + " not found");
    return null;
};

/**************************************************************************************
 *
 *  This function identifies the user for Heap Analytics
 *
 *  @Author Brian Fisher
 *
 *  @function
 *
 **************************************************************************************/

APP.heapIdentify = function () {
    var isHeapAnalyticsForMarketoLive = window.setInterval(function () {
            if (typeof(heap) !== "undefined"
                 && heap
                 && heap.loaded) {
                
                window.clearInterval(isHeapAnalyticsForMarketoLive);
                
                var mktoUserId = APP.getCookie("mkto_user_id"),
                oneLoginEmail = APP.getCookie("onelogin_email"),
                oneLoginFirstName = APP.getCookie("onelogin_first_name"),
                oneLoginLastName = APP.getCookie("onelogin_last_name"),
                mktoName = APP.getCookie("mkto_name"),
                mktoRole = APP.getCookie("mkto_role");
                
                if (mktoUserId) {
                    heap.identify(mktoUserId);
                    console.log("Heap Analytics ID: " + mktoUserId);
                } else if (oneLoginEmail) {
                    heap.identify(oneLoginEmail);
                    console.log("Heap Analytics ID: " + oneLoginEmail);
                }
                
                if (oneLoginEmail) {
                    heap.addUserProperties({
                        Email: oneLoginEmail
                    });
                }
                
                if (oneLoginFirstName
                     && oneLoginLastName) {
                    heap.addUserProperties({
                        Name: oneLoginFirstName + " " + oneLoginLastName
                    });
                    console.log("Heap Analytics Name: " + oneLoginFirstName + " " + oneLoginLastName);
                } else if (mktoName) {
                    heap.addUserProperties({
                        Name: mktoName
                    });
                    console.log("Heap Analytics Name: " + mktoName);
                }
                
                if (mktoRole) {
                    heap.addUserProperties({
                        Role: mktoRole
                    });
                }
            }
        }, 0);
};

/**************************************************************************************
 *
 *  Main
 *
 **************************************************************************************/

APP.heapIdentify();