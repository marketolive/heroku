var prod = "3348268820",
dev = "3598597352",
env = prod,

HEAP = HEAP || {};

window.heap = window.heap || [], heap.load = function (e, t) {
    window.heap.appid = e,
    window.heap.config = t = t || {};
    var r = t.forceSSL || "https:" === document.location.protocol,
    a = document.createElement("script");
    a.type = "text/javascript",
    a.async = !0,
    a.src = (r ? "https:" : "http:") + "//cdn.heapanalytics.com/js/heap-" + e + ".js";
    var n = document.getElementsByTagName("script")[0];
    n.parentNode.insertBefore(a, n);
    for (var o = function (e) {
        return function () {
            heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
        }
    }, p = ["addEventProperties", "addUserProperties", "clearEventProperties", "identify", "removeEventProperty", "setEventProperties", "track", "unsetEventProperty"], c = 0; c < p.length; c++)
        heap[p[c]] = o(p[c])
};
heap.load(env);

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

HEAP.getCookie = function (cookieName) {
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

HEAP.identify = function () {
    var isHeapAnalyticsForMarketoLive = window.setInterval(function () {
            if (typeof(heap) !== "undefined"
                 && heap
                 && heap.loaded) {
                
                window.clearInterval(isHeapAnalyticsForMarketoLive);
                
                var mktoUserId = HEAP.getCookie("mkto_user_id"),
                oneLoginEmail = HEAP.getCookie("onelogin_email"),
                oneLoginFirstName = HEAP.getCookie("onelogin_first_name"),
                oneLoginLastName = HEAP.getCookie("onelogin_last_name"),
                mktoName = HEAP.getCookie("mkto_name"),
                mktoRole = HEAP.getCookie("mkto_role");
                
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

HEAP.identify();