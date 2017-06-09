var devExtensionId = "dokkjhbgengdlccldgjnbilajdbjlnhm",
prodExtensionId = "onibnnoghllldiecboelbpcaeggfiohl",
extensionId = devExtensionId,
adInfo = getCookie("ad_info"),
heading = document.getElementById("heading"),
googleSearchButton = document.getElementById("googleSearchButton"),
facebookButton = document.getElementById("facebookButton"),
linkedinButton = document.getElementById("linkedinButton"),
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
key = "AIzaSyC9pdVq6GfquP_MtHCS_izS6Vijdv1ZfNc",
cx = "014680826408884315290:pmyltjjihus",
startIndex = 1,
setIfBlank,
encodeText,
showSelectedAdImage,
getAndSetAdInfo,
submitOnEnterInFields,
flashBorder,
validateFields,
loadScript,
sendAdInfoMsg,
selectImg,
selectImgSrc;

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

setIfBlank = function (field, value) {
    if (!field.value) {
        field.value = value;
    }
};

encodeText = function (text) {
    return encodeURIComponent(text).replace(/%20/g, "+");
};

showSelectedAdImage = function (adImage) {
    var itemResult = document.createElement("div"),
    itemImg = document.createElement("img"),
    itemImgText = document.createElement("div");
    
    prevButton.style.display = nextButton.style.display = "none";
    searchResults.innerHTML = null;
    
    itemResult.className = "search_result";
    itemImg.className = "search_result_image";
    itemImg.src = adImage;
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
                 && adInfoSplit[5]) {
                showSelectedAdImage(adInfoSplit[5]);
            }
            break;
        
        case "linkedin":
            setIfBlank(adTitle, adInfoSplit[1]);
            setIfBlank(adLink, adInfoSplit[2]);
            setIfBlank(adLinkText, adInfoSplit[3]);
            setIfBlank(adText, adInfoSplit[4]);
            
            if (searchResults.childNodes.length == 0
                 && adInfoSplit[5]) {
                showSelectedAdImage(adInfoSplit[5]);
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

flashBorder = function (el, numOfTimes, ms) {
    var count = 1,
    redBorder,
    restoreBorder,
    origBorderColor = el.style.getPropertyValue("border-color");
    //origBorderColor = window.getComputedStyle(el).getPropertyValue("border-color");
    
    redBorder = function (el) {
        window.setTimeout(function () {
            el.style.setProperty("border-color", "red");
            restoreBorder(el);
        }, ms);
    };
    
    restoreBorder = function (el) {
        window.setTimeout(function () {
            el.style.setProperty("border-color", origBorderColor);
            
            if (count < numOfTimes) {
                count++;
                redBorder(el);
            }
        }, ms);
    };
    
    redBorder(el);
};

validateFields = function (fields) {
    var isValid = true;
    
    for (var ii = 0; ii < fields.length; ii++) {
        var field = fields[ii];
        
        if (!field.value) {
            flashBorder(field, 3, 667);
            isValid = false;
        }
    }
    
    if (isValid) {
        return true;
    } else {
        return false;
    }
};

googleSearchButton.onclick = function () {
    getAndSetAdInfo("googleSearch");
    submitOnEnterInFields([searchQuery, adTitle, adLink, adLinkText, adText], openAdButton.onclick);
    
    searchQueryContainer.style.display = "flex";
    logoContainer.style.display = searchContainer.style.display = idealFacebookImageInfo.style.display = idealLinkedinImageInfo.style.display = searchResults.style.display = "none";
    adForm.style.display = openAdButton.style.display = "inline-block";
};

facebookButton.onclick = function () {
    getAndSetAdInfo("facebook");
    submitOnEnterInFields([adTitle, adLink, adLinkText, adText], openAdButton.onclick);
    submitOnEnterInFields([searchBox], searchButton.onclick);
    
    searchQueryContainer.style.display = logoContainer.style.display = idealLinkedinImageInfo.style.display = "none";
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

linkedinButton.onclick = function () {
    getAndSetAdInfo("linkedin");
    submitOnEnterInFields([adTitle, adLink, adLinkText, adText], openAdButton.onclick);
    submitOnEnterInFields([adLogo], adLogo.onblur);
    submitOnEnterInFields([searchBox], searchButton.onclick);
    
    searchQueryContainer.style.display = idealFacebookImageInfo.style.display = "none";
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

adLogo.onblur = function () {
    if (this.value) {
        var companyDomain = this.value.toLowerCase();
        
        if (companyDomain.search("\\.[a-z0-9-]+$") == -1) {
            if (companyDomain.search("\\.$") == -1) {
                companyDomain = companyDomain + ".com";
            } else {
                companyDomain = companyDomain + "com";
            }
        }
        
        logo.crossOrigin = "https://logo.clearbit.com/*";
        logo.src = "https://logo.clearbit.com/" + companyDomain + "?size=50";
        logo.style.visibility = "visible";
    } else {
        logo.style.visibility = "hidden";
        logo.src = null;
    }
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
        showSelectedAdImage(searchBox.value);
        openAdButton.scrollIntoView();
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
            msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + selectImgSrc + ",," + logo.src;
            msg.urlMatch = msg.urlCreate = "https://www.google.com/search?dynamicAd=true&q=" + adSearchQuery;
        } else if (facebookButton.checked) {
            msg.adType = "facebook";
            msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + selectImgSrc + ",," + logo.src;
            msg.urlMatch = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue + "&*";
            msg.urlCreate = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue + "&link=" + encodeText(adLink.value) + "&linkText=" + encodeText(adLinkText.value) + "&text=" + encodeText(adText.value) + "&image=" + encodeText(selectImgSrc);
        } else if (linkedinButton.checked) {
            msg.adType = "linkedin";
            msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + selectImgSrc + ",," + logo.src;
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
                flashBorder(searchResults, 3, 667);
            } else {
                flashBorder(searchBox, 3, 667);
            }
            return;
        }
        
        showSelectedAdImage(selectImgSrc);
    } else if (linkedinButton.checked) {
        if (!validateFields([adTitle, adLink, adText, adLogo])) {
            return;
        }
        
        if (!selectImgSrc) {
            if (searchResults.childNodes.length > 0) {
                flashBorder(searchResults, 3, 667);
            } else {
                flashBorder(searchBox, 3, 667);
            }
            return;
        }
        
        showSelectedAdImage(selectImgSrc);
    }
    
    sendAdInfoMsg();
    clearAdButton.style.display = "inline-block";
};

clearAdButton.onclick = function () {
    adInfo = searchQuery.value = adTitle.value = adLink.value = adLinkText.value = adText.value = adLogo.value = logo.src = searchBox.value = searchResults.innerHTML = selectImg = selectImgSrc = null;
    logo.style.visibility = "hidden";
    prevButton.style.display = nextButton.style.display = clearAdButton.style.display = "none";
    sendAdInfoMsg("removeAdInfo");
    heading.scrollIntoView();
};

heading.scrollIntoView();