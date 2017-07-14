var devExtensionId = "dokkjhbgengdlccldgjnbilajdbjlnhm",
prodExtensionId = "onibnnoghllldiecboelbpcaeggfiohl",
extensionId = devExtensionId,

numOfVerticals = 3,

mktoLiveDevMunchkinId = "685-BTN-772",
mktoLiveProdMunchkinId = "185-NGX-811",
mktoLiveMunchkinId = mktoLiveProdMunchkinId;

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
      if (xmlHttp.readyState == 4) {
        if (xmlHttp.status == 200) {
          if (typeof(callback) === "function") {
            result = callback(xmlHttp.response);
          } else {
            result = xmlHttp.response;
          }
        } else {
          chrome.runtime.sendMessage(extensionId, {
            action: "demoDataPage",
            tabAction: "remove",
            currUrl: window.location.href
          });
        }
      }
    }
    if (async
       && xmlHttp.responseType) {
      xmlHttp.responseType = responseType;
    }
    xmlHttp.open(method, url, async); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
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
      
      if (typeof(callback) === "function") {
        callback();
      }
    };
  }
  
  function overloadMunchkinFunction() {
    if (typeof(origMunckinFunction) !== "function") {
      origMunckinFunction = Munchkin.munchkinFunction;
    }
    
    Munchkin.munchkinFunction = function (b, a, c, callback) {
      origMunckinFunction.apply(this, arguments);
      console.log("Completed > Munchkin Function");
      
      if (typeof(callback) === "function") {
        callback();
      }
    };
  }
  
  function resetMunchkinCookie(munchkinId, callback) {
    var currCookie = getCookie("_mkto_trk"),
    hostSplit = window.location.host.split(".");
    
    if (currCookie
       && !origCookie) {
      origCookie = currCookie;
    }
    
    document.cookie = "_mkto_trk=;domain=" + hostSplit[hostSplit.length - 2] + "." + hostSplit[hostSplit.length - 1] + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    console.log("Removed > Cookie: _mkto_trk");
    
    overloadMunchkinInit();
    Munchkin.init(munchkinId, {
      cookieLifeDays: 365,
      cookieAnon: false,
      disableClickDelay: false
    }, callback);
  }
  
  function resetMasterMunchkinCookie(callback) {
    var oneLoginUsername = getCookie("onelogin_username"),
    hostSplit = window.location.host.split(".");
    
    if (oneLoginUsername) {
      var email = "mktodemosvcs+" + oneLoginUsername + "@gmail.com";
      
      document.cookie = "_mkto_trk=;domain=" + hostSplit[hostSplit.length - 2] + "." + hostSplit[hostSplit.length - 1] + ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
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
        document.cookie = "_mkto_trk=" + origCookie + ";domain=" + hostSplit[hostSplit.length - 2] + "." + hostSplit[hostSplit.length - 1] + ";path=/;expires=" + new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
        console.log("Restored > Cookie: _mkto_trk = " + origCookie);
        console.log("Restored > Cookie: _mkto_trk = " + getCookie("_mkto_trk"));
      }
      
      if (typeof(callback) === "function") {
        callback();
      }
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
    return;
  }
  
  function submitLeadData() {
    var mockLeadEmail = getUrlParam("mockLead").replace(/( |%2B)/, "+"),
    origCookie;
    
    resetMunchkinCookie(mktoLiveMunchkinId, function () {
      if (mockLeadEmail) {
        window.setTimeout(function () {
          console.log("Associating > Mock Lead: " + mockLeadEmail);
          
          overloadMunchkinFunction();
          Munchkin.munchkinFunction("associateLead", {
            Email: mockLeadEmail
          }, sha1("123123123" + mockLeadEmail), function () {
            console.log("Posting > Mock Lead > Visit Web Page: " + mockLeadEmail + " : " + window.location.pathname);
            
            overloadMunchkinFunction();
            Munchkin.munchkinFunction("visitWebPage", {
              url: window.location.pathname
            }, null, function () {
              resetMasterMunchkinCookie(function () {
                if (window.location.pathname.search(/^\/info\/.+/) != -1) {
                  console.log("Posting > Real Lead > Visit Web Page: " + window.location.pathname);
                  
                  overloadMunchkinFunction();
                  Munchkin.munchkinFunction("visitWebPage", {
                    url: window.location.pathname
                  }, null, function () {
                    window.setTimeout(function () {
                      chrome.runtime.sendMessage(extensionId, {
                        action: "demoDataPage",
                        tabAction: "remove",
                        currUrl: window.location.href
                      });
                    }, 1000);
                  });
                } else {
                  var followUp;
                  
                  if (window.location.pathname == "/en/") {
                    followUp = getUrlParam("followUp");
                  } else {
                    followUp = "true";
                  }
                  
                  if (followUp == "true") {
                    window.setTimeout(function () {
                      chrome.runtime.sendMessage(extensionId, {
                        action: "demoDataPage",
                        tabAction: "remove",
                        currUrl: window.location.href
                      });
                    }, 1000);
                  }
                }
              });
            });
          });
        }, 1000);
      }
    });
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