import hashlib
import os
cnt = 0
dist = {}
for file in os.listdir('.'):
	if file.endswith('.jpg'):
		os.rename(file,'aasd'+file)
for file in os.listdir('.'):
	if file.endswith('.jpg'):
		hash = hashlib.md5(open(file,'rb').read()).hexdigest()
		if not hash in dist:
			dist[hash] = 1
			os.rename(file, str(cnt)+'.jpg')
			cnt = cnt + 1
		else:
			os.remove(file)

