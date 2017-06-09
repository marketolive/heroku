var mktoLive106MunchkinId = "026-COU-482",
webPages = [
    "/info/community",
    "/info/contact-us",
    "/info/data-sheets",
    "/info/integrations",
    "/info/live-event",
    "/info/pricing",
    "/info/products",
    "/info/webinar",
    "/info/whitepapers",
    "/info/why-us",
    "/are-you-abm-ready.html",
    "/top5-abm-themes.html",
    "/marketers-can-benefit-from-abm.html",
    "/sirius-abm-2016-state.html",
    "/account-based-nurturing.html",
    "/get-it-right-with-abm.html",
    "/blog/accelerate-your-sales.html",
    "/solutions/lead-management.html",
    "/solutions/abm.html",
    "/blog/digital-marketing-financial",
    "/top5-digital-engagement-themes.html",
    "/reboot-europe-tech-industry.html"
],
abm106AcmeLeads = [
    "mktodemosvcs+1142@gmail.com",
    "mktodemosvcs+1143@gmail.com",
    "mktodemosvcs+1144@gmail.com",
    "mktodemosvcs+1145@gmail.com",
    "mktodemosvcs+1146@gmail.com",
    "mktodemosvcs+1147@gmail.com",
    "mktodemosvcs+1148@gmail.com",
    "mktodemosvcs+1149@gmail.com",
    "mktodemosvcs+1150@gmail.com",
    "mktodemosvcs+1151@gmail.com",
    "mktodemosvcs+1152@gmail.com",
    "mktodemosvcs+1153@gmail.com",
    "mktodemosvcs+1154@gmail.com",
    "mktodemosvcs+1155@gmail.com",
    "mktodemosvcs+1156@gmail.com",
    "mktodemosvcs+1157@gmail.com",
    "mktodemosvcs+1158@gmail.com",
    "mktodemosvcs+1159@gmail.com",
    "mktodemosvcs+1160@gmail.com",
    "mktodemosvcs+1161@gmail.com",
    "mktodemosvcs+1162@gmail.com",
    "mktodemosvcs+1163@gmail.com",
    "mktodemosvcs+1164@gmail.com",
    "mktodemosvcs+1165@gmail.com",
    "mktodemosvcs+1166@gmail.com",
    "mktodemosvcs+1167@gmail.com",
    "mktodemosvcs+1168@gmail.com",
    "mktodemosvcs+1169@gmail.com",
    "mktodemosvcs+1170@gmail.com",
    "mktodemosvcs+1171@gmail.com",
    "mktodemosvcs+1172@gmail.com",
    "mktodemosvcs+1173@gmail.com",
    "mktodemosvcs+1174@gmail.com",
    "mktodemosvcs+1175@gmail.com",
    "mktodemosvcs+1176@gmail.com",
    "mktodemosvcs+1177@gmail.com",
    "mktodemosvcs+1178@gmail.com",
    "mktodemosvcs+1179@gmail.com",
    "mktodemosvcs+1180@gmail.com",
    "mktodemosvcs+1181@gmail.com",
    "mktodemosvcs+1182@gmail.com",
    "mktodemosvcs+1183@gmail.com",
    "mktodemosvcs+1184@gmail.com",
    "mktodemosvcs+1185@gmail.com",
    "mktodemosvcs+1186@gmail.com",
    "mktodemosvcs+1187@gmail.com",
    "mktodemosvcs+1188@gmail.com",
    "mktodemosvcs+1189@gmail.com",
    "mktodemosvcs+1190@gmail.com",
    "mktodemosvcs+1191@gmail.com",
    "mktodemosvcs+1192@gmail.com",
    "mktodemosvcs+1193@gmail.com",
    "mktodemosvcs+1194@gmail.com",
    "mktodemosvcs+1195@gmail.com",
    "mktodemosvcs+1196@gmail.com",
    "mktodemosvcs+1197@gmail.com",
    "mktodemosvcs+1198@gmail.com",
    "mktodemosvcs+1199@gmail.com",
    "mktodemosvcs+1200@gmail.com",
    "mktodemosvcs+1201@gmail.com",
    "mktodemosvcs+1111@gmail.com",
    "jerry.smith@marketolive.com",
    "rob.lam@marketolive.com",
    "mktodemosvcs+1203@gmail.com"
];

(function () {
    var didInit = false,
    s,
    origMunchkinInit,
    origMunckinFunction,
    origCookie;
    
    function getCookie(cookieName) {
        console.log("Getting > Cookie: " + cookieName);
        
        var name = cookieName + '=',
        cookies = document.cookie.split(';'),
        currCookie;
        
        for (var ii = 0; ii < cookies.length; ii++) {
            currCookie = cookies[ii].trim();
            if (currCookie.indexOf(name) == 0) {
                return currCookie.substring(name.length, currCookie.length);
            }
        }
        console.log("Getting > Cookie: " + cookieName + " not found");
        return null;
    }
    
    function webRequest(url, params, method, async, responseType, callback) {
        console.log("Web Request > " + url + "\n" + params);
        var xmlHttp = new XMLHttpRequest(),
        result;
        xmlHttp.onreadystatechange = function () {
            if (callback
                 && xmlHttp.readyState == 4
                 && xmlHttp.status == 200)
                result = callback(xmlHttp.response);
        }
        if (async
             && xmlHttp.responseType) {
            xmlHttp.responseType = responseType;
        }
        xmlHttp.open(method, url, async); // true for asynchronous
        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
        //xmlHttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlHttp.send(params);
        return result;
    }
    
    function overloadMunchkinInit() {
        if (typeof(origMunchkinInit) !== "function") {
            origMunchkinInit = Munchkin.init;
        }
        
        Munchkin.init = function (b, a, callback) {
            origMunchkinInit.apply(this, arguments);
            console.log("Loaded > Munchkin Tag");
            callback();
        };
    }
    
    function overloadMunchkinFunction() {
        if (typeof(origMunckinFunction) !== "function") {
            origMunckinFunction = Munchkin.munchkinFunction;
        }
        
        Munchkin.munchkinFunction = function (b, a, c, callback) {
            origMunckinFunction.apply(this, arguments);
            console.log("Completed > Munchkin Function");
            callback();
        };
    }
    
    function resetMunchkinCookie(munchkinId, callback) {
        if (!origCookie) {
            var currCookie = getCookie("_mkto_trk");
            
            if (currCookie) {
                origCookie = currCookie;
            }
        }
        document.cookie = "_mkto_trk=;domain=" + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        console.log("Removed > Cookie: _mkto_trk");
        
        overloadMunchkinInit();
        Munchkin.init(munchkinId, {
            cookieLifeDays: 365,
            cookieAnon: false,
            disableClickDelay: false
        }, callback);
    }
    
    function resetMasterMunchkinCookie(callback) {
        var oneLoginUsername = getCookie("onelogin_username");
        
        if (oneLoginUsername) {
            var email = "mktodemosvcs+" + oneLoginUsername + "@gmail.com";
            
            document.cookie = "_mkto_trk=;domain=" + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
            console.log("Removed > Cookie: _mkto_trk");
            
            overloadMunchkinInit();
            Munchkin.init('185-NGX-811', {
                cookieLifeDays: 365,
                cookieAnon: false,
                disableClickDelay: false
            }, function () {
                console.log("Associating > Lead : " + email);
                
                overloadMunchkinFunction();
                Munchkin.munchkinFunction("associateLead", {
                    Email: email
                }, sha1("123123123" + email), callback);
            });
        } else {
            if (origCookie) {
                document.cookie = "_mkto_trk=" + origCookie + ";domain=" + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ";path=/;expires=" + new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
                console.log("Restored > Cookie: _mkto_trk = " + origCookie);
                console.log("Restored > Cookie: _mkto_trk = " + getCookie("_mkto_trk"));
            }
        }
        
        if (typeof(callback) === "function") {
            callback();
        }
    }
    
    function submitLeadData() {
        var acmeLeadX = abm106AcmeLeads[Math.floor(Math.random() * abm106AcmeLeads.length)];
        
        if (acmeLeadX) {
            resetMunchkinCookie(mktoLive106MunchkinId, function () {
                window.setTimeout(function () {
                    console.log("Associating > Mock Lead: " + acmeLeadX);
                    
                    overloadMunchkinFunction();
                    Munchkin.munchkinFunction("associateLead", {
                        Email: acmeLeadX
                    }, sha1("123123123" + acmeLeadX), function () {
                        var webPageX = webPages[Math.floor(Math.random() * webPages.length)];
                        console.log("Posting > Mock Lead > Visit Web Page: " + acmeLeadX + " : " + webPageX);
                        
                        overloadMunchkinFunction();
                        Munchkin.munchkinFunction("visitWebPage", {
                            url: webPageX
                        }, null, function () {
                            resetMasterMunchkinCookie(function () {
                                window.setTimeout(function () {
                                    window.location.reload();
                                }, 5000);
                            });
                        });
                    });
                }, 1000);
            });
        }
    }
    
    function initMunchkin() {
        if (didInit === false) {
            didInit = true;
            submitLeadData();
        }
    }
    
    s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "//munchkin.marketo.net/munchkin.js";
    s.onreadystatechange = function () {
        if (this.readyState == "complete" || this.readyState == "loaded") {
            initMunchkin();
        }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName("head")[0].appendChild(s);
})();