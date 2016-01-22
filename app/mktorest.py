__author__ = "Andrew Garcia <angarcia@marketo.com>"

import time
import httplib2
import json
import logging
#import settings

# TODO

# Figure out how to fix the POST calls that take multipart files
# Do more elegant error handling and document the exceptions
# Be more consistent with folder_id vs. folder
# Double check all the call URLs
# Test if you can include a cookie value in create/update and Marketo will automatically merge the activities
# Explicitly cast all variables to protect against type errors at runtime
# Refactor API calls into similar groups. E.G. create/update leads an opps is duplicated code. So are opp and opp role.
# Possibly eliminate documentation redundancies

# Incomplete calls

# import_lead
# create_token

############################################################################################
#                                                                                          #
#                                    Utilities                                             # 
#                                                                                          #             
############################################################################################

def listify_parameter(name, values):
    """
    This method is used to reduce the amount of for loops in the function definitions.
    There is a large number of API calls that accept multiple values, and the way to 
    format the REST URL is to append the same parameter multiple times
    e.g. ...example.json?id=value1&id=value2&id=value3 etc. This method outputs the
    repeated parameter name with each value given.
    
    Args:
        name (string):  The name of the parameter to include in the URL.
        values (list):  The list of values to use in the URL.
    
    Returns:
        string: A query string that has "name=value1&name=value2..." for each
                value given in the input list.
    """
    query_string = ""
    for ii in range(len(values)):
        query_string += "&"+str(name)+"="+str(values[ii])
    return query_string

############################################################################################
#                                                                                          #
#                                Class Definition                                          # 
#                                                                                          #             
############################################################################################

class MarketoWrapper:
    """
    This class serves as a wrapper for the Marketo REST API. It is used
    in marketo_connector.py as the interface to a marketo instance.
    
    Attributes:
        __token (string):       The access token to be used to authenticate
                                API calls. 
        __expire_time (float):  When the access token expires and needs to be regenerated.
                                It is checked before every API call.
        __http (httplib2.Http): The HTTP object the wraps all of the HTTP functionality required.
        __munchkin (string):    The munchkin ID of the Marketo instance.
    """

############################################################################################
#                                                                                          #
#                                   Constructor                                            # 
#                                                                                          #             
############################################################################################

    def __init__(self, munchkin_id, client_id, client_secret):
        """
        The constructor performs all initialization as well as generates
        the first access token. All API calls will double check to make 
        sure the token is still valid before executing.
        
        Args:
            munchkin_id (string):    The munchkin ID of the Marketo instance.
            client_id (string):      The client ID of the appropriate API user.
            client_secret (string):  The client secret of the appropriate API user.
        """
        self.__munchkin = munchkin_id
        # The httplib2.Http constructor takes an optional directory argument
        # where caching will be done. The directory does not need to exist beforehand.
        self.__http = httplib2.Http()
        # This will store credentials in __http so they do not need to be passed
        # each time a token is requested.
        self.__http.add_credentials(client_id, client_secret)
        # This value will be overwritten by _getAccessToken, so it is just
        # used for initialization
        self.__expire_time = 0
        self.__token = self.__generateAccessToken(self.__munchkin)

############################################################################################
#                                                                                          #
#                                   Private Methods                                        # 
#                                                                                          #             
############################################################################################
    
    def __generateAccessToken(self, munchkin_id):
        """
        This method requests a new access token from the REST API identity endpoint.
        
        Note:
            The client ID and secret required to generate the token were added to the 
            __http attribute in the class constructor, so if the server requires authentication
            (it does), the httplib2 module does the credential handling automatically.
        
        Args:
            None
            
        Returns:
            string: The access token given by the server.
        """
        # Request the token
        response, content = self.__http.request("https://"+self.__munchkin+
                                               ".mktorest.com/identity/"+
                                               "oauth/token?grant_type=client_credentials")
        # If the request was successful, return the token.
        if (response.status == 200):
            content = json.loads(content.decode("utf-8"))
            self.__reset_expire_time(content["expires_in"])
            return content["access_token"]
        else:
            raise Exception(str(response.status)+"\n"+response.reason)

    def __generic_api_call(self, call, method, content_type=None, payload=None, headers=None):
        """
        This method executes a generic API call to the REST API endpoint. The correct syntax
        should be passed into this method from inside of each call wrapper. 
        
        Args:
            call (string):                    The actual API call to make. This method contains the endpoint itself,
                                              but the desired call must be given from outside.
            method (string):                  The HTTP method to use (GET, POST, PUT etc.).
            content_type (string, optional):  What to set as the Content-type HTTP header.
            payload (string, optional):       Any payload that should be sent to the server.
            headers (dict, optional):         Any custom headers to send. The access token is added automatically.
                                              inside the method, so it does not need to be added manually from outside.
        
        Returns:
            dict: A dictionary representing the JSON response from the Marketo server.
        
        """
        # Default parameters in Python work differently than in other languages. See
        # this link for a full description: http://effbot.org/zone/default-values.htm
        if content_type is None:
            content_type = "application/json"
        if payload is None:
            payload = {}
        if headers is None:
            headers = {}
            
        # Check to see if the token has expired. If so, generate a new one.
        if self.__expire_time < time.time():
            self.__token = self.__generateAccessToken(self.__munchkin)
        
        # Add the access token to the HTTP header. 
        headers["Authorization"] = "Bearer "+self.__token
        # Prevents mismatch errors by exlicitly requesting json.
        headers["Content-type"] = content_type
        # Make the API call.
        response, content = self.__http.request("https://"+self.__munchkin+".mktorest.com/"+
                                                    call, method, body=payload, headers=headers)
        
        # If the call was successful, return the content retrieved from the server.
        if (response.status == 200):
            return json.loads(content.decode("utf-8"))
        else:
            raise Exception(str(response.status)+"\n"+response.reason)
    
    def __reset_expire_time(self, expiresIn):
        """
        This method is used to reset the clock on an access token. When a new token is 
        generated, this method should be called with the "expires_in" field of the
        response from the Marketo identity endpoint. 
        
        Args:
            expiresIn (int):    The number of seconds until the new token expires. It should
                                be retrieved from the response of the Marketo identity endpoint.
                                
        Returns:
            None
        """
        self.__expire_time = time.time() + expiresIn

############################################################################################
#                                                                                          #
#                                   Paging Token                                           # 
#                                                                                          #             
############################################################################################

    def get_paging_token(self, since_date_time):
        """
        This method is used to retrive a paging token from the Marketo database. Paging 
        tokens are for bulk API calls where the server needs to send multiple responses.
        This method should be used when initiating a bulk call, and the server will then
        return subsequent paging tokens in order to keep place inside the database.
        Args:
            since_date_time (string):    This is used to initiate the database search.
                                         It does not need to be any specific time, but
                                         it should be different than others used.
        Returns:
            string: The paging token given by the Marketo server.
        """
        call = "rest/v1/activities/pagingtoken.json?sinceDatetime="+since_date_time
        method = "GET"
        response = self.__generic_api_call(call, method)
        return response["nextPageToken"]
    
############################################################################################
#                                                                                          #
#                                   Lead API Calls                                         # 
#                                                                                          #             
############################################################################################
    
    def get_lead_by_id(self, lead, fields=None):
        """
        This method retrieves a lead's attributes by its id. The fields parameter can specify 
        particular fields to return. The default return fields can be found in the developer's
        documentation.
        
        Args:
            lead (string):              The id of the lead needed.
            fields (list, optional):    A list of fields to include in the response.
            
        Returns:
            dict:   A dictionary that contains all of the lead attributes.
        """            
        call = "rest/v1/lead/"+str(lead)+".json"
        if fields is not None:
            call += "?fields="+",".join(map(str, fields))
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_multiple_leads_by_filter_type(self, filter_type, filter_values, fields=None, 
                                          batch_size=None, paging_token=None):
        """
        This method uses a given filter to retrieve all leads that fit a certain criteria. It
        does not support any fuzzy logic. The filter works by matching lead fields against the
        exact values specified in the filter_values parameter. 
        
        Args:
            filter_type (string):               This should be the API name of the lead field to filter on.
            filter_values (list):               This is a list of possible values for the lead field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired lead fields to be included in the response.
            batch_size (int, optional):         The number of leads to include in the response. Default and max is 300.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
        
        Returns:
            dict:   A dictionary that contains the server response. The results attribute will contain an
                    array of dictionaries representing each lead that matched the filter.
        """
        call = "rest/v1/leads.json?filterType="+str(filter_type)+"&filterValues="+",".join(map(str, filter_values))
        if fields is not None:
            call += "&fields="+",".join(map(str, fields))
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if paging_token is not None:
            call += "&nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_multiple_leads_by_list_id(self, list_id, fields=None, batch_size=None, paging_token=None):
        """
        This method uses a given filter to retrieve all leads that are members of a static list. This
        method does not support smart lists.
        
        Args:
            list_id (int):                      The id of the desired static list.
            fields (list, optional):            A list of desired lead fields to be included in the response.
            batch_size (int, optional):         The number of leads to include in the response. Default and max is 300.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
        
        Returns:
            dict:   A dictionary that contains the server response. The results attribute will contain an
                    array of dictionaries representing each lead that is part of the list.
        """
        call = "rest/v1/list/"+str(list_id)+"/leads.json?"
        
        # This code will generate a URL of the form ".../leads/json?&...".
        # The ampersand immediately following the question mark does not
        # generate any errors.
        if fields is not None:
            call += "&fields="+",".join(map(str, fields))
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if paging_token is not None:
            call += "&nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_multiple_leads_by_program_id(self, program_id, fields=None, batch_size=None, paging_token=None):
        """
        This method uses a given filter to retrieve all leads that are members of a program.
        
        Args:
            program_id (int):                   The id of the desired static list.
            fields (list, optional):            A list of desired lead fields to be included in the response.
            batch_size (int, optional):         The number of leads to include in the response. Default and max is 300.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
        
        Returns:
            dict:   A dictionary that contains the server response. The results attribute will contain an
                    array of dictionaries representing each lead that is part of the program.
        """
        call = "rest/v1/leads/programs/"+str(program_id)+".json?"
        
        # This code will generate a URL of the form "...json?&...".
        # The ampersand immediately following the question mark does not
        # generate any errors.
        if fields is not None:
            call += "&fields="+",".join(map(str, fields))
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if paging_token is not None:
            call += "&nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def create_update_leads(self, leads, action=None, lookup_field=None, async=None, partition=None):
        """
        This method makes takes an array of dictionaries that represent all of the leads
        and their attributes that should be updated in Marketo. It takes that array, and
        does an upsert operation to the Marketo database.
        
        Args:
            leads (list):                       A list of dicts containing all of the leads to upload
            action (string, optional):          This tells the server how to process the leads. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
                                                'createDuplicate'
            lookup_field (string, optional):    This specifies which field to use to identify 
                                                duplicates. Deault is email.
            async (bool, optional):             Tells the server to process the updates asynchronously. The
                                                default is false.
            partition (string, optional):       Specifies which partition to do the operation on. This becomes
                                                a required parameter if the Marketo instance has lead partitions.
            
        Returns:
            dict:   A dictionary that has the completion status for each lead in the input.
        """
        call = "rest/v1/leads.json"
        method = "POST"
        payload = {"input": leads}
        if action is not None:
            payload["action"] = str(action)
        if lookup_field is not None:
            payload["lookupField"] = str(lookup_field)
        if async is not None:
            payload["asyncProcessing"] = str(async)
        if partition is not None:
            payload["partitionName"] = str(partition)
        # Use json.dumps() because the httplib2 does not serialize dictionary
        # objects by default.
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def associate_lead(self, lead_id, cookie):
        """
        This method is used to merge an anonymous lead's activity into a known lead's
        activity record. An example of when this is necessary is if a customer has multiple
        domains, but a user has only converted on domain A. If the customer has a mechanism
        for identifying that same user on domain B without a Marketo form fill, this method
        will make the lead known to domain B inside of Marketo.
        
        Args:
            lead_id (int):      The id of the lead to merge. 
            cookie (string):    The munchkin tracking id of the user. This can be retrieved
                                through Javascript on the web page. See this link for the 
                                specific format that is needs to be in:
                                http://developers.marketo.com/documentation/rest/associate-lead/
                                
        Returns:
            dict: The response from the server indicating success or failure.
        """
        call = "rest/v1/leads/"+str(lead_id)+"/associate.json?cookie="+str(cokie)
        method = "POST"
        return self.__generic_api_call(call, method)
    
    def merge_lead(self, winner, losers, crm_merge=None):
        """
        This method merges two or more leads. The winner's attributes will be preferred over the loser(s).
        Optionally, the leads can be merged in CRM as well. The convention of the API call is such that 
        the winning lead's id is given in the URL, and the losing lead is passed as the leadIds paramenter
        in the API call. This implementation only uses the leadIds parameter as opposed to the leadId
        parameter. The difference is that the leadId takes a single id and leadIds takes a list. 
        For consistency, this method always takes a list even if there is only one id in it.
        
        Args:
            winner (int):               The lead id of the authoritative lead.
            losers (list):              A list of the lead ids to merge, but will yield to winner 
                                        for conflicting values.
            crm_merge (bool, optional): Specifies whether or not to merge in CRM. This can be
                                        difficult to do. Please refer to the below for the
                                        semantics of this parameter:
                                        
        Use only one winning lead id and one losing lead id when enabling this parameter.
        If both leads are in SFDC and one is a CRM lead and the other is a CRM contact, then the 
        winner is the CRM contact (regardless which lead is specified as winner).  
        Note that the leads are merged within SFDC.
        If one of the leads is in SFDC and the other is Marketo only, then the winner is the 
        SFDC lead (regardless of which lead is specified as winner).
                                            
        Returns:
            dict:   The response from the server indicating success or failure.
        """
        call = "rest/v1/leads/"+leadID+"/merge.json"
        method = "POST"
        headers = {"leadIds": ",".join(map(str, losers))}
        if crm_merge is not None:
            headers["mergeInCRM"] = str(crm_merge)
        return self.__generic_api_call(call, method, headers=headers)
    
    def get_lead_partitions(self):
        """
        This method returns a list of all the lead partitions in Marketo.
        
        Args:
            None
        
        Returns:
            dict:   The response from the server. The result attribute contains a list of dictionaries
                    that has the id and name of each partition.
        """
        call = "rest/v1/leads/partitions.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def import_lead(self, file_format, file_name, lookup_field=None, list_id=None, partition=None):
        """
        This method syncs leads in bulk using CSV files (or TSV/SSV). It is asynchronous, and
        the limit on the file size is 10MB. Since it is an asynchronous call, you can schedule
        multiple sync jobs using it, but there is a limit of 10 total file imports that can
        be in the queue at once. 
        
        Args:
            file_format (string):               The format of the file, which can be 'csv', 'tsv', or 'ssv'.
            file_name (string):                 The path to the desired file.
            lookup_field (string, optional):    The field to use to identify duplicates. By default, it is email.
            list_id (int, optional):            The static list to import that leads to. If omitted, the system
                                                will create a temporary list
            partition (string, optional):       If partitions are setup, this should be used to specify which
                                                partition to use. If it isn't specified, it will use the
                                                primary partition, and the temp list will go into the first
                                                workspace in that partition.
        
        Returns:
            dict:   The response from the server. The result attribute contains a batch id which can
                    be used to query the system for the status of the import since the import
                    is asynchronous.
        """
        pass
    
    def get_import_status(self, batch_id):
        """
        This method queries for the status the import with the given batch id.
        
        Args:
            batch_id (int):     The id of the desired batch. This is given in the return
                                JSON of the import_lead call.
        
        Returns:
            dict: The response from the server. It includes the status, number of leads processed,
            numnber of failures, number of warnings, and a message.
        """
        call = "bulk/v1/leads/batch/"+str(batch_id)+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_import_failure_file(self, batch_id):
        """
        If an import fails, the file containing the failure can be retrieved with this method.
        
        Args:
            batch_id (int):     The id of the desired batch. This is given in the return
                                JSON of the import_lead call.
        
        Returns:
            dict:   The response from the server. It returns a file in the same
                    format that was used in the import_lead call.
        """
        call = "bulk/v1/leads/batch/"+str(batch_id)+"failures.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_import_warning_file(self, batch_id):
        """
        This is the same as get_import_failure_file except that it retrieves a file
        with warnings instead of failures.
        
        Args:
            batch_id (int):     The id of the desired batch. This is given in the return
                                JSON of the import_lead call.
        
        Returns:
            dict:   The response from the server. It returns a file in the same
                    format that was used in the import_lead call.
        """
        call = "bulk/v1/leads/batch/"+str(batch_id)+"failures.json"
        method = "GET"
        return self.__generic_api_call(call, method)

    def describe_lead(self):
        """
        This method retrives all of the fields associated to the lead objects.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server. The result attribute has information
                    about all of the lead fields such as the name, type, API name,
                    and whether or not it is editable.
        """
        call = "rest/v1/leads/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_lead_activity_types(self):
        """
        This method returns all of the possible activity types.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server. The "result" attribute contains an array 
                    of dictionaries that represent each activity types. It includes the 
                    activity id, name, attributes, description etc.
        """
        call = "rest/v1/activities/types.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_lead_activities(self, activity_type_ids, paging_token, list_id=None, batch_size=None):
        """
        This method returns a list of lead activities that are filtered by the activity_type_ids
        parameter. That is, it returns all activities whose types match one of the types given
        in the parameter. The paging token is used because the list returned by the server may be 
        too large for a single response, and must be fragmented across responses. See this resource
        for more on paging tokens: http://developers.marketo.com/documentation/rest/get-paging-token
        Args:
            activitity_type_ids (list): A list of integers indicating the activity ids to filter on
            paging_token (string):      The paging token that will be used to iterate through the database
            list_id (int, optional):    The id of a list of leads to retrieve activities for.
            batch_size (int, optional): How many results the server will return at a time. Default and max
                                        is 300.
        Returns:
            dict:   The response from the server. The "result" attribute contains an array 
                    of dictionaries that represent the lead activities. They include the 
                    lead id, activity type id, primary attribute value etc.
        """
        call =  "rest/v1/activities.json?"+"nextPageToken="+paging_token
        if list_id is not None:
            call += "&listId="+str(list_id)
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        call += lisitfy_parameter("activityTypeIds", activity_type_ids)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    #TODO - check for >300 activities
    def add_lead_activities(self, activities):
        """
        This method appends the given activities to the Marketo lead database.
        Args:
            activities (list):  A list of dicts containing all of the activites to upload.
                                The format should be of the following:
                                {         
                                    "leadId":1001,
                                    "activityDate":"2013-09-26T06:56:35+07:00",
                                    "activityTypeId":1001,
                                    "primaryAttributeValue":"Game Giveaway",
                                    "attributes":[  
                                        {  
                                           "name":"URL",
                                           "value":"http://www.nvidia.com/game-giveaway"
                                        }
                                    ]
                                }
                                Please see the developer documentation for more.
        Returns:
            dict:   The response from the server. The "result" attribute contains an array
                    of dictionaries that contain the completion status for each activity.
        """
        call = "rest/v1/activities/external.json"
        method = "POST"
        payload = {"input": activities}
        # Use json.dumps() because httplib2 does not serialize dictionary
        # objects by default.
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def get_lead_changes(self, paging_token, fields, batch_size=None, list_id=None):
        """
        This method retrieves all of the data value changes for leads. The paging_token
        parameter is used to specify the timeframe (see get_paging_token()), and fields
        is a list of field changes to look for. Data changes in fields other than the
        ones specified in the list will not be included in the response.
        Args:
            paging_token (string):          This is used both to paginate through the
                                            response as well as dictate the timeframe
                                            in which to look for changes.
            fields (list):                  This is a list that specifies which fields to
                                            search for changes to.
            batch_size (int, optional):     How many results the server will return at a time. 
                                            Default and max is 300.
            list_id (int, optional):        The id of a list of leads to retrieve activities for.
        """
        call = "rest/v1/activities/leadchanges.json?"
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if list_id is not None:
            call += "&listId="+str(list_id)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def delete_lead(self, leads):
        """
        This method deletes the given leads from the database. 
        
        Args:
            leads (list):   A list of dictionaries that contain the
                            lead ids to delete. The fomatting is as follows:
                            {
                                "id": 1
                            },
                            {
                                "id": 2
                            }
        
        Returns:
            dict:   The response from the server that contains all of the status
                    information for each of the leads.
        """
        call = "rest/v1/leads.json"
        method = "DELETE"
        payload = {"input": leads}
        return self.__generic_api_call(self, method, payload=json.dumps(payload))
    
    def get_deleted_leads(self, paging_token, batch_size=None):
        """
        This method retrieves all of the deleted leads from Marketo. This information
        is unconfirmed, but the understanding on the SC team is that this call can be
        used for leads deleted within the 90 days prior to making the call.
        
        Args: 
            paging_token (string):          This is used both to paginate through the response.
        Returns:
            dict:   The response from the server that has the lead ids that
                    were deleted as well as the date they were deleted.
        """
        call = "rest/v1/activities/deletedleads.json?nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def update_lead_partition(self, leads):
        """
        This method updates the lead partition that the given leads are housed in.
        
        Args:
            leads (list):   This is a list of dictionaries that represent the leads to
                            update. Each dictionary should have the lead id and the partition
                            name to place the lead in. E.G.
                            [  
                                {  
                                "id":1234,
                                "partitionName" : "Europe"
                                },
                                {  
                                "id":2322,
                                "partitionName" : "Europe"
                                }
                            ]
        
        Returns:
            dict:   The response from the server that has the status information for each lead.
        """
        call = "rest/v1/leads/partitions.json"
        method = "POST"
        payload = {"input": leads}
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                                   List API Calls                                         # 
#                                                                                          #             
############################################################################################
    
    def get_list_by_id(self, list_id):
        """
        This method retrieves metadata about a list not the leads that are inside of it. To 
        obtain the leads, use the get multiple leads call. The list id can be retrieved by 
        using the get multiple lists call using the list name.
        
        Args:
            list_id (int):  The id of the desired list.
            
        Returns:
            dict:   The response from the server that contains the information about the list
                    such as created date, updated date, description etc.
        """
        call = "rest/v1/lists/"+str(list_id)+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_multiple_lists(self, list_ids=None, names=None, programs=None, workspaces=None, 
                           batch_size=None, paging_token=None):
        """
        This method returns metadata about all of the lists that match the given criteria. It
        does not return the leads who are members of the lists. If no parameters are given,
        it will retrieve all of the lists inside Marketo.
        
        Args:
            NOTE: all of the filter parameters support one or more values.
            list_ids (list, optional):          A list of ids to match.
            names (list, optional):             A list of names to match.
            programs (list, optional):          A list of program names to match.
            workspaces (list, optional):        A list of workspace names to search in.
            batch_size (int, optional):         The number of records to return at once. The default
                                                and max is 300.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
        
        Returns:
            dict:   The response from the server. The result attribute will contain a list of 
                    dictionaries that have the metadata about the lists.
        """
        call = "rest/v1/lists.json?"
        if list_ids is not None:
            call += listify_parameter("id", list_ids)
        if names is not None:
            call += listify_parameter("name", names)
        if programs is not None:
            call += listify_parameter("programName", programs)
        if workspaces is not None:
            call += listify_parameter("workspaceName", workspaces)
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if paging_token is not None:
            call += "&nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def add_leads_to_list(self, list_id, leads):
        """
        This method will add the given leads to the specified list. 
        
        Args:
            list_id (int):  The id of the list to append to.
            leads (list):   A list of dictionaries containing all of the leads to add. 
                            The only lead attribute required is the lead id. E.G.
                            [
                                  {
                                     "id": "1"
                                  },
                                  {
                                     "id": "2"
                                  }
                            ]
        Returns:
            dict:   The response from the server. The result attribute contains the status information
                    for each lead.
        """
        call = "rest/v1/lists/"+str(list_id)+"/leads.json"
        method = "POST"
        payload = {"input": leads}
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def remove_leads_from_list(self, list_id, leads):
        """
        This method will remove the given leads from the specified list. 
        
        Args:
            list_id (int):  The id of the list to delete from.
            leads (list):   A list of dictionaries containing all of the leads to delete. 
                            The only lead attribute required is the lead id. E.G.
                            [
                                  {
                                     "id": "1"
                                  },
                                  {
                                     "id": "2"
                                  }
                            ]
        Returns:
            dict:   The response from the server. The result attribute contains the status information
                    for each lead.
        """
        call = "rest/v1/lists/"+str(list_id)+"/leads.json"
        method = "DELETE"
        payload = {"input": leads}
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def is_member_of_list(self, list_id, leads):
        """
        This method will determine if the leads are members of the given list.
        
        Args:
            list_id (int):  The id of the list to query.
            leads (list):   A list of dictionaries containing all of the leads. 
                            The only lead attribute required is the lead id. E.G.
                            [
                                  {
                                     "id": "1"
                                  },
                                  {
                                     "id": "2"
                                  }
                            ]
        Returns:
            dict:   The response from the server. The result attribute contains the membership information
                    for each lead. The two statuses possible are 'memberof' and 'notmemberof'
        """
        call = "rest/v1/lists/"+str(list_id)+"/leads/ismember.json"
        method = "POST"
        payload = {"input": leads}
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                                Campaign API Calls                                        # 
#                                                                                          #             
############################################################################################
    
    def get_campaign_by_id(self, camp_id):
        """
        This method obtains metadata about a campaign.
        
        Args:
            camp_id (int):  This id of the desired campaign. This can be obtained via
                            the get multiple campaigns call.
                            
        Returns:
            dict:   The response from the server. The result attribute contains the metadata
                    such as created date, modified date etc.
        """
        call = "/rest/v1/campaigns/"+str(camp_id)+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_multiple_campaigns(self, camp_ids=None, names=None, programs=None, 
                               workspaces=None, batch_size=None, paging_token=None):
        """
        This method returns metadata about all of the campaigns that match the given criteria. 
        If no parameters are given, it will retrieve all of the campaigns inside Marketo.
        
        Args:
            NOTE: all of the filter parameters support one or more values.
            list_ids (list, optional):          A list of ids to match.
            names (list, optional):             A list of names to match.
            programs (list, optional):          A list of program names to match.
            workspaces (list, optional):        A list of workspace names to search in.
            batch_size (int, optional):         The number of records to return at once. The default
                                                and max is 300.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
        
        Returns:
            dict:   The response from the server. The result attribute will contain a list of 
                    dictionaries that have the metadata about the lists.
        """
        call = "rest/v1/campaigns.json?"
        if list_ids is not None:
            call += listify_parameter("id", camp_ids)
        if names is not None:
            call += listify_parameter("name", names)
        if programs is not None:
            call += listify_parameter("programName", programs)
        if workspaces is not None:
            call += listify_parameter("workspaceName", workspaces)
        if batch_size is not None:
            call += "&batchSize="+str(batch_size)
        if paging_token is not None:
            call += "&nextPageToken="+str(paging_token)
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def schedule_campaign(self, camp_id, tokens=None, run_at=None, clone_to=None):
        """
        This method schedules a campaign to run inside of Marketo. The difference between
        schedule campaign and request campaign is that schedule campaign uses a smart list
        inside of Marketo whereas request campaign tells Marketo which leads to run through
        the campaign. 
        Args:
            camp_id (int):                  The id of the campaign to be scheduled. This can be retrieved by
                                            making the get multiple campaigns call.
            tokens (list, optional):        A list of dictionaries that have the key/value pairs for the
                                            program tokens corresponding to that campaign. These tokens will
                                            not overwrite the ones configured in Marketo.
            run_at (string, optional):      A datetime string for when the campaign should run. If omitted,
                                            it defaults to five minutes in the future.
            clone_to (string, optional):    If this parameter is used, the parent program of the campaign will be
                                            cloned, and the newly created campaign will be the one to run.
        Returns:
            dict:   The response from the server that indicates success or failure.
        """
        call = "rest/v1/campaigns/"+camp_id+"/schedule.json"
        method = "POST"
        payload = {}
        if tokens is not None:
            payload["tokens"] = tokens
        if run_at is not None:
            payload["runAt"] = run_at
        if clone_to is not None:
            payload["cloneToProgramName"] = clone_to
        # This is an inconsistency with the API where all parameters should be inside
        # the 'input' attribute of the request for this API call.
        return self.__generic_api_call(call, method, json.dumps({"input": payload}))
    
    def request_campaign(self, camp_id, leads, tokens=None):
        """
        This method fires the 'Campaign is Requested' trigger inside Marketo. This is used to
        run leads through a campaign in Marketo without having to construct a smart list.
        Args:
            camp_id (int):                  The id of the campaign. This can be retrieved by
                                            making the get multiple campaigns call.
            leads (list):                   A list of dictionaries containing all of the leads. 
                                            The only lead attribute required is the lead id. E.G.
                                            [
                                                  {
                                                     "id": "1"
                                                  },
                                                  {
                                                     "id": "2"
                                                  }
                                            ]
            tokens (list, optional):        A list of dictionaries that have the key/value pairs for the
                                            program tokens corresponding to that campaign. These tokens will
                                            not overwrite the ones configured in Marketo.
        """
        call = "rest/v1/campaigns/"+str(camp_id)+"/trigger.json"
        method = "POST"
        payload = {"input": leads}
        if tokens is not None:
            payload["tokens"] = tokens
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                             Opportunity API Calls                                        # 
#                                                                                          #             
############################################################################################
    
    def describe_opportunity(self):
        """
        This API call retrieves all of the metadata associated with the opportunity
        object including all of the fields.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes the id field, all of the
                    dedupe fields, the searchable fields and the non-searchable fields.
        """
        call = "rest/v1/opportunities/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def create_update_opportunities(self, opps, action=None, dedupe_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the oportunities
        and their attributes that should be updated in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            opps (list):                        A list of dicts containing all of the opps to upload
            action (string, optional):          This tells the server how to process the objects. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
            dedupe_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each opportunity in the input.
        """
        call = "rest/v1/opportunities.json"
        method = "POST"
        payload = {"input": opps}
        if action is not None:
            payload["action"] = str(action)
        if dedupe_by is not None:
            payload["dedupeBy"] = str(dedupe_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def delete_opportunities(self, opps, delete_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the opportunities
        to be deleted from the databse. 
        
        Args:
            name (string):                      The name of the custom object definition
            opps (list):                        A list of dicts containing all of the opportunities to delete.
            delete_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/opportunities/delete.json"
        method = "POST"
        payload = {"input": opps}
        if delete_by is not None:
            payload["deleteBy"] = str(delete_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def get_opportunities(self, filter_type, filter_values=None, fields=None, 
                           paging_token=None, batch_size=None):
        """
        This call searches for opportunities and returns the ones that fit the search
        criteria. The semantics of this API call are almost identical to
        get_multiple_leads_by_filter_type(). 
        
        Args:
            filter_type (string):               This should be the API name of the field to filter on.
            filter_values (list, optional):     This is a list of possible values for the field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired fields to be included in the response.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
            batch_size (int, optional):         The number of objects to include in the response. Default and max is 300.
            
        Returns:
            dict:   The response from the server. It includes metadata on each object that matches
                    the search criteria such as created date, modified date, Marketo id etc.
        """
        call = "rest/v1/opportunities.json?_method=GET"
        method = "POST"
        payload = {"filterType": str(filter_type)}
        if filter_values is not None:
            payload["input"] = list(map(str, filter_values))
        if fields is not None:
            payload["fields"] = list(map(str, fields))
        if paging_token is not None:
            payload["nextPageToken"] = str(paging_token)
        if batch_size is not None:
            payload["batchSize"] = str(batch_size)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def describe_opportunity_role(self):
        """
        This API call retrieves all of the metadata associated with the opportunity role
        object including all of the fields. The opportunity role object is what bridges
        the opportunity object with the lead object.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes the id field, all of the
                    dedupe fields, the searchable fields and the non-searchable fields.
        """
        call = "rest/v1/opportunities/roles/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def create_update_opportunity_roles(self, roles, action=None, dedupe_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the oportunity roles
        and their attributes that should be updated in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            roles (list):                       A list of dicts containing all of the roles. to upload
            action (string, optional):          This tells the server how to process the objects. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
            dedupe_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each opportunity in the input.
        """
        call = "rest/v1/opportunities/roles.json"
        method = "POST"
        payload = {"input": roles}
        if action is not None:
            payload["action"] = str(action)
        if dedupe_by is not None:
            payload["dedupeBy"] = str(dedupe_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def delete_opportunity_roles(self, roles, delete_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the opportunity roles
        to be deleted from the database.
        
        Args:
            roles (list):                       A list of dicts containing all of the opportunity roles to delete.
            delete_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/opportunities/roles/delete.json"
        method = "POST"
        payload = {"input": roles}
        if delete_by is not None:
            payload["deleteBy"] = str(delete_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def get_oportunity_roles(self, filter_type, filter_values=None, fields=None, 
                                paging_token=None, batch_size=None):
        """
        This call searches for opportunity roles and returns the ones that fit the search
        criteria. The semantics of this API call are almost identical to
        get_multiple_leads_by_filter_type(). 
        
        Args:
            filter_type (string):               This should be the API name of the field to filter on.
            filter_values (list, optional):     This is a list of possible values for the field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired fields to be included in the response.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
            batch_size (int, optional):         The number of objects to include in the response. Default and max is 300.
            
        Returns:
            dict:   The response from the server. It includes metadata on each object that matches
                    the search criteria such as created date, modified date, Marketo id etc.
        """
        call = "rest/v1/opportunities/roles.json?_method=GET"
        method = "POST"
        payload = {"filterType": str(filter_type)}
        if filter_values is not None:
            payload["input"] = list(map(str, filter_values))
        if fields is not None:
            payload["fields"] = list(map(str, fields))
        if paging_token is not None:
            payload["nextPageToken"] = str(paging_token)
        if batch_size is not None:
            payload["batchSize"] = str(batch_size)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                              Company API Calls                                           # 
#                                                                                          #             
############################################################################################
    
    def describe_company(self):
        """
        This API call retrieves all of the metadata associated with the company
        object including all of the fields. 
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes the id field, all of the
                    dedupe fields, the searchable fields and the non-searchable fields.
        """
        call = "rest/v1/companies/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def create_update_companies(self, companies, action=None, dedupe_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the companies
        and their attributes that should be updated in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            companies (list):                   A list of dicts containing all of the roles. to upload
            action (string, optional):          This tells the server how to process the objects. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
            dedupe_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each opportunity in the input.
        """
        call = "rest/v1/companies.json"
        method = "POST"
        payload = {"input": companies}
        if action is not None:
            payload["action"] = str(action)
        if dedupe_by is not None:
            payload["dedupeBy"] = str(dedupe_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def delete_companies(self, companies, delete_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the companies
        to be deleted from the database.
        
        Args:
            roles (list):                       A list of dicts containing all of the opportunity roles to delete.
            delete_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/companies/delete.json"
        method = "POST"
        payload = {"input": companies}
        if delete_by is not None:
            payload["deleteBy"] = str(delete_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def get_companies(self, filter_type, filter_values=None, fields=None, 
                        paging_token=None, batch_size=None):
        """
        This call searches for companies and returns the ones that fit the search
        criteria. The semantics of this API call are almost identical to
        get_multiple_leads_by_filter_type(). 
        
        Args:
            filter_type (string):               This should be the API name of the field to filter on.
            filter_values (list, optional):     This is a list of possible values for the field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired fields to be included in the response.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
            batch_size (int, optional):         The number of objects to include in the response. Default and max is 300.
            
        Returns:
            dict:   The response from the server. It includes metadata on each object that matches
                    the search criteria such as created date, modified date, Marketo id etc.
        """
        call = "rest/v1/opportunities/roles.json?_method=GET"
        method = "POST"
        payload = {"filterType": str(filter_type)}
        if filter_values is not None:
            payload["input"] = list(map(str, filter_values))
        if fields is not None:
            payload["fields"] = list(map(str, fields))
        if paging_token is not None:
            payload["nextPageToken"] = str(paging_token)
        if batch_size is not None:
            payload["batchSize"] = str(batch_size)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                             Sales Person API Calls                                       # 
#                                                                                          #             
############################################################################################
    
    def describe_sales_person(self):
        """
        This API call retrieves all of the metadata associated with the sales person
        object including all of the fields. 
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes the id field, all of the
                    dedupe fields, the searchable fields and the non-searchable fields.
        """
        call = "rest/v1/salespersons/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def create_update_sales_persons(self, people, action=None, dedupe_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the companies
        and their attributes that should be updated in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            people (list):                      A list of dicts containing all of the roles. to upload
            action (string, optional):          This tells the server how to process the objects. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
            dedupe_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each opportunity in the input.
        """
        call = "rest/v1/salespersons.json"
        method = "POST"
        payload = {"input": people}
        if action is not None:
            payload["action"] = str(action)
        if dedupe_by is not None:
            payload["dedupeBy"] = str(dedupe_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def delete_sales_persons(self, people, delete_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the sales people
        to be deleted from the database.
        
        Args:
            people (list):                      A list of dicts containing all of the people to delete.
            delete_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/salespersons/delete.json"
        method = "POST"
        payload = {"input": people}
        if delete_by is not None:
            payload["deleteBy"] = str(delete_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def get_sales_persons(self, filter_type, filter_values=None, fields=None, 
                            paging_token=None, batch_size=None):
        """
        This call searches for people and returns the ones that fit the search
        criteria. The semantics of this API call are almost identical to
        get_multiple_leads_by_filter_type(). 
        
        Args:
            filter_type (string):               This should be the API name of the field to filter on.
            filter_values (list, optional):     This is a list of possible values for the field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired fields to be included in the response.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
            batch_size (int, optional):         The number of objects to include in the response. Default and max is 300.
            
        Returns:
            dict:   The response from the server. It includes metadata on each person that matches
                    the search criteria such as created date, modified date, Marketo id etc.
        """
        call = "rest/v1/salespersons.json?_method=GET"
        method = "POST"
        payload = {"filterType": str(filter_type)}
        if filter_values is not None:
            payload["input"] = list(map(str, filter_values))
        if fields is not None:
            payload["fields"] = list(map(str, fields))
        if paging_token is not None:
            payload["nextPageToken"] = str(paging_token)
        if batch_size is not None:
            payload["batchSize"] = str(batch_size)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                             Custom Object API Calls                                      # 
#                                                                                          #             
############################################################################################
    
    def list_custom_objects(self, names=None):
        """
        This method retrieves the definition of the custom objects given by the names
        parameter. If the parameter isn't used, then all definitions are returned.
        
        Args:
            names (list, optional): The names of the custom object definitions to query. If
                                    omitted, the system will return all definitions.
        
        Returns:
            dict:   The response from the server that contains all of the information
                    about the custom objects such as display name, dedupe fields, relationships etc.
        """
        call = "rest/v1/customobjects.json?"
        if names is not None:
            call += "&names="+",".join(map(str, names))
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def describe_custom_object(self, name):
        """
        Similar to list_custom_objects(), this method retrieves metadata about custom
        objects. The difference is that this method will only return one object definition,
        but the definition returned here includes all of the custom object fields.
        
        Args:
            name (string):  The name of the custom object to describe.
            
        Returns:
            dict:   The response frm the server that includes all information from 
                    list_custom_objects() but includes all of the fields.
        """
        call = "rest/v1/customobjects/"+str(name)+"/describe.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    # TODO check for >300
    def create_update_custom_objects(self, name, objects, action=None, dedupe_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the objects
        and their attributes that should be updated in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            name (string):                      The name of the custom object definition
            objects (list):                     A list of dicts containing all of the objects to upload
            action (string, optional):          This tells the server how to process the objects. 
                                                The possible values are: 
                                                'createOnly'
                                                'updateOnly'
                                                'createOrUpdate' --> default if parameter isn't given
            dedupe_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/customobjects/"+str(name)+".json"
        method = "POST"
        payload = {"input": objects}
        if action is not None:
            payload["action"] = str(action)
        if dedupe_by is not None:
            payload["dedupeBy"] = str(dedupe_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))

    def delete_custom_objects(self, name, objects, delete_by=None):
        """
        This method makes takes a list of dictionaries that represent all of the objects
        and their attributes that should be deleted in Marketo. It takes that list, and
        does an upsert operation to the Marketo database.
        
        Args:
            name (string):                      The name of the custom object definition
            objects (list):                     A list of dicts containing all of the objects to delete.
            delete_by (string, optional):       This specifies how to dedupe the objects. The allowed
                                                values are:
                                                'dedupeFields' - Default. These are set when the object
                                                                 is created.
                                                'idField' - The unique id of the object.
            
        Returns:
            dict:   A dictionary that has the completion status for each object. in the input.
        """
        call = "rest/v1/customobjects/"+str(name)+"/delete.json"
        method = "POST"
        payload = {"input": objects}
        if delete_by is not None:
            payload["deleteBy"] = str(delete_by)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    # TODO - test how scalable this is as a true GET request. I don't think it will work with 
    # the filterType thing and how you need to use the request body if you have more than 
    # one searchable field.
    def get_custom_objects(self, name, filter_type, filter_values=None, fields=None, 
                           paging_token=None, batch_size=None):
        """
        This call searches for custom objects and returns the ones that fit the search
        criteria. The semantics of this API call are almost identical to
        get_multiple_leads_by_filter_type(). 
        
        Args:
            name (string):                      The name of the custom object definition.
            filter_type (string):               This should be the API name of the field to filter on.
            filter_values (list, optional):     This is a list of possible values for the field. If a lead's
                                                field matches any of the given values, it will be included in the response.
            fields (list, optional):            A list of desired fields to be included in the response.
            paging_token (string, optional):    A token that will be used to start pagination through large result sets.
                                                It is recommended to always include this parameter, so that it will be
                                                guaranteed that all results are received.
            batch_size (int, optional):         The number of objects to include in the response. Default and max is 300.
            
        Returns:
            dict:   The response from the server. It includes metadata on each object that matches
                    the search criteria such as created date, modified date, Marketo id etc.
        """
        call = "rest/v1/customobjects/"+str(name)+".json?_method=GET"
        method = "POST"
        payload = {"filterType": str(filter_type)}
        if filter_values is not None:
            payload["input"] = list(map(str, filter_values))
        if fields is not None:
            payload["fields"] = list(map(str, fields))
        if paging_token is not None:
            payload["nextPageToken"] = str(paging_token)
        if batch_size is not None:
            payload["batchSize"] = str(batch_size)
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                                Folder API Calls                                          # 
#                                                                                          #             
############################################################################################
    
    def browse_folders(self, root, offset=None, max_depth=None, max_return=None, workspace=None):
        """
        This method returns a list of folders in Marketo. It is used to most commonly to retrieve 
        folder ids based on other folder information.
        
        Args:
            root (int):                     The id of the parent folder
            offset (int, optional):         Which index inside the parent to start from (default 0)
            max_depth (int, optional):      Maximum levels of recursion (default 2)
            max_return (int, optional):     Maximum folders to returns (default 20, max 200)
            workspace (string, optional):   Which workspace to search in
            
        Returns:
            dict:   The response from the server. The "result" attribute contains all of the 
                    folder attributes for the folders in Marketo.
        """
        call = "rest/asset/v1/folders.json?root="+str(root)
        method = "GET"
        
        if offset is not None:
            call += "&offSet="+str(offset)
        if max_depth is not None:
            call += "&maxDepth="+str(max_depth)
        if max_return is not None:
            call += "&maxReturn="+str(max_return)
        if workspace is not None:
            call += "&workSpace="+workspace
        
        return self.__generic_api_call(call, method)
    
    def get_folder_by_id(self, folder_id):
        """
        This method retrieves the metadata of the folder with the given id.
        
        Args:
            folder_id (int):    The id of the folder.
            
        Returns:
            dict:   The response from the server. The "result" attribute contains
                    the same information that an individual result from the browse
                    folders call.
        """
        call = "rest/asset/v1/folder/"+str(folder_id)+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_folder_by_name(self, folder_name, root=None, workspace=None):
        """
        This method retrieves the metadata of the folder with the given name.
        
        Args:
            folder_name (name):             The name of the folder
            root (int, optional):           The id of the parent folder
            workspace (string, optional):   The workspace that the folder is in
            
        Returns:
            dict:   The response from the server. The same data that is returned
                    by the get folder by id call.
        """
        call = "rest/asset/v1/folder/byName.json?name="+folder_name
        method = "GET"
        
        if root is not None:
            call += "&root="+str(root)
        if workspace is not None:
            call += "&workSpace="+workspace
        
        return self.__generic_api_call(call, method)
    
    def create_folder(self, name, parent, description=None):
        """
        This method generates a folder inside of Marketo. Attributes such as
        type, isArchive, path etc. are inherited from the parent folder. 
        
        Args:
            name (string):                  The desired name of the folder
            parent (int):                   The id of the parent folder
            description (string, optional): A description of the folder
            
        Returns:
            dict:   The response from the server that indicates success or failure. It
                    also includes the metadata similar to get folder by id, get folder by
                    name, and browse folders.
        """
        call = "rest/asset/v1/folders.json?name="+name+"&parent="+parent
        method = "POST"

        if description is not None:
            call += "&description="+description

        return self.__generic_api_call(call, method)
        
    def delete_folder(self, folder_id, folder_type):
        """
        This method deletes the folder with the given id.
        
        Args:
            folder_id (int):        The id of the folder to be deleted
            folder_type (string):   Type of folder. Either "Folder" or "Program"
            
        Returns:
            dict:   The response from the server indicating success or failure. 
        """
        call = "rest/asset/v1/folder/"+folder_id+"/delete.json"
        method = "POST"
        payload = "type="+folder_type
        return self.__generic_api_call(call, method, payload=payload)
    
    def update_folder(self, folder_id, folder_type, description=None, name=None, is_archive=None):
        """
        This method allows updating of the folder name, description and the option
        of archiving the folder.
        
        Args:
            folder_id (int):                The id of the folder to be deleted
            folder_type (string):           Type of folder. Either "Folder" or "Program"
            description (string, optional): The updated folder description
            name (string, optional):        The updated name of the folder
            is_archive (boolean, optional): Whether or not the folder should be archived.
            
        Returns:
            dict:   The response from the server that indicates success or failure. It
                    also includes the metadata similar to get folder by id, get folder by
                    name, and browse folders.
        """
        call = "rest/asset/v1/folder/"+folder_id+".json"
        method = "POST"
        payload = {}
        if description is not None:
            payload["description"] = description
        if name is not None:
            payload["name"] = name
        if is_archive is not None:
            payload["isArchive"] = is_archive
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                                 Token API Calls                                          # 
#                                                                                          #             
############################################################################################
        
    def create_token(self, parent_id, folder_type, token_type, name, value):
        """
        This method creates a token at the folder level or the program level.
        
        Args:
            parent_id (int):        The id of the folder/program to place the token in
            folder_type (string):   Type of parent folder. Either "Folder" or "Program"
            token_type (string):    The type of the token. See below for list of types.
            name (string):          The name of the token
            value (string):         The value of the token. If it is a date token, it must
                                    be in the format yyyy-mm-dd. If it is a score, it must
                                    be preceeded by a +, - or = to indicate a score increment,
                                    decrement, or reset respectively.
            
        Returns:
            dict:   The response from the server that includes the calculated URL of 
                    the new token.
            
        Available Data Types:
        
        date                A date value
        iCalendar           A .ics file
        number              An integer
        rich text           HTML text
        score               A score increment, decrement or reset
        script block        A Velocity script
        sfdc campaign       Used in SFDC campaign management integration
        text                Plain text
        
        *Types are case sensitive
        """
        call = "rest/asset/v1/folder/"+str(parent_id)+"/tokens.json"
        method = "POST"
        # payload = { "folderType": folder_type,
        #            "type": token_type,
        #            "name": name,
        #            "value": value}
        # return self.__generic_api_call(call, method, payload=json.dumps(payload))
        payload = "folderType="+folder_type+"&type="+token_type+"&name="+name+"&value="+value
        return self.__generic_api_call(call, method, payload=payload, content_type='application/x-www-form-urlencoded')
        
    def get_tokens(self, parent_id, folder_type):
        """
        This method lists all of the tokens under a folder/program
        
        Args:
            parent_id (int):        The id of the folder/program where the tokens
                                    are located.
            folder_type (string):   Type of parent folder. Either "Folder" or "Program".
            
        Returns:
            dict:   The response from the server that includes the folder id and name, and 
                    the token metadata.
        """
        call = "rest/asset/v1/folder/"+str(parent_id)+"/tokens.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def delete_tokens(self, parent_id, folder_type, name, token_type):
        """
        This method deletes a token from a folder/program.
        
        Args:
            parent_id (int):        The id of the folder/program where the token is.
            folder_type (string):   Type of parent folder. Either "Folder" or "Program"/
            name (string):          The name of the token
            type (string):          The type of the token. See below for list of types.
            
        Returns:
            dict:   The response from the server indicating success or failure.
            
        Available Data Types:
        
        date                A date value
        iCalendar           A .ics file
        number              An integer
        rich text           HTML text
        score               A score increment, decrement or reset
        script block        A Velocity script
        sfdc campaign       Used in SFDC campaign management integration
        text                Plain text
        
        *Types are case sensitive
        """
        call = "rest/asset/v1/folder/"+parent_id+"/token/delete.json"
        method = "POST"
        payload = {"type": token_type,
                   "name": name}
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
############################################################################################
#                                                                                          #
#                                  Email API Calls                                         # 
#                                                                                          #             
############################################################################################

    def get_emails(self, offset=None, max_return=None, status=None, folder=None):
        """
        This method gets a list of all the emails and their metadata
        from the Marketo instance.
        
        Args:
            offset (int, optional):     Specifies the start point. Can be used in conjunction
                                        with max_return to iterate through a large block of results.
            max_return (int, optional): The maximum number of records to return. Default is 20 max 200.
            status (string, optional):  The status of the email asset. Either "Approved" or "Draft".
            folder (dict, optional):    A specific folder in which to search for emails. The dictionary
                                        should be of the following format:
                                            {
                                             "id" : 1234,
                                             "type" : "Folder"
                                            }
                                        where "id" is the folder id (integer), and "type" is either 
                                        "Program" or "Folder" (string).
            
        Returns:
            dict:   The response from the server. The "result" attribute has an array of dictionaries
                    that represent the emails. It includes id, name, subject, from name, from email, 
                    whether it is operational, whether it is published to MSI etc.
        """
        call = "rest/asset/v1/emails.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_email_by_id(self, email, status=None):
        """
        This method retrieves data about an email asset given its id.
        
        Args:
            email (int):                The id of the desired email asset.
            status (string, optional):  The status of the asset. Either "Approved" or "Draft". 
            
        Returns:
            dict:   The response from the server. The "result" attribute has an array of dictionaries
                    that represent the email. It includes id, name, subject, from name, from email, 
                    whether it is operational, whether it is published to MSI etc.
        """
        call = "rest/asset/v1/email/"+str(email)+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_email_content_by_id(self, email, status=None):
        """
        This method gets an email asset's content given its id. This does not include
        HTML. Email content in Marketo means the rich text that is contained in the
        editable sections. HTML must be acquired using the email template API.
        
        Args:
            email (int):                The id of the desired email asset.
            status (string, optional):  The status of the asset. Either "Approved" 
                                        or "Draft"
            
        Returns:
            dict:   The response from the server that has the values of the editable
                    sections of the email. 
        """
        call = "rest/asset/v1/email/"+str(email)+"/content.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
############################################################################################
#                                                                                          #
#                             Email Template API Calls                                     # 
#                                                                                          #             
############################################################################################

    def get_email_templates(self, offset=None, max_return=None, status=None):
        """
        This method returns a list of all email templates and their metadata.
        
        Args:
            offset (int, optional):     Specifies the start point. Can be used in conjunction
                                        with max_return to iterate through a large block of results.
            max_return (int, optional): The maximum number of records to return. Default is 20 max 200.
            status (string, optional):  The status of the email asset. Either "Approved" or "Draft".
            
        Returns:
            dict:   The response from the server. The "results" attribute is an array of dictionaries
                    that represent the email templates. It includes the id, the name, workspace, last
                    modified date etc.
        """
        call = "rest/asset/v1/emailTemplates.json"
        method = "GET"
        return self.__generic_api_call(call, method)

    def get_email_template_by_id(self, template_id, status=None):
        """
        This method returns the meta data of the given email template.
        
        Args:
            template_name (string):     The name of the desired email template.
            status (string, optional):  The status of the email asset. Either "Approved" or "Draft".
            
        Returns:
            dict:   The response from the server. It includes the same data as get_email_templates
                    just for the specific one given.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+".json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_email_template_by_name(self, template_name, status=None):
        """
        This method returns the meta data of the given email template.
        
        Args:
            template_name (string):     The name of the desired email template.
            status (string, optional):  The status of the email asset. Either "Approved" or "Draft".
            
        Returns:
            dict:   The response from the server. It includes the same data as get_email_templates
                    just for the specific one given.
        """
        call = "rest/asset/v1/emailTemplate/byName.json?name="+template_name
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_email_template_content_by_id(self, template_id, status=None):
        """
        This method returns the HTML of the given email template
        
        This method returns the meta data of the given email template.
        
        Args:
            template_id (int):          The name of the desired email template.
            status (string, optional):  The status of the email asset. Either "Approved" or "Draft".
            
        Returns:
            dict:   The response from the server. It includes the actual HTML of
                    the email template.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/content.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def update_email_template(self, template_id, name=None, description=None):
        """
        This method updates the name and/or description of the given email template.
        
        Args:
            template_id (string):             The id of the desired email template
            name (string, optional):          The new name of the email template
            description (string, optional):   The new description of the email template
            
        Returns:
            dict:   The response from the server that contains the updated
                    asset metadata.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+".json"
        method = "POST"
        payload = {}
        if name is not None:
            payload["name"] = name
        if description is not None:
            payload["description"] = description
        return self.__generic_api_call(call, method, payload=json.dumps(payload))
    
    def approve_email_template(self, template_id):
        """
        This method approves the given email template. This method also works on 
        drafts that are created underneath the given template.
        
        Args:
            template_id (int):   The id of the desired email template.
            
        Returns:
            dict:   The response from the server that includes the updated status.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/approveDraft.json"
        method = "POST"
        return self.__generic_api_call(call, method)      
    
    def unapprove_email_template(self, template_id):
        """
        This method unapproves the given email template.
        
        Args:
            template_id (id):   The id of the desired email template
            
        Returns:
            dict:   The response from the server that includes the updated status.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/unapprove.json"
        method = "POST"
        return self.__generic_api_call(call, method)    
    
    def delete_email_template(self, template_id):
        """
        This method deletes the given email template.
        
        Args:
            template_id (int):   The id of the desired email template
            
        Returns:
            dict:   The response from the server that indicates success or failure.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/delete.json"
        method = "POST"
        return self.__generic_api_call(call, method)
    
    def discard_email_template_draft(self, template_id):
        """
        This method discards the draft of the given email template.
        
        Args:
            template_id (int):   The id of the desired email template
            
        Returns:
            dict:   The response from the server indicating success or failure.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/discardDraft.json"
        method = "POST"
        return self.__generic_api_call(call, method)
    
    def clone_email_template(self, template_id, name, folder):
        """
        This method clones the given email template.
        
        Args:
            template_id (string):   The id of the desired email template.
            name (string):          The name of the new email template.
            folder (string):        A specific folder in which to search for emails. The dictionary
                                    should be of the following format:
                                        {
                                         "id" : 1234,
                                         "type" : "Folder"
                                        }
                                    where "id" is the folder id (integer), and "type" is either 
                                    "Program" or "Folder" (string).
            
        Returns:
            dict:   The response from the server which includes all of the metadata
                    of the newly created asset.
        """
        call = "rest/asset/v1/emailTemplate/"+template_id+"/clone.json"
        method = "POST"
        payload = {}
        payload["name"] = name
        payload["folder"] = folder
        return self.__generic_api_call(call, method, payload=json.dumps(payload))

############################################################################################
#                                                                                          #
#                                Program API Calls                                         # 
#                                                                                          #             
############################################################################################

    def create_program(self, parent_folder, name, program_type, channel, description, tags=None):
        """
        This method makes takes an array of dictionaries that represent all of the leads
        and their attributes that should be updated in Marketo. It takes that array, and
        does an upsert operation to the Marketo database.
        
        Args:
            parent_folder (mkto type/id pair):  e.g. {"type": "Folder","id": 26}
            
            name (string):                      Name of program                   
                                                
            type (string):                      New Program type, e.g. "Default"

            channel (string):                   New program channel, e.g. "Content"

            description (multipart):            Basically a description string

            tags (multipart, optional):         Tag list or single tag string

            costs (multipart, optional):        [{"startDate":"2015-06-01","cost":100,"note":"this is the cost"}]
                                                *Costs implemented in wiki version but not docs, may not be available
            
        Returns:
            dict:   A dictionary that has the completion status and program information similar to get_program.
        """
        
        call = "rest/asset/v1/programs.json"
        method = "POST"
        #POST PUBLIC RELEASE:
        #payload = "folder="+json.dumps(parent_folder)+"&name="+name+"&type="+program_type+"&description="+description+"&channel="+channel
        #PRE PUBLIC RELEASE:
        payload = "folders="+json.dumps(parent_folder)+"&programName="+name+"&programType="+program_type+"&programDescription="+description+"&programChannel="+channel
        if tags:
            payload+="&tags="+tags
        return self.__generic_api_call(call, method, payload=payload, content_type='application/x-www-form-urlencoded')
    
############################################################################################
#                                                                                          #
#                               Administrative API Calls                                   # 
#                                                                                          #             
############################################################################################
    
    def get_daily_usage(self):
        """
        This method retrieves the number of API calls used across all API users for that
        day. This counter is reset at 12:00am PST. 
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes each API user and the
                    associated number of API calls that user has made.
        """
        call = "rest/v1/stats/usage.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_weekly_usage(self):
        """
        This method is identical to get_daily_usage() except that it returns
        results for the 7 days prior to when the call is made.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes each API user and the
                    associated number of API calls that user has made.
        """
        call = "rest/v1/stats/usage/last7days.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_daily_errors(self):
        """
        This method retrieves the number of API calls that resulted in errors. The response
        is sorted by Marketo error code.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes each error code
                    and the amount of times it was returned.
        """
        call = "rest/v1/stats/errors.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
    def get_daily_errors(self):
        """
        This method is identical to get_daily_errors() except that it returns
        results for the 7 days prior to when the call is made.
        
        Args:
            None
            
        Returns:
            dict:   The response from the server that includes each error code
                    and the amount of times it was returned.
        """
        call = "rest/v1/stats/errors/last7days.json"
        method = "GET"
        return self.__generic_api_call(call, method)
    
############################################################################################
#                                                                                          #
#                                        Main                                              # 
#                                                                                          #             
############################################################################################
     
if __name__ == "__main__":
    logging.basicConfig(filename="logs.log", filemode="w", level=logging.DEBUG)
    munchkin = settings.MUNCHKIN
    client_id = settings.CLIENT_ID
    client_secret = settings.CLIENT_SECRET
    marketo = MarketoWrapper(munchkin, client_id, client_secret)
        
#    print(marketo.get_lead_by_id("5"))
    print(marketo.get_multiple_leads_by_list_id(1013, batch_size=1))

#    print(marketo.get_email_content_by_id(1108))

#    print(marketo.get_email_templates())
#    print(marketo.get_email_template_by_name("delete me"))
#    print(marketo.update_email_template("1011", description="sadfsdf"))
#    print(marketo.approve_email_template("1014"))
#    print(marketo.unapprove_email_template("1014"))
#    print(marketo.delete_email_template("1014"))
#    print(marketo.discard_email_template_draft("1014"))
#    print(marketo.clone_email_template("1014", "delete me clone", "15"))

#    print(marketo.browse_folders(129))
#    print(marketo.create_folder("delete me", 129))
#    print(marketo.delete_folder(178))
#    print(marketo.get_folder_by_id(129))
#    print(marketo.get_folder_by_name("Blog"))
#    print (marketo.update_folder(129, "stuff", "Blog Changed"))

#    print (marketo.get_tokens(129))
#    print (marketo.create_token("1083", "Program", "text", "api token", "Hello there!"))