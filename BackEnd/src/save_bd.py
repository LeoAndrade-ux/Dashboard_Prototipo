import time
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
import api_conecction_console as ca

mongo = MongoClient("mongodb://localhost:27017/")
db = mongo.DarkTrace


def breaches_model(ip, public_token, private_token, owner, database):
    collection = database[owner]
    # Obtener los _id existentes en la colección
    existing_ids = set(doc["_id"] for doc in collection.find({}, {"_id": 1}))
    brechas_modelo_darktrace = ca.darktrace_api_call(
        ip, public_token, private_token, "modelbreaches")
    bulk_operations = []
    for breach in brechas_modelo_darktrace:
        id = breach["pbid"]
        # Verificar si el _id ya existe en la colección
        if id not in existing_ids:
            model_name = breach["model"]["then"]["name"]
            description = breach["model"]["then"]["description"]
            score = breach["score"]
            ip = breach["device"].get("ip", "No disponible")
            breach_time = time.strftime(
                "%Y-%m-%d", time.localtime(breach["creationTime"] / 1000))

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
        try:
            collection.insert_many(bulk_operations)
        except DuplicateKeyError:
            print("Se detectaron documentos duplicados en la inserción.")


for document in db.clients.find():
    ip = document['ip']
    public_token = document['public_token']
    private_token = document['private_token']
    name_breach = document['name_breach']
    breaches_model(ip, public_token, private_token, name_breach, db)

mongo.close()
