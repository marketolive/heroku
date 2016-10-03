import requests, re
from fake_useragent import UserAgent

def request(numOfFormFills, firstName, lastName, email, domain, formId, subId, formVid, lpId, munchkinId, mktoReferrer):
    if numOfFormFills:
        numOfFormFills = int(numOfFormFills)
        if numOfFormFills < 0:
            numOfFormFills = 1
    else:
        numOfFormFills = 1
    
    if not firstName:
        firstName = "MarketoLive"
    
    if not lastName:
        lastName = "Team"
    
    if not email:
        email = "noreply@marketolive.com"
    
    if not mktoReferrer:
        mktoReferrer = "http://www.marketolive.com"
    
    if domain and formId and subId and formVid and lpId and munchkinId:
        error = re.compile("error")
        ua = UserAgent()
        headers = {
            "User-Agent": ua.random
        }
        
        formId = int(formId)
        subId = int(subId)
        formVid = int(formVid)
        lpId = int(lpId)
        
        payload = {
            FirstName : firstName,
            LastName : lastName,
            Email : email,
            formid : formId,
            subId : subId,
            formVid : formVid,
            lpId : lpId,
            munchkinId : munchkinId,
            _mktoReferrer : mktoReferrer
        }
        
        url = "http://"+domain+"/index.php/leadCapture/save2"
        
        for i in range(numOfFormFills):
            rsp = requests.get(url, headers=headers, params=payload)
            rspContent = rsp.content.decode("utf-8")
            if error.search(rspContent):
                output = "FAILED: " + rspContent
            else:
                output = "SUCCESS: " + rspContent
            return output