from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/DarkTrace"
mongo = PyMongo(app)

CORS(app)



db_breaches = mongo.db.breaches_radical
db_client = mongo.db.clients

# CRUD base de datos para las brechas


@app.route("/breaches", methods=["POST"])
def createBreaches():
    result = db_breaches.insert_one({
        'model_name': request.json.get('name'),
        'description': request.json.get('description'),
        'score': request.json.get('score'),
        'ip': request.json.get('ip'),
        'breach_time': request.json.get('breach_time')
    })
    return jsonify(str(result.inserted_id))


@app.route("/breaches", methods=["GET"])
def getBreaches():
    breaches = []
    for doc in db_breaches.find():
        breaches.append({
            '_id': str(doc['_id']),
            'model_name': doc['model_name'],
            'description': doc['description'],
            'score': doc['score'],
            'ip': doc['ip'],
            'breach_time': doc['breach_time']
        })
    return jsonify(breaches)


@app.route("/breach/<id>", methods=["GET"])
def getBreach(id):
    user = db_breaches.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(user['_id']),
        'model_name': user['model_name'],
        'description': user['description'],
        'score': user['score'],
        'ip': user['ip'],
        'breach_time': user['breach_time']
    })


@app.route("/breaches/<id>", methods=["DELETE"])
def deleteBreach(id):
    db_breaches.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User deleted'})


@app.route("/breaches/<id>", methods=["PUT"])
def updateBreach(id):
    user = db_breaches.find_one({'_id': ObjectId(id)})
    db_breaches.update_one({'_id': ObjectId(id)}, {'$set': {
        'model_name': request.json.get('model_name', user['model_name']),
        'description': request.json.get('description', user['description']),
        'score': request.json.get('score', user['score']),
        'ip': request.json.get('ip', user['ip']),
        'breach_time': request.json.get('breach_time', user['breach_time'])
    }})
    return jsonify({'msg': 'User updated'})

# CRUD base de datos clientes

@app.route("/clientes", methods=["POST"])
def createUser():
    cliente = db_client.insert_one({
        'name': request.json.get('name'),
        'ip': request.json.get('ip'),
        'public_token': request.json.get('public_token'),
        'private_token': request.json.get('private_token'),
        'username': request.json.get('username'),
        'password': request.json.get('password'),
        'name_breach': 'breaches_'+ request.json.get('name').lower(),
        'type_user': 'user'
    })
    return jsonify(str(cliente.inserted_id))


@app.route("/clientes", methods=["GET"])
def getUsers():
    clients = []
    for doc in db_client.find():
        clients.append({
            '_id': str(doc['_id']),
            'name': doc['name'],
            'ip': doc['ip'],
            'public_token': doc['public_token'],
            'private_token': doc['private_token'],
            'username': doc['username'],
            'password': doc['password'],
            'name_breach': doc['name_breach'],
            'type_user': doc['type_user']
        })
    return jsonify(clients)




@app.route("/cliente/<id>", methods=["GET"])
def getUser(id):
    user = db_client.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(user['_id']),
        'name': request.json.get('name'),
        'ip': request.json.get('ip'),
        'public_token': request.json.get('public_token'),
        'private_token': request.json.get('private_token'),
        'username': request.json.get('username'),
        'password': request.json.get('password'),
        'name_breach': request.json.get('name_breach'),
        'type_user': request.json.get('type_user')
    })


@app.route("/clientes/<id>", methods=["DELETE"])
def deleteUser(id):
    db_client.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User deleted'})


@app.route("/clientes/<id>", methods=["PUT"])
def updateUser(id):
    user = db_client.find_one({'_id': ObjectId(id)})
    db_client.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': request.json.get('name', user['name']),
        'ip': request.json.get('ip',user['ip']),
        'public_token': request.json.get('public_token', user['public_token']),
        'private_token': request.json.get('private_token', user['private_token']),
        'username': request.json.get('username', user['username']),
        'password': request.json.get('password', user['password']),
        'name_breach': 'breaches_'+ request.json.get('name', user['name']).lower(),
        'type_user': request.json.get('type_user', user['type_user'])
    }})
    return jsonify({'msg': 'User updated'})


if __name__ == "__main__":
    app.run(debug=True)
