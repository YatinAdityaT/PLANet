import requests
url = 'http://127.0.0.3:5001/result'

# url = 'http://127.0.0.3:5001/jsondata'

# data_send = {'R_l': 0, 'G_l': 0, 'B_l': 0, 'R_h': 255, 'G_h': 255, 'B_h': 255}
# resp = requests.post(url, data = data_send)
# print(resp.text)

resp = requests.get(url=url)
print(resp)
data = resp.json()
print(data)