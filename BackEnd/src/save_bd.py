import time
from pymongo import MongoClient
import api_conecction_console as ca

mongo = MongoClient("mongodb://localhost:27017/")
db = mongo.DarkTrace

def breaches_model(ip, public_token, private_token, owner, database):
    collection = database[owner]
    brechas_modelo_darktrace = ca.darktrace_api_call(ip, public_token, private_token, "modelbreaches")
    bulk_operations = []
    for breach in brechas_modelo_darktrace:
        id = breach["pbid"]
        model_name = breach["model"]["then"]["name"]
        description = breach["model"]["then"]["description"]
        score = breach["score"]
        ip = breach["device"].get("ip", "No disponible")
        breach_time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(breach["creationTime"] / 1000))

        document = {
            "_id": id,
            "model_name": model_name,
            "description": description,
            "score": score,
            "ip": ip,
            "breach_time": breach_time,
        }

        bulk_operations.append(document)

    if bulk_operations:
        collection.insert_many(bulk_operations)


for document in db.clients.find():
    ip = document['ip']
    public_token = document['public_token']
    private_token = document['private_token']
    name_breach = document['name_breach']
    breaches_model(ip, public_token, private_token, name_breach, db)

mongo.close()