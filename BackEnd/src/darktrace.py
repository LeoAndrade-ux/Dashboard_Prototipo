import hmac
import hashlib
import requests
import json
from datetime import datetime
from urllib3.exceptions import InsecureRequestWarning


requests.packages.urllib3.disable_warnings(category=InsecureRequestWarning)


class DarkTrace(object):
    def __init__(self,ip,token,private):
        self.ip = ip
        self.token = token
        self.private = private.encode()
        self.baseUrl = "https://{i}".format(i=self.ip)

    def api_call(self,type,parameters={}):
        if not isinstance(parameters,dict):
            raise(Exception("params parameter must be type: dict"))
        paramStr = "&".join(["{0}={1}".format(k,v) for k,v in parameters.items()])
        if paramStr:
            apiStr = "/{t}?{p}".format(t=type,p=paramStr)
        else:
            apiStr = "/{t}".format(t=type)
        url = "{b}{a}".format(b=self.baseUrl,a=apiStr)
        dateStr = datetime.utcnow().isoformat(timespec="seconds")
        macStr = "{a}\n{t}\n{d}".format(a=apiStr,t=self.token,d=dateStr).encode()
        sigStr = hmac.new(key=self.private,digestmod=hashlib.sha1,msg=macStr).hexdigest()
        headers = {"DTAPI-Token":self.token,"DTAPI-Date":dateStr,"DTAPI-Signature":sigStr}
        req = requests.get(url,verify=False,headers=headers)
        if req.status_code == 200:
            resp = json.loads(req.text)
            """with open('respuesta2.json', 'w') as file:
                json.dump(resp, file, indent=4)"""
        elif req.status_code == 400:
            raise(Exception("Authentication error"))
        else:
            raise(Exception("Unknown error. HTTP status code: {0}\nRequest content: {1}".format(req.status_code,req.text)))
        return resp