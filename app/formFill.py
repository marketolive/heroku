import requests, re
from fake_useragent import UserAgent

error = re.compile("error")
ua = UserAgent()
headers = {
    "User-Agent": ua.random
}
url = "http://na-sjp.marketo.com/index.php/leadCapture/save2"
payload = {
    "FirstName" : "Brian", 
    "LastName" : "Fisher", 
    "Email" : "ick.treat+bfisher@gmail.com", 
    "DateofBirth" : "1968-03-26", 
    "Company" : "Consumer - Brian Fisher - bfisher", 
    "Lead_Type__c" : "Consumer", 
    "LeadSource" : "Web", 
    "Contact_Account_ID__c" : "NULL", 
    "formid" : 3587, 
    "subId" : 181, 
    "formVid" : 3587, 
    "lpId" : 12192, 
    "munchkinId" : "026-COU-482", 
    "_mktoReferrer" : "http://na-sjp.marketo.com/lp/026-COU-482/Loyalty-Profile-Registration.html"
}

def request:
    rsp = requests.get(url, headers=headers, params=payload)
    with open("templates/en/data/form-fill-results.html", "w") as file:
        if error.search(rsp.content.decode("utf-8")):
            file.write("FAILED: ")
        else:
            file.write("SUCCESS: ")
        
    with open("templates/en/data/form-fill-results.html", "ab") as file:
        file.write(rsp.content)
    return