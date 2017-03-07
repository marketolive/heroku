var URL_PATH = "m3-dev",
numOfVerticals = 2,
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
    origMunchkinFunction;
    
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
    
    function resetMunchkinCookie(munchkinId) {
        var result;
        
        if (getCookie("_mkto_trk")) {
            origCookie = getCookie("_mkto_trk");
        }
        document.cookie = "_mkto_trk=;domain=.marketolive.com;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
        console.log("Removed > Cookie: _mkto_trk");
        
        result = Munchkin.init(munchkinId, {
                cookieLifeDays: 365,
                cookieAnon: false,
                disableClickDelay: false
            });
        console.log("Loaded > Munchkin Tag");
        
        return result;
    }
    
    function resetOrigMunchkinCookie(origCookie) {
        var date = new Date(),
        expiresInDays = 365;
        
        date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
        document.cookie = "_mkto_trk=;domain=.marketolive.com;path=/;expires=" + date.toGMTString();
        console.log("Reset > Cookie: _mkto_trk");
        return getCookie("_mkto_trk");
    }
    
    function submitLeadData() {
        var mockLeadX;
        
        mockLeadX = webRequest(mockLeadEndpoint, null, 'GET', false, '', function (response) {
                return JSON.parse(response);
            });
        if (mockLeadX) {
            var dayOfMonth = new Date().getDate(),
            mktoLiveMunchkinResetResult = false,
            currVerticalIndex,
            verticalAcquirePages,
            origCookie,
            isMktoLiveMunchkinReset;
            
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
            }
            
            verticalAcquirePages = webRequest('https://marketolive.com/' + URL_PATH + '/pluginv3/data/' + currVertical + '-pages-acquire.json', null, 'GET', false, '', function (response) {
                    return JSON.parse(response);
                });
            if (verticalAcquirePages) {
                var verticalAcquirePageX = verticalAcquirePages[Math.floor(Math.random() * verticalAcquirePages.length)],
                params,
                utm;
                
                params = "FirstName=" + encodeURIComponent(mockLeadX.firstName) + "&LastName=" + encodeURIComponent(mockLeadX.lastName) + "&Email=" + encodeURIComponent(mockLeadX.email) + "&Title=" + encodeURIComponent(mockLeadX.jobTitle) + "&Company=" + encodeURIComponent(mockLeadX.company) + "&Industry=" + encodeURIComponent(mockLeadX.industry) + "&LeadSource=" + encodeURIComponent(mockLeadX.leadSource) + "&MobilePhone=" + encodeURIComponent(mockLeadX.mobileNumber) + "&Phone=" + encodeURIComponent(mockLeadX.phoneNumber) + "&Lead_Type__c=Business&isMockLead=yes";
                
                params += "&formid=" + verticalAcquirePageX.formid + "&formVid=" + verticalAcquirePageX.formid + "&lpId=" + verticalAcquirePageX.lpId + reqStaticParams;
                
                utm = webRequest('https://marketolive.com/' + URL_PATH + '/pluginv3/data/' + currVertical + '-utm-values.json', null, 'GET', false, '', function (response) {
                        return JSON.parse(response);
                    });
                if (utm) {
                    var utmTermX = utm.terms[Math.floor(Math.random() * utm.terms.length)],
                    utmMediumX = utm.mediums[Math.floor(Math.random() * utm.mediums.length)],
                    utmCampaignX = utm.campaigns[Math.floor(Math.random() * utm.campaigns.length)];
                    
                    params += "&utmTerm=" + encodeURIComponent(utmTermX) + "&utmMedium=" + encodeURIComponent(utmMediumX) + "&utmCampaign=" + encodeURIComponent(utmCampaignX);
                }
                
                console.log("Posting > Mock Lead > Form Fill:\n" + JSON.stringify(mockLeadX, null, 2));
                webRequest("http://" + mktoLiveLandingPageHost + "/index.php/leadCapture/save2", params, "POST", false, null, function (response) {
                    console.log("Posted > Mock Lead > Form Fill: " + response)
                });
            }
            
            mktoLiveMunchkinResetResult = resetMunchkinCookie(mktoLiveMunchkinId);
            isMktoLiveMunchkinReset = window.setInterval(function () {
                    if (mktoLiveMunchkinResetResult != false) {
                        window.clearInterval(isMktoLiveMunchkinReset);
                        
                        if (mockLeadX.email) {
                            var mockAssociateLeadResult = false;
                            console.log("Associating > Mock Lead: " + mockLeadX.email);
                            
                            mockAssociateLeadResult = Munchkin.munchkinFunction("associateLead", {
                                    Email: mockLeadX.email
                                }, sha1("123123123" + mockLeadX.email));
                            
                            var isMockAssociateLead = window.setInterval(function () {
                                    if (mockAssociateLeadResult != false) {
                                        window.clearInterval(isMockAssociateLead);
                                        
                                        var webPageX = webPages[Math.floor(Math.random() * webPages.length)],
                                        mockVisitWebPageResult = false,
                                        isMockVisitWebPage;
                                        console.log("Posting > Mock Lead > Visit Web Page: " + mockLeadX.email + " : " + webPageX);
                                        
                                        mockVisitWebPageResult = Munchkin.munchkinFunction("visitWebPage", {
                                                url: webPageX
                                            });
                                        
                                        isMockVisitWebPage = window.setInterval(function () {
                                                if (mockVisitWebPageResult != false) {
                                                    window.clearInterval(isMockVisitWebPage);
                                                    
                                                    console.log(resetOrigMunchkinCookie(origCookie));
                                                }
                                            }, 0);
                                    }
                                }, 0);
                        }
                    }
                }, 0);
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