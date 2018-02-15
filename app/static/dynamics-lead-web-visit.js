var mktoLiveMunchkinId = '400-TWP-453',
webPages = [
  '/info/community',
  '/info/contact-us',
  '/info/data-sheets',
  '/info/integrations',
  '/info/live-event',
  '/info/pricing',
  '/info/products',
  '/info/webinar',
  '/info/whitepapers',
  '/info/why-us',
  '/are-you-abm-ready.html',
  '/top5-abm-themes.html',
  '/marketers-can-benefit-from-abm.html',
  '/sirius-abm-2016-state.html',
  '/account-based-nurturing.html',
  '/get-it-right-with-abm.html',
  '/blog/accelerate-your-sales.html',
  '/solutions/lead-management.html',
  '/solutions/abm.html',
  '/blog/digital-marketing-financial',
  '/top5-digital-engagement-themes.html',
  '/reboot-europe-tech-industry.html'
],
leads = [
  'mktodemosvcs+bburne@gmail.com',
  'mktodemosvcs+bfisher@gmail.com',
  'mktodemosvcs+hgrant@gmail.com',
  'mktodemosvcs+jlangensand@gmail.com',
  'mktodemosvcs+jmcpherson@gmail.com',
  'mktodemosvcs+lmcrae@gmail.com',
  'mktodemosvcs+mfazio@gmail.com',
  'mktodemosvcs+omalik@gmail.com',
  'mktodemosvcs+tcarroll@gmail.com',
  'mktodemosvcs+tconnor@gmail.com'
];

(function () {
  var didInit = false,
  s,
  origMunchkinInit,
  origMunckinFunction,
  origCookie;
  
  function getCookie(cookieName) {
    console.log('Getting > Cookie: ' + cookieName);
    
    var name = cookieName + '=',
    cookies = document.cookie.split(';'),
    currCookie;
    
    for (var ii = 0; ii < cookies.length; ii++) {
      currCookie = cookies[ii].trim();
      if (currCookie.indexOf(name) == 0) {
        return currCookie.substring(name.length, currCookie.length);
      }
    }
    console.log('Getting > Cookie: ' + cookieName + ' not found');
    return null;
  }
  
  function overloadMunchkinInit() {
    if (typeof(origMunchkinInit) !== 'function') {
      origMunchkinInit = Munchkin.init;
    }
    
    Munchkin.init = function (b, a, callback) {
      origMunchkinInit.apply(this, arguments);
      console.log('Loaded > Munchkin Tag');
      callback();
    };
  }
  
  function overloadMunchkinFunction() {
    if (typeof(origMunckinFunction) !== 'function') {
      origMunckinFunction = Munchkin.munchkinFunction;
    }
    
    Munchkin.munchkinFunction = function (b, a, c, callback) {
      origMunckinFunction.apply(this, arguments);
      console.log('Completed > Munchkin Function');
      callback();
    };
  }
  
  function resetMunchkinCookie(munchkinId, callback) {
    if (!origCookie) {
      var currCookie = getCookie('_mkto_trk');
      
      if (currCookie) {
        origCookie = currCookie;
      }
    }
    document.cookie = '_mkto_trk=;domain=' + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
    console.log('Removed > Cookie: _mkto_trk');
    
    overloadMunchkinInit();
    Munchkin.init(munchkinId, {
      cookieLifeDays: 365,
      cookieAnon: false,
      disableClickDelay: false
    }, callback);
  }
  
  function resetMasterMunchkinCookie(callback) {
    var oneLoginUsername = getCookie('onelogin_username');
    
    if (oneLoginUsername) {
      var email = 'mktodemosvcs+' + oneLoginUsername + '@gmail.com';
      
      document.cookie = '_mkto_trk=;domain=' + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ';path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
      console.log('Removed > Cookie: _mkto_trk');
      
      overloadMunchkinInit();
      Munchkin.init('185-NGX-811', {
        cookieLifeDays: 365,
        cookieAnon: false,
        disableClickDelay: false
      }, function () {
        console.log('Associating > Lead : ' + email);
        
        overloadMunchkinFunction();
        Munchkin.munchkinFunction('associateLead', {
          Email: email
        }, sha1('123123123' + email), callback);
      });
    } else {
      if (origCookie) {
        document.cookie = '_mkto_trk=' + origCookie + ';domain=' + window.location.host.match(/(\.[^\.]+\.com$|localhost)/)[0] + ';path=/;expires=' + new Date(new Date().getTime() + (365 * 24 * 60 * 60 * 1000)).toUTCString();
        console.log('Restored > Cookie: _mkto_trk = ' + origCookie);
        console.log('Restored > Cookie: _mkto_trk = ' + getCookie('_mkto_trk'));
      }
    }
    
    if (typeof(callback) === 'function') {
      callback();
    }
  }
  
  function submitLeadData() {
    var leadX = leads[Math.floor(Math.random() * leads.length)];
    
    if (leadX) {
      resetMunchkinCookie(mktoLiveMunchkinId, function () {
        window.setTimeout(function () {
          console.log('Associating > Mock Lead: ' + leadX);
          debugger;
          overloadMunchkinFunction();
          Munchkin.munchkinFunction('associateLead', {
            Email: leadX
          }, sha1('123123123' + leadX), function () {
            var webPageX = webPages[Math.floor(Math.random() * webPages.length)];
            console.log('Posting > Mock Lead > Visit Web Page: ' + leadX + ' : ' + webPageX);
            
            overloadMunchkinFunction();
            Munchkin.munchkinFunction('visitWebPage', {
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
  
  s = document.createElement('script');
  s.type = 'text/javascript';
  s.async = true;
  s.src = '//munchkin.marketo.net/munchkin.js';
  s.onreadystatechange = function () {
    if (this.readyState == 'complete' || this.readyState == 'loaded') {
      initMunchkin();
    }
  };
  s.onload = initMunchkin;
  document.getElementsByTagName('head')[0].appendChild(s);
})();