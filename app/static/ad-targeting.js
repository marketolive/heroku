var devExtensionId = "dokkjhbgengdlccldgjnbilajdbjlnhm",
prodExtensionId = "onibnnoghllldiecboelbpcaeggfiohl",
extensionId = devExtensionId,
googleAdInfo = getCookie("ad_info_google"),
facebookAdInfo = getCookie("ad_info_facebook"),
googleSearchButton = document.getElementById("googleSearchButton"),
facebookButton = document.getElementById("facebookButton"),
googleSearchQuery = document.getElementById("googleSearchQuery"),
adTitle = document.getElementById("adTitle"),
adLink = document.getElementById("adLink"),
adText = document.getElementById("adText"),
searchBox = document.getElementById("searchBox"),
searchButton = document.getElementById("searchButton"),
prevButton = document.getElementById("prevButton"),
nextButton = document.getElementById("nextButton"),
idealFacebookImageInfo = document.getElementById("idealFacebookImageInfo"),
searchResults = document.getElementById("searchResults"),
openAdButton = document.getElementById("openAdButton"),
key = "AIzaSyC9pdVq6GfquP_MtHCS_izS6Vijdv1ZfNc",
cx = "014680826408884315290:pmyltjjihus",
startIndex = 1,
getAndSetAdInfo,
submitOnEnterInFields,
flashBorder,
validateFields,
sendAdInfoMsg,
selectImg,
selectImgSrc,
selectImgRes;

function loadScript(scriptSrc) {
    console.log("Loading: Script: " + scriptSrc);
    
    var scriptElement = document.createElement("script");
    scriptElement.async = true;
    scriptElement.src = scriptSrc;
    document.getElementsByTagName("head")[0].appendChild(scriptElement);
}

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
                selectImgRes = this.naturalWidth + " × " + this.naturalHeight;
                this.parentElement.style.opacity = null;
                for (var jj = 0; jj < imgs.length; jj++) {
                    if (imgs[jj].src != this.src) {
                        imgs[jj].isSelected = false;
                        imgs[jj].parentElement.style.opacity = "0.5";
                    }
                }
                console.log("Ad Image: " + selectImgSrc);
            } else {
                this.isSelected = false;
                selectImg = selectImgSrc = selectImgRes = null;
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

getAndSetAdInfo = function (adType) {
    switch (adType) {
    case "googleSearch":
        if (googleAdInfo) {
            var adInfoSplit = googleAdInfo.split(",,");
            
            googleSearchQuery.value = decodeURIComponent(adInfoSplit[0]).replace(/\+/g, " ");
            adTitle.value = adInfoSplit[1];
            adLink.value = adInfoSplit[2];
            adLinkText.value = adInfoSplit[3];
            adText.value = adInfoSplit[4];
        }
        break;
    
    case "facebook":
        if (facebookAdInfo) {
            var adInfoSplit = facebookAdInfo.split(",,"),
            adImage = adInfoSplit[4],
            adImageRes = adInfoSplit[5],
            itemResult = document.createElement("div"),
            itemImg = document.createElement("img"),
            itemImgText = document.createElement("div");
            
            adTitle.value = adInfoSplit[0];
            adLink.value = adInfoSplit[1];
            adLinkText.value = adInfoSplit[2];
            adText.value = adInfoSplit[3];
            itemResult.className = "search_result";
            itemImg.className = "search_result_image";
            itemImg.src = adImage;
            itemImg.isSelected = true;
            selectImgSrc = adImage;
            itemImgText.className = "search_result_text";
            itemImgText.innerText = adImageRes + " / AR " + Math.round(adImageRes.split(" × ")[0] / adImageRes.split(" × ")[1]) / 100;
            itemImg.onclick = function () {
                if (!this.isSelected) {
                    this.isSelected = true;
                    this.parentElement.style.opacity = null;
                    selectImgSrc = adImage;
                    console.log("Ad Image: " + selectImgSrc);
                } else {
                    this.isSelected = false;
                    this.parentElement.style.opacity = "0.5";
                    selectImgSrc = selectImgRes = null;
                }
            };
            
            itemResult.appendChild(itemImg);
            itemResult.appendChild(itemImgText);
            searchResults.appendChild(itemResult);
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

sendAdInfoMsg = function () {
    var msg = {
        action: "setAdInfo",
        adType: "",
        adInfo: ""
    };
    
    if (googleSearchButton.checked) {
        var adSearchQuery = encodeURIComponent(googleSearchQuery.value).replace(/%20/g, "+");
        
        msg.adType = "googleSearch";
        msg.adInfo = adSearchQuery + ",," + adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value;
        msg.urlMatch = msg.urlCreate = "https://www.google.com/search?dynamicAd=true&q=" + adSearchQuery;
    } else if (facebookButton.checked) {
        var adTitleValue = encodeURIComponent(adTitle.value);
        
        msg.adType = "facebook";
        msg.adInfo = adTitle.value + ",," + adLink.value + ",," + adLinkText.value + ",," + adText.value + ",," + selectImgSrc + ",," + selectImgRes;
        msg.urlMatch = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue;
        msg.urlCreate = "https://www.facebook.com/?dynamicAd=true" + "&title=" + adTitleValue + "&link=" + encodeURIComponent(adLink.value) + "&linkText=" + encodeURIComponent(adLinkText.value) + "&text=" + encodeURIComponent(adText.value) + "&image=" + encodeURIComponent(selectImgSrc).replace(/%20/g, "+");
    }
    
    chrome.runtime.sendMessage(extensionId, msg, function (response) {
        console.log("Receiving: Message Response from Background: " + response);
        //window.close();
    });
};

googleSearchButton.onclick = function () {
    getAndSetAdInfo("googleSearch");
    submitOnEnterInFields([googleSearchQuery, adTitle, adLink, adLinkText, adText], openAdButton.onclick);
    googleSearchQuery.style.display = "block";
    adTitle.style.display = "block";
    adLink.style.display = "block";
    adLinkText.style.display = "block";
    adText.style.display = "block";
    searchBox.style.display = "none";
    searchButton.style.display = "none";
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    idealFacebookImageInfo.style.display = "none";
    searchResults.style.display = "none";
    openAdButton.style.display = "inline-block";
};

facebookButton.onclick = function () {
    getAndSetAdInfo("facebook");
    submitOnEnterInFields([adTitle, adLink, adLinkText, adText], openAdButton.onclick);
    submitOnEnterInFields([searchBox], searchButton.onclick);
    googleSearchQuery.style.display = "none";
    adTitle.style.display = "block";
    adLink.style.display = "block";
    adLinkText.style.display = "block";
    adText.style.display = "block";
    searchBox.style.display = "inline-block";
    searchButton.style.display = "inline-block";
    idealFacebookImageInfo.style.display = "block";
    searchResults.style.display = "block";
    openAdButton.style.display = "inline-block";
    
    if (searchResults.childNodes.length > 0) {
        nextButton.style.display = "inline-block";
        if (startIndex > 1) {
            prevButton.style.display = "inline-block";
        }
    }
};

searchButton.onclick = function (startIndex) {
    if (!Number.isInteger(startIndex)) {
        startIndex = 1;
    }
    searchResults.innerHTML = null;
    loadScript("https://www.googleapis.com/customsearch/v1?key=" + key + "&cx=" + cx + "&fields=queries(request/startIndex,previousPage/startIndex,nextPage/startIndex),items(link,image/height,image/width)&filter=1&num=10&searchType=image&imgType=photo&callback=resultsHandler&q=" + encodeURIComponent(searchBox.value) + "&start=" + startIndex);
};

openAdButton.onclick = function () {
    if (googleSearchButton.checked) {
        if (!validateFields([googleSearchQuery, adTitle, adLink, adText])) {
            return;
        }
    } else if (facebookButton.checked) {
        if (!validateFields([adTitle, adLink, adText])) {
            return;
        }
    }
    
    if (selectImgSrc
         && selectImgRes) {
        sendAdInfoMsg();
    } else {
        if (searchResults.childNodes.length > 0) {
            flashBorder(searchResults, 3, 500);
        } else {
            flashBorder(searchBox, 3, 500);
        }
    }
};

document.onkeyup = function (e) {
    if (e.which == 13) {
        startIndex = 1;
        openAdButton.click();
    }
};