var devExtensionId = "dokkjhbgengdlccldgjnbilajdbjlnhm",
prodExtensionId = "onibnnoghllldiecboelbpcaeggfiohl",
extensionId = prodExtensionId,

key = "AIzaSyC9pdVq6GfquP_MtHCS_izS6Vijdv1ZfNc",
cx = "014680826408884315290:pmyltjjihus",
startIndex = 1,

adInfo = getCookie("ad_info"),
googleSearchButton = document.getElementById("googleSearchButton"),
googleButtonText = document.getElementById("googleButtonText"),
facebookButton = document.getElementById("facebookButton"),
facebookButtonText = document.getElementById("facebookButtonText"),
linkedinButton = document.getElementById("linkedinButton"),
linkedinButtonText = document.getElementById("linkedinButtonText"),
countrySelect = document.getElementById("countrySelect"),
adForm = document.getElementById("adForm"),
searchQueryContainer = document.getElementById("searchQueryContainer"),
searchQuery = document.getElementById("searchQuery"),
adTitle = document.getElementById("adTitle"),
adLink = document.getElementById("adLink"),
adText = document.getElementById("adText"),
logoContainer = document.getElementById("logoContainer"),
adLogo = document.getElementById("adLogo"),
logo = document.getElementById("logo"),
searchContainer = document.getElementById("searchContainer"),
searchBox = document.getElementById("searchBox"),
searchButton = document.getElementById("searchButton"),
prevButton = document.getElementById("prevButton"),
nextButton = document.getElementById("nextButton"),
idealFacebookImageInfo = document.getElementById("idealFacebookImageInfo"),
idealLinkedinImageInfo = document.getElementById("idealLinkedinImageInfo"),
searchResults = document.getElementById("searchResults"),
openAdButton = document.getElementById("openAdButton"),
clearAdButton = document.getElementById("clearAdButton"),

setIfBlank,
encodeText,
showSelectedAdImage,
getAndSetAdInfo,
submitOnEnterInFields,
flashBorder,
validateFields,
adLogoSubmit,
loadScript,
sendAdInfoMsg,
selectImg,
selectImgSrc,
country;

function getCookie(cookieName) {
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
}

function resultsHandler(response) {
  if (response.queries) {
    if (response.queries.request
       && response.queries.request[0]
       && response.queries.request[0].startIndex > 1
       && response.queries.previousPage
       && response.queries.previousPage[0]
       && response.queries.previousPage[0].startIndex) {
      
      prevButton.onclick = function () {
        searchButton.onclick(response.queries.previousPage[0].startIndex);
      }
      prevButton.style.display = "inline-block";
    } else {
      prevButton.style.display = "none";
    }
    
    if (response.queries.nextPage
       && response.queries.nextPage[0]
       && response.queries.nextPage[0].startIndex) {
      
      nextButton.onclick = function () {
        searchButton.onclick(response.queries.nextPage[0].startIndex);
      }
      nextButton.style.display = "inline-block";
      
    } else {
      nextButton.style.display = "none";
    }
  }
  
  for (var ii = 0; ii < response.items.length; ii++) {
    var item = response.items[ii],
    itemResult = document.createElement("div"),
    itemImg = document.createElement("img"),
    itemImgText = document.createElement("div");
    
    itemResult.className = "search_result";
    itemImg.className = "search_result_image";
    itemImg.src = item.link;
    itemImg.onclick = function () {
      var imgs = document.getElementsByClassName("search_result_image");
      if (!this.isSelected) {
        this.isSelected = true;
        selectImg = this;
        selectImgSrc = this.src;
        this.parentElement.style.opacity = null;
        submitOnEnterInFields([this], openAdButton.onclick);
        for (var jj = 0; jj < imgs.length; jj++) {
          if (imgs[jj].src != this.src) {
            imgs[jj].isSelected = false;
            imgs[jj].parentElement.style.opacity = "0.5";
          }
        }
        console.log("Ad Image: " + selectImgSrc);
      } else {
        this.isSelected = false;
        selectImg = selectImgSrc = null;
        for (var jj = 0; jj < imgs.length; jj++) {
          imgs[jj].parentElement.style.opacity = null;
        }
      }
    };
    itemImgText.className = "search_result_text";
    itemImgText.innerText = item.image.width + " × " + item.image.height + " / AR " + Math.round(item.image.width / item.image.height * 100) / 100;
    
    itemResult.appendChild(itemImg);
    itemResult.appendChild(itemImgText);
    searchResults.appendChild(itemResult);
  }
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    window.setTimeout(function () {
      document.body.scrollTop = 0;
    }, 500);
  }
};

setIfBlank = function (field, value) {
  if (!field.value) {
    field.value = value;
  }
};

encodeText = function (text) {
  return encodeURIComponent(text).replace(/%20/g, "+");
};

showSelectedAdImage = function (adImage, scrollInView) {
  var itemResult = document.createElement("div"),
  itemImg = document.createElement("img"),
  itemImgText = document.createElement("div");
  
  prevButton.style.display = nextButton.style.display = "none";
  searchResults.innerHTML = null;
  
  itemResult.className = "search_result";
  itemImg.className = "search_result_image";
  itemImg.src = adImage;
  
  itemImg.onload = function () {
    itemImg.isSelected = true;
    selectImgSrc = adImage;
    itemImgText.className = "search_result_text";
    itemImgText.innerText = itemImg.naturalWidth + " × " + itemImg.naturalHeight + " / AR " + Math.round(itemImg.naturalWidth / itemImg.naturalHeight * 100) / 100;
    itemImg.onclick = function () {
      if (!this.isSelected) {
        this.isSelected = true;
        this.parentElement.style.opacity = null;
        selectImgSrc = adImage;
        console.log("Ad Image: " + selectImgSrc);
      } else {
        this.isSelected = false;
        this.parentElement.style.opacity = "0.5";
        selectImgSrc = null;
      }
    };
    
    itemResult.appendChild(itemImg);
    itemResult.appendChild(itemImgText);
    searchResults.appendChild(itemResult);
    
    clearAdButton.style.display = "inline-block";
    
    if (scrollInView) {
      openAdButton.scrollIntoView();
    }
  };
  
  itemImg.onerror = function () {
    searchResults.innerHTML = null;
    flashBorder(searchBox, 3, 500);
  };
};

getAndSetAdInfo = function (adType) {
  if (adInfo) {
    var adInfoSplit = adInfo.split(",,");
    
    switch (adType) {
    case "googleSearch":
      setIfBlank(searchQuery, decodeURIComponent(adInfoSplit[0]).replace(/\+/g, " "));
      setIfBlank(adTitle, adInfoSplit[1]);
      setIfBlank(adLink, adInfoSplit[2]);
      setIfBlank(adLinkText, adInfoSplit[3]);
      setIfBlank(adText, adInfoSplit[4]);
      
      clearAdButton.style.display = "inline-block";
      break;
      
    case "facebook":
      setIfBlank(adTitle, adInfoSplit[1]);
      setIfBlank(adLink, adInfoSplit[2]);
      setIfBlank(adLinkText, adInfoSplit[3]);
      setIfBlank(adText, adInfoSplit[4]);
      
      if (searchResults.childNodes.length == 0
         && adInfoSplit[6]
         && adInfoSplit[6] != "undefined") {
        showSelectedAdImage(adInfoSplit[6]);
      }
      break;
      
    case "linkedin":
      setIfBlank(adTitle, adInfoSplit[1]);
      setIfBlank(adLink, adInfoSplit[2]);
      setIfBlank(adLinkText, adInfoSplit[3]);
      setIfBlank(adText, adInfoSplit[4]);
      
      if (!logo.src
         && adInfoSplit[5]) {
        logo.src = adInfoSplit[5];
        setIfBlank(adLogo, adInfoSplit[5].split("https://logo.clearbit.com/")[1].split("?")[0]);
      }
      
      if (searchResults.childNodes.length == 0
         && adInfoSplit[6]
         && adInfoSplit[6] != "undefined") {
        showSelectedAdImage(adInfoSplit[6]);
      }
      break;
    }
  }
};

submitOnEnterInFields = function (fields, submitFunc) {
  for (var ii = 0; ii < fields.length; ii++) {
    var field = fields[ii];
    
    field.onkeyup = function (e) {
      if (e.keyCode == 13) {
        submitFunc();
        return;
      } else {
        return;
      }
    };
  }
};

flashBorder = function (el, numOfTimes, ms, color, borderProp) {
  var count = 1,
  changeBorder,
  restoreBorder,
  origBorder;
  //origBorderColor = window.getComputedStyle(el).getPropertyValue("border");
  
  if (!color) {
    color = "red";
  }
  if (!borderProp) {
    borderProp = "border";
  }
  origBorder = el.style.getPropertyValue(borderProp);
  el.style.setProperty(borderProp, "2px solid " + color);
  
  changeBorder = function (el, borderProp) {
    window.setTimeout(function () {
      el.style.setProperty(borderProp, "2px solid " + color);
      restoreBorder(el, borderProp);
    }, ms);
  };
  
  restoreBorder = function (el, borderProp) {
    window.setTimeout(function () {
      el.style.setProperty(borderProp, origBorder);
      
      if (count < numOfTimes) {
        count++;
        changeBorder(el, borderProp);
      } else if (count == numOfTimes) {
        count++;
        if (el.tagName == "INPUT") {
          el.style.setProperty("border-bottom", "2px solid " + color);
        }
      }
    }, ms);
  };
  
  el.onfocus = function () {
    this.style.setProperty(borderProp, origBorder);
  };
  
  restoreBorder(el, borderProp);
};

validateFields = function (fields) {
  var isValid = true;
  
  for (var ii = 0; ii < fields.length; ii++) {
    var field = fields[ii];
    
    if (!field.value) {
      flashBorder(field, 3, 500);
      isValid = false;
    }
  }
  
  if (isValid) {
    return true;
  } else {
    return false;
  }
};

googleSearchButton.onclick = googleButtonText.onclick = function () {
  googleSearchButton.checked = true;
  getAndSetAdInfo("googleSearch");
  submitOnEnterInFields([searchQuery, adTitle, adLink, adLinkText, adText], openAdButton.onclick);
  
  searchQueryContainer.style.display = "flex";
  logoContainer.style.display = searchContainer.style.display = idealFacebookImageInfo.style.display = idealLinkedinImageInfo.style.display = searchResults.style.display = "none";
  countrySelect.style.display = adForm.style.display = openAdButton.style.display = "inline-block";
};

facebookButton.onclick = facebookButtonText.onclick = function () {
  facebookButton.checked = true;
  getAndSetAdInfo("facebook");
  submitOnEnterInFields([adTitle, adLink, adLinkText, adText], openAdButton.onclick);
  submitOnEnterInFields([searchBox], searchButton.onclick);
  
  countrySelect.style.display = searchQueryContainer.style.display = logoContainer.style.display = idealLinkedinImageInfo.style.display = "none";
  searchContainer.style.display = "flex";
  idealFacebookImageInfo.style.display = searchResults.style.display = "block";
  adForm.style.display = openAdButton.style.display = "inline-block";
  
  if (searchResults.childNodes.length > 1) {
    nextButton.style.display = "inline-block";
    if (startIndex > 1) {
      prevButton.style.display = "inline-block";
    }
  }
};

linkedinButton.onclick = linkedinButtonText.onclick = function () {
  linkedinButton.checked = true;
  getAndSetAdInfo("linkedin");
  submitOnEnterInFields([adTitle, adLink, adLinkText, adText], openAdButton.onclick);
  submitOnEnterInFields([adLogo], adLogoSubmit);
  submitOnEnterInFields([searchBox], searchButton.onclick);
  
  countrySelect.style.display = searchQueryContainer.style.display = idealFacebookImageInfo.style.display = "none";
  logoContainer.style.display = searchContainer.style.display = "flex";
  idealLinkedinImageInfo.style.display = searchResults.style.display = "block";
  adForm.style.display = openAdButton.style.display = "inline-block";
  
  if (searchResults.childNodes.length > 1) {
    nextButton.style.display = "inline-block";
    if (startIndex > 1) {
      prevButton.style.display = "inline-block";
    }
  }
};

if (countrySelect) {
  var usButton = document.getElementById("us");
  
  usButton.selected = true;
  country = usButton.innerText.trim();
  
  countrySelect.onchange = function () {
    country = this[this.selectedIndex].innerText.trim();
  };
}

logo.onload = function () {
  logo.style.visibility = "visible";
};

logo.onerror = function () {
  logo.style.visibility = "hidden";
  flashBorder(adLogo, 3, 500);
};

adLogoSubmit = function (value, isBlur) {
  if (value
     || !isBlur) {
    var companyDomain;
    
    if (value) {
      companyDomain = value.toLowerCase();
    } else {
      companyDomain = adLogo.value;
    }
    
    if (companyDomain.search("\\.[a-z0-9-]+$") == -1) {
      if (companyDomain.search("\\.$") == -1) {
        companyDomain = companyDomain + ".com";
      } else {
        companyDomain = companyDomain + "com";
      }
    }
    
    logo.crossOrigin = "https://logo.clearbit.com/*";
    logo.src = "https://logo.clearbit.com/" + companyDomain + "?size=50";
  } else if (isBlur) {
    logo.style.visibility = "hidden";
    logo.src = null;
  }
};

adLogo.onblur = function () {
  adLogoSubmit(this.value, true);
};

loadScript = function (scriptSrc) {
  console.log("Loading: Script: " + scriptSrc);
  
  var scriptElement = document.createElement("script");
  scriptElement.async = true;
  scriptElement.src = scriptSrc;
  document.getElementsByTagName("head")[0].appendChild(scriptElement);
};

searchButton.onclick = function (startIndex) {
  if (searchBox.value.search(/^http(s)?:\/\/.+\.(jpg|jpeg|jfif|png|bmp|gif|tiff|exif)/i) == -1) {
    if (!Number.isInteger(startIndex)) {
      startIndex = 1;
    }
    searchResults.innerHTML = null;
    loadScript("https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + cx + "&fields=queries(request/startIndex,previousPage/startIndex,nextPage/startIndex),items(link,image/height,image/width)&filter=1&num=10&searchType=image&imgType=photo&callback=resultsHandler&q=" + encodeURIComponent(searchBox.value) + "&start=" + startIndex);
    openAdButton.scrollIntoView();
  } else {
    showSelectedAdImage(searchBox.value, true);
  }
};

sendAdInfoMsg = function (action) {
  var msg = {
    action: "setAdInfo",
    adType: "",
    adInfo: ""
  };
  
  if (action != "removeAdInfo") {
    var adSearchQuery = encodeText(searchQuery.value),
    adTitleValue = encodeText(adTitle.value);
    
    if (googleSearchButton.checked) {
      msg.adType = "googleSearch";
      msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + logo.src + ",," + selectImgSrc;
      
      switch (country) {
      case "Australia":
        msg.domain = ".google.com.au";
        break;
      
      case "France":
        msg.domain = ".google.fr";
        break;
      
      case "Germany":
        msg.domain = ".google.de";
        break;
      
      case "Ireland":
        msg.domain = ".google.ie";
        break;
      
      case "Israel":
        msg.domain = ".google.co.il";
        break;
      
      case "Japan":
        msg.domain = ".google.co.jp";
        break;
      
      case "United Kingdom":
        msg.domain = ".google.co.uk";
        break;
      
      case "United States":
        msg.domain = ".google.com";
        break;
      
      default:
        msg.domain = ".google.com";
        break;
      }
      msg.urlMatch = msg.urlCreate = "https://www" + msg.domain + "/search?dynamicAd=true&q=" + adSearchQuery;
    } else if (facebookButton.checked) {
      msg.adType = "facebook";
      msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + logo.src + ",," + selectImgSrc;
      msg.urlMatch = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue + "&*";
      msg.urlCreate = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue + "&link=" + encodeText(adLink.value) + "&linkText=" + encodeText(adLinkText.value) + "&text=" + encodeText(adText.value) + "&image=" + encodeText(selectImgSrc);
    } else if (linkedinButton.checked) {
      msg.adType = "linkedin";
      msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + logo.src + ",," + selectImgSrc;
      msg.urlMatch = msg.urlCreate = "https://www.linkedin.com/feed/?dynamicAd=true&title=" + adTitleValue;
    }
  }
  
  chrome.runtime.sendMessage(extensionId, msg, function (response) {
    console.log("Receiving: Message Response from Background: " + response);
    //window.close();
  });
};

openAdButton.onclick = function () {
  if (googleSearchButton.checked) {
    if (!validateFields([searchQuery, adTitle, adLink, adText])) {
      return;
    }
  } else if (facebookButton.checked) {
    if (!validateFields([adTitle, adLink, adText])) {
      return;
    }
    
    if (!selectImgSrc) {
      if (searchResults.childNodes.length > 0) {
        flashBorder(searchResults, 3, 500);
      } else {
        flashBorder(searchBox, 3, 500);
      }
      return;
    }
    
    showSelectedAdImage(selectImgSrc);
    document.body.scrollTop = 0;
  } else if (linkedinButton.checked) {
    if (!validateFields([adTitle, adLink, adText, adLogo])) {
      return;
    }
    
    if (!selectImgSrc) {
      if (searchResults.childNodes.length > 0) {
        flashBorder(searchResults, 3, 500);
      } else {
        flashBorder(searchBox, 3, 500);
      }
      return;
    }
    
    showSelectedAdImage(selectImgSrc);
    document.body.scrollTop = 0;
  }
  
  sendAdInfoMsg();
  clearAdButton.style.display = "inline-block";
};

clearAdButton.onclick = function () {
  adInfo = searchQuery.value = adTitle.value = adLink.value = adLinkText.value = adText.value = adLogo.value = logo.src = searchBox.value = searchResults.innerHTML = selectImg = selectImgSrc = null;
  logo.style.visibility = "hidden";
  prevButton.style.display = nextButton.style.display = clearAdButton.style.display = "none";
  sendAdInfoMsg("removeAdInfo");
  document.body.scrollTop = 0;
};