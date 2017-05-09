var isMktoForm = window.setInterval(function () {
        if (typeof(MktoForms2) !== "undefined") {
            console.log("Getting: Form");
            
            window.clearInterval(isMktoForm);
            
            MktoForms2.whenReady(function (form) {
                var firstNameCookieName = "onelogin_first_name",
                lastNameCookieName = "onelogin_last_name",
                emailCookieName = "onelogin_email";
                
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
                    var email = form.getValues().Email.toLowerCase(),
                    domain = email.split("@")[1],
                    role = form.getValues().LeadRole;
                    
                    if (domain == "marketo.com"
                         && role == "Partner") {
                        form.submittable(false);
                        form.showErrorMessage('Do not select <i>Partner</i> for your Role if your email is <u>@marketo.com</u>!', form.getFormElem().find("#LeadRole"));
                    } else if (domain != "marketo.com"
                        && role != "Partner") {
                        form.submittable(false);
                        form.showErrorMessage('Select <i>Partner</i> for your Role if your email is not <u>@marketo.com</u>!', form.getFormElem().find("#LeadRole"));
                    } else {
                        form.submittable(true);
                    }
                });
                
                form.onSubmit(function () {
                    var email = form.getValues().Email.toLowerCase(),
                    shortName = email.split("@")[0],
                    domain = email.split("@")[1];
                    
                    form.vals({
                        Email: email
                    });
                    
                    if (typeof(form.getValues().domain) != "undefined") {
                        form.vals({
                            domain: domain
                        });
                    }
                    
                    if (typeof(form.getValues().userId) != "undefined") {
                        if (domain == "marketo.com") {
                            form.vals({
                                userId: shortName + "@marketolive.com";
                            });
                        } else if (form.getValues().LeadRole == "Partner") {
                            if (email.search(/\./) != -1) {
                                var firstLetter = shortName.charAt(0),
                                lastName = shortName.substring(shortName.lastIndexOf(/\./) + 1);
                                
                                form.vals({
                                    userId: firstLetter + lastName + "." + domain.split(".")[0] + "@marketolive.com";
                                });
                            } else {
                                form.vals({
                                    userId: shortName + "." + domain.split(".")[0] + "@marketolive.com";
                                });
                            }
                        }
                    }
                    
                    alert(JSON.stringify(form.vals(), null, 2));
                });
                
                form.onSuccess(function (values, followUpUrl) {
                    window.location.href = "http://www.marketolive.com";
                    return false;
                });
                
                if (typeof(form.getValues().Email) != "undefined") {
                    var email = getCookie(emailCookieName);
                    
                    if (email != null) {
                        form.vals({
                            Email: email
                        });
                    } else {
                        return null;
                    }
                }
                
                if (typeof(form.getValues().FirstName) != "undefined") {
                    var firstName = getCookie(firstNameCookieName);
                    
                    if (firstName != null) {
                        form.vals({
                            FirstName: firstName
                        });
                    }
                }
                
                if (typeof(form.getValues().LastName) != "undefined") {
                    var lastName = getCookie(lastNameCookieName);
                    
                    if (lastName != null) {
                        form.vals({
                            LastName: lastName
                        });
                    }
                }
                
                //console.log(JSON.stringify(form.vals(), null, 2));
            });
        }
    }, 0);