from app.mktorest import MarketoWrapper

#from views import restClient

# Account 312 Creds for testing
client_id = "5612d46a-9628-4d41-8b6f-7a8112de9789"
client_secret = "mf6M5INTTV9A3ShJmrq19KIBqGx8Rn1y"
munchkin = "227-MYA-498"
restClient = MarketoWrapper(munchkin, client_id, client_secret)
# ---

class FailedOut(Exception):
	def __init__(self, value=None):
		self.value = value if value else "Failed Out"
	def __str__(self):
		return repr(self.value)

def retry(func, *args, max_tries=None):
	tries=0
	if not max_tries:
		max_tries=3
	while tries<max_tries:
		try:
			return func(*args)
		except Exception as e:
			print(e)
			tries+=1
	raise FailedOut()


def clone_folder(folder_id, restClient, parent=None, name_append=None):
	#Get Parent and name via get folder_by_id
	try:
		# folder_detail = retry(restClient.get_folder_by_id, folder_id)
		# if 'result' in folder_detail and folder_detail['result']:
		# 	if not parent:
		# 		parent=folder_detail['result'][0]['parent']['id']
		# 	old_name=folder_detail['result'][0]['name']
		# else:
		# 	return false, 'Folder not found'
	#browse folder for children, get name and parent ID, gen list of children
		children = []
		failures = []
		browsed = retry(restClient.browse_folders, folder_id)
		if 'result' in browsed and browsed['result']:
			for item in browsed['result']:
				if item['id'] == folder_id:
					parent = item['parent']['id']
					old_name = item['name']
				elif item['folderId']['type'] == 'Program' or item['folderId']['type'] == 'Folder' and item['parent']['id']==folder_id:
					children.append(item)
				else:
					pass
		else:
			return False, 'Unable to find folder'
	#Create new folder in parent
		print('Creating New Folder')
		create_result=retry(restClient.create_folder, old_name + ' - clone2', parent)
		if not create_result['success']:
			return False, 'Unable to create new base folder'
	#recursively clone children (if child = program, clone to new folder, if child = folder, queue for recursive clone)
		for child in children:
			print('Cloning Child: %s' % child['name'])
			if child['folderId']['type']=='Program':
				#print(child['folderId']['id'], create_result['result'][0]['id'])
				child_result = retry(restClient.clone_program, child['folderId']['id'], create_result['result'][0]['id'], child['name'] + ' - cloned')
				#print(child_result)
				if not child_result['success']:
					failures.append({child['folderId']['id']:'Unable to clone'})
			elif child['folderId']['type']=='Folder':
				child_success, child_messages = clone_folder(child['folderId']['id'], restClient, parent=create_result['result'][0]['folderId']['id'])
				if not child_success:
					failures.append(child_messages)
		return True, failures
	except FailedOut as e:
		print(e)
		return False, 'Unable to connect to Marketo'

	# try:
	# 	result = {
	# 		'a': lambda x: x * 5,
	# 		'b': lambda x: x + 7,
	# 		'c': lambda x: x - 2
	# 	}[value](x)