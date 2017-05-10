var isMktoForm = window.setInterval(function () {
        if (typeof(MktoForms2) !== "undefined") {
            console.log("Getting: Form");
            
            window.clearInterval(isMktoForm);
            
            MktoForms2.whenReady(function (form) {
                var firstName = getCookie("onelogin_first_name"),
                lastName = getCookie("onelogin_last_name"),
                email = getCookie("onelogin_email");
                
                function getUrlParam(param) {
                    console.log("Getting: URL Parameter: " + param);
                    
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
                                console.log("URL Parameter: " + paramName + " = " + paramValue);
                                return paramValue;
                            }
                        }
                    }
                    return false;
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
                
                form.onValidate(function () {
                    var email = form.getValues().Email.toLowerCase().trim(),
                    localPart = email.split("@")[0],
                    domain = email.split("@")[1],
                    role = form.getValues().LeadRole;
                    
                    if (email.search(/["\(\),:;<>\[\]\\ ]/) != -1) {
                        form.showErrorMessage('Must be a valid email.<br>example@yourdomain.com', form.getFormElem().find("#Email"));
                        form.submittable(false);
                        return false;
                    } else if (localPart.search(/(^\.|\.$|\.\.)/) != -1) {
                        form.submittable(false);
                        form.showErrorMessage('Must be a valid email.<br>example@yourdomain.com', form.getFormElem().find("#Email"));
                        return false;
                    }
                    
                    if (domain == "marketo.com"
                         && role == "Partner") {
                        form.submittable(false);
                        form.showErrorMessage('Do not select <i>Partner</i> for your role if your email is <u>@marketo.com</u>', form.getFormElem().find("#LeadRole"));
                        return false;
                    } else if (domain != "marketo.com"
                        && role != "Partner") {
                        form.submittable(false);
                        form.showErrorMessage('Select <i>Partner</i> for your role if your email is not <u>@marketo.com</u>', form.getFormElem().find("#LeadRole"));
                        return false;
                    }
                    
                    form.vals({
                        FirstName: form.getValues().FirstName.trim(),
                        LastName: form.getValues().LastName.trim(),
                        Email: form.getValues().Email.toLowerCase().trim(),
                        domain: domain
                    });
                    
                    if (domain == "marketo.com") {
                        form.vals({
                            userId: localPart + "@marketolive.com"
                        });
                    } else if (form.getValues().LeadRole == "Partner") {
                        if (localPart.search(/\./) != -1) {
                            var firstLetter = localPart.charAt(0),
                            lastName = localPart.substring(localPart.lastIndexOf(".") + 1);
                            
                            form.vals({
                                userId: firstLetter + lastName + "." + domain.split(".")[0] + "@marketolive.com"
                            });
                        } else {
                            form.vals({
                                userId: localPart + "." + domain.split(".")[0] + "@marketolive.com"
                            });
                        }
                    }
                    
                    form.submittable(true);
                    //alert(JSON.stringify(form.vals(), null, 2));
                });
                
                form.onSuccess(function (values, followUpUrl) {
                    var title = document.getElementById("modalTitle"),
                    message = document.getElementById("theForm");
                    
                    form.getFormElem().hide();
                    message.innerHTML = "<br><div align='center'>You will receive your login account in 24 - 48 hours.</div>";
                    if (title) {
                        title.innerHTML = "Account Requested"
                    }
                    return false;
                });
                
                if (firstName != null) {
                    form.vals({
                        FirstName: firstName
                    });
                }
                
                if (lastName != null) {
                    form.vals({
                        LastName: lastName
                    });
                }
                
                if (email != null) {
                    form.vals({
                        Email: email
                    });
                }
            });
        }
    }, 0);