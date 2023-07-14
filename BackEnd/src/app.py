from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/DarkTrace"
mongo = PyMongo(app)

CORS(app)

db_breaches = mongo.db.breaches_radical
db_client = mongo.db.clientes

#CRUD base de datos para las brechas

@app.route("/breaches",methods=["POST"])
def createUser():
    result = db_breaches.insert_one({
        'model_name':request.json.get('name'),
        'description':request.json.get('description'),
        'score':request.json.get('score'),
        'ip':request.json.get('ip'),
        'breach_time':request.json.get('breach_time')
    })
    return str(result.inserted_id)

@app.route("/breaches",methods=["GET"])
def getUsers():
    breaches = []
    for doc in db_breaches.find():
        breaches.append({
            '_id': str(doc['_id']),
            'model_name':doc['model_name'],
            'description':doc['description'],
            'score':doc['score'],
            'ip':doc['ip'],
            'breach_time':doc['breach_time']
        })
    return jsonify(breaches)

@app.route("/breach/<id>",methods=["GET"])
def getUser(id):
    user = db_breaches.find_one({'_id':ObjectId(id)})
    return jsonify({
            '_id': str(user['_id']),
            'model_name':user['model_name'],
            'description':user['description'],
            'score':user['score'],
            'ip':user['ip'],
            'breach_time':user['breach_time']
        })

@app.route("/breaches/<id>",methods=["DELETE"])
def deleteUser(id):
    db_breaches.delete_one({'_id':ObjectId(id)})
    return jsonify({'msg':'User deleted'})



@app.route("/breaches/<id>",methods=["PUT"])
def updateUser(id):
    user = db_breaches.find_one({'_id':ObjectId(id)})
    db_breaches.update_one({'_id':ObjectId(id)},{'$set':{
        'model_name':request.json.get('model_name',user['model_name']),
        'description':request.json.get('description',user['description']),
        'score':request.json.get('score',user['score']),
        'ip':request.json.get('ip',user['ip']),
        'breach_time':request.json.get('breach_time',user['breach_time'])
    }})
    return jsonify({'msg':'User updated'})

#CRUD base de datos clientes


if __name__ == "__main__":
    app.run(debug=True)