import requests
import tqdm
for i in tqdm.tqdm(range(50,200)):
    r = requests.get('https://api.ixiaowai.cn/api/api.php')
    with open(str(i)+'.jpg','wb') as f:
        f.write(r.content)
