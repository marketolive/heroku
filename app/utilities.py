from app.mktorest import MarketoWrapper

from app.setvars import restClient
import json

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


def clone_folder(folder_id, restClient, parent=None, name_append='', just_children=False):
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
					if not parent:
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
		create_result=retry(restClient.create_folder, old_name + name_append, parent)
		if not create_result['success']:
			return False, 'Unable to create new base folder: '+json.dumps(create_result['errors'])
	#recursively clone children (if child = program, clone to new folder, if child = folder, queue for recursive clone)
		for child in children:
			print('Cloning Child: %s' % child['name'])
			if child['folderId']['type']=='Program':
				#print(child['folderId']['id'], create_result['result'][0]['id'])
				child_result = retry(restClient.clone_program, child['folderId']['id'], create_result['result'][0]['id'], child['name'] + name_append)
				#print(child_result)
				if not child_result['success']:
					failures.append({child['folderId']['id']:'Unable to clone'})
			elif child['folderId']['type']=='Folder':
				child_success, child_messages = clone_folder(child['folderId']['id'], restClient, parent=create_result['result'][0]['id'], name_append=name_append)
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