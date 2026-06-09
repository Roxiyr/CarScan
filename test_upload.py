import http.client, uuid, os

boundary='----'+uuid.uuid4().hex
file_path=r'C:\CarScan\CarScan\test_image.png'
with open(file_path,'rb') as f:
    data=f.read()
crlf='\r\n'
body=[]
body.append(f'--{boundary}')
body.append(f'Content-Disposition: form-data; name="file"; filename="{os.path.basename(file_path)}"')
body.append('Content-Type: image/png')
body.append('')
body_bytes = crlf.join(body).encode('utf-8') + crlf.encode('utf-8') + data + crlf.encode('utf-8') + (f'--{boundary}--'+crlf).encode('utf-8')
conn = http.client.HTTPConnection('127.0.0.1',8001)
conn.request('POST','/predict',body_bytes,{'Content-Type':f'multipart/form-data; boundary={boundary}'})
res = conn.getresponse()
print(res.status, res.reason)
print(res.read().decode('utf-8'))
