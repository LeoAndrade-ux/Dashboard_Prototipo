from darktrace import DarkTrace
from datetime import datetime


def darktrace_api_call(ip, public_token, private_token, attrib):  #recibe atirbuto que se desea conocer
    ### Datos para formar signature de autorización
    host = ip
    token = public_token
    private = private_token

    ### Conexión a la API
    dt = DarkTrace(host,token,private)

    call = attrib
    start_date = '2023-06-20'
    current_date=  datetime.now().strftime('%Y-%m-%d')
    params = {'from':start_date,'to':current_date}

    resp = dt.api_call(call,params)
    return resp
