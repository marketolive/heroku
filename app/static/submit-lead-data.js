var URL_PATH = "m3",
devExtensionId = "aahhkppadknlakhbppohbeolcfdhmocf",
prodExtensionId = "onibnnoghllldiecboelbpcaeggfiohl",
extensionId = devExtensionId,
numOfVerticals = 3,
mktoLiveDevSubId = 20,
mktoLiveProdSubId = 69,
mktoLiveSubId = mktoLiveProdSubId,
mktoLiveLandingPageHost = "na-sjdemo1.marketo.com",
mktoLiveDevMunchkinId = "685-BTN-772",
mktoLiveProdMunchkinId = "185-NGX-811",
mktoLiveMunchkinId = mktoLiveProdMunchkinId,
mktoReferrer = "http%3A%2F%2Fwww.marketolive.com",
reqStaticParams = "&subId=" + mktoLiveSubId + "&munchkinId=" + mktoLiveMunchkinId + "&_mktoReferrer=" + mktoReferrer,
mockLeadEndpoint = "https://www.mockaroo.com/0799ab60/download?count=1&key=7d30cdf0",
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
    "/info/why-us"
];

(function () {
    var didInit = false,
    s,
    origMunchkinInit,
    origMunckinFunction;
    
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
        Munchkin.init = function (b, a, callback) {
            origMunchkinInit.apply(this, arguments);
            console.log("Loaded > Munchkin Tag");
            callback();
        };
    }
    
    function overloadMunchkinFunction() {
        Munchkin.munchkinFunction = function (b, a, c, callback) {
            origMunckinFunction.apply(this, arguments);
            console.log("Completed > Munchkin Function");
            callback();
        };
    }
    
    function resetMunchkinCookie(munchkinId, callback) {
        var currCookie = getCookie("_mkto_trk");
        
        if (currCookie != null
             && currCookie != "") {
            origCookie = currCookie;
        }
        document.cookie = "_mkto_trk=;domain=.marketolive.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
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
            
            document.cookie = "_mkto_trk=;domain=.marketolive.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
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
        }
    }
    
    function getUrlParam(param) {
        console.log("Getting > URL Parameter: " + param);
        
        var paramString = window.location.href.split("?")[1];
        
        if (paramString) {
            var params = paramString.split("&"),
            paramPair,
            paramName,
            paramValue;
            
            for (var ii = 0; ii < params.length; ii++) {
                paramPair = params[ii].split("=");
                paramName = paramPair[0];
                paramValue = paramPair[1];
                
                if (paramName == param) {
                    console.log("Retrieved > URL Parameter: " + paramName + " = " + paramValue);
                    return paramValue;
                }
            }
        }
        return false;
    }
    
    function submitLeadData() {
        webRequest(mockLeadEndpoint, null, 'GET', true, '', function (response) {
            var mockLeadX = JSON.parse(response);
            
            if (mockLeadX) {
                var dayOfMonth = new Date().getDate(),
                currVerticalIndex;
                
                if (mockLeadX.mobileNumber == null) {
                    mockLeadX.mobileNumber = "";
                }
                if (mockLeadX.phoneNumber == null) {
                    mockLeadX.phoneNumber = "";
                }
                
                if (dayOfMonth > numOfVerticals) {
                    currVerticalIndex = (dayOfMonth - 1) % numOfVerticals;
                } else {
                    currVerticalIndex = dayOfMonth - 1;
                }
                switch (currVerticalIndex) {
                case 0:
                    currVertical = "coe";
                    break;
                case 1:
                    currVertical = "tech";
                    break;
                case 2:
                    currVertical = "mfg";
                    break;
                }
                
                webRequest('https://marketolive.com/' + URL_PATH + '/pluginv3/data/' + currVertical + '-pages-acquire.json', null, 'GET', true, '', function (response) {
                    var verticalAcquirePages = JSON.parse(response);
                    
                    if (verticalAcquirePages) {
                        var verticalAcquirePageX = verticalAcquirePages[Math.floor(Math.random() * verticalAcquirePages.length)],
                        params;
                        
                        params = "FirstName=" + encodeURIComponent(mockLeadX.firstName) + "&LastName=" + encodeURIComponent(mockLeadX.lastName) + "&Email=" + encodeURIComponent(mockLeadX.email) + "&Title=" + encodeURIComponent(mockLeadX.jobTitle) + "&Company=" + encodeURIComponent(mockLeadX.company) + "&Industry=" + encodeURIComponent(mockLeadX.industry) + "&LeadSource=" + encodeURIComponent(mockLeadX.leadSource) + "&MobilePhone=" + encodeURIComponent(mockLeadX.mobileNumber) + "&Phone=" + encodeURIComponent(mockLeadX.phoneNumber) + "&Lead_Type__c=Business&isMockLead=yes";
                        
                        params += "&formid=" + verticalAcquirePageX.formid + "&formVid=" + verticalAcquirePageX.formid + "&lpId=" + verticalAcquirePageX.lpId + reqStaticParams;
                        
                        webRequest('https://marketolive.com/' + URL_PATH + '/pluginv3/data/' + currVertical + '-utm-values.json', null, 'GET', true, '', function (response) {
                            var utm = JSON.parse(response);
                            
                            if (utm) {
                                var utmTermX = utm.terms[Math.floor(Math.random() * utm.terms.length)],
                                utmMediumX = utm.mediums[Math.floor(Math.random() * utm.mediums.length)],
                                utmCampaignX = utm.campaigns[Math.floor(Math.random() * utm.campaigns.length)];
                                
                                params += "&utmTerm=" + encodeURIComponent(utmTermX) + "&utmMedium=" + encodeURIComponent(utmMediumX) + "&utmCampaign=" + encodeURIComponent(utmCampaignX);
                            }
                            
                            console.log("Posting > Mock Lead > Form Fill:\n" + JSON.stringify(mockLeadX, null, 2));
                            webRequest("http://" + mktoLiveLandingPageHost + "/index.php/leadCapture/save2", params, "POST", true, null, function (response) {
                                var origCookie;
                                
                                console.log("Posted > Mock Lead > Form Fill: " + response)
                                resetMunchkinCookie(mktoLiveMunchkinId, function () {
                                    if (mockLeadX.email) {
                                        window.setTimeout(function () {
                                            console.log("Associating > Mock Lead: " + mockLeadX.email);
                                            
                                            overloadMunchkinFunction();
                                            Munchkin.munchkinFunction("associateLead", {
                                                Email: mockLeadX.email
                                            }, sha1("123123123" + mockLeadX.email), function () {
                                                var webPageX = webPages[Math.floor(Math.random() * webPages.length)];
                                                console.log("Posting > Mock Lead > Visit Web Page: " + mockLeadX.email + " : " + webPageX);
                                                
                                                Munchkin.munchkinFunction("visitWebPage", {
                                                    url: webPageX
                                                }, function () {
                                                    resetMasterMunchkinCookie(function () {
                                                        var followUp = getUrlParam("followUp");
                                                        
                                                        if (followUp == "true") {
                                                            window.setTimeout(function () {
                                                                chrome.runtime.sendMessage(extensionId, {
                                                                    action: "demoDataPage",
                                                                    tabAction: "remove",
                                                                    currUrl: window.location.href
                                                                });
                                                            }, 1000);
                                                        }
                                                    });
                                                });
                                            });
                                        }, 1000);
                                    }
                                });
                            });
                        });
                    }
                });
            }
        });
    }
    
    function initMunchkin() {
        if (didInit === false) {
            didInit = true;
            
            var isMunchkinLoaded = window.setInterval(function () {
                    console.log("Waiting > Munchkin to Load");
                    if (typeof(Munchkin) == "object"
                         && typeof(Munchkin.munchkinFunction) == "function"
                         && typeof(Munchkin.init) == "function") {
                        window.clearInterval(isMunchkinLoaded);
                        
                        origMunchkinInit = Munchkin.init;
                        origMunckinFunction = Munchkin.munchkinFunction;
                        submitLeadData();
                    }
                });
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