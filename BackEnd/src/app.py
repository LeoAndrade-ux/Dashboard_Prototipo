from functools import wraps
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, create_access_token, JWTManager, get_jwt_identity
from operaciones import conteo_brechas


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/DarkTrace"
mongo = PyMongo(app)

CORS(app)
bcrypt = Bcrypt(app)

# Configuración del JWTManager
app.config["JWT_SECRET_KEY"] = "your-secret-key"  # Reemplaza "your-secret-key" con una clave secreta segura
jwt = JWTManager(app)


db_breaches = mongo.db.breaches_radical
db_client = mongo.db.clients

#Definir roles y permisos
ROLES = {
    'normal': ['home', 'breaches'],
    'administrador': ['home', 'breaches', 'register', 'clients']
}
# Función de autorización para verificar los permisos del usuario
def authorize(permisos):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = db_client.find_one({'_id': ObjectId(user_id)})
            if user and 'type_user' in user:
                role = user['type_user']
                print(role)
                if role in ROLES and all(permiso in ROLES[role] for permiso in permisos):
                    return fn(*args, **kwargs)
            return jsonify(message='No tienes permisos para realizar esta acción'), 403
        return wrapper
    return decorator

#Autenticacion de clientes

# Función para obtener el usuario actual a partir del token JWT
@jwt.user_identity_loader
def user_identity_lookup(user):
    return str(user)


# Función para manejar el error de autenticación
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Unauthorized"}), 401

# Función para manejar el error de token inválido o expirado
@jwt.invalid_token_loader
def invalid_token_response(callback):
    return jsonify({"message": "Invalid token"}), 401

# Función para manejar el error de token no presente
@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({"message": "Token is missing"}), 401


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Buscar el cliente por username en la base de datos
    client = db_client.find_one({'username': username})
    if client and bcrypt.check_password_hash(client['password'], password):
        # La autenticación es exitosa, generar y devolver el token JWT
        user_type = client.get('type_user', 'normal')
        token = create_access_token(identity=str(client['_id']), additional_claims={'type_user': user_type})
        return jsonify(access_token=token), 200

    return jsonify(message='Credenciales inválidas'), 401

#Graficos

@app.route('/datos_grafica', methods=['GET'])
@jwt_required()

def obtener_datos_grafica():
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    breaches = []
    for doc in db.find().sort("_id", -1):
        breaches.append({
            '_id': str(doc['_id']),
            'model_name': doc['model_name'],
            'description': doc['description'],
            'score': doc['score'],
            'ip': doc['ip'],
            'breach_time': doc['breach_time']
        })
    datos = conteo_brechas(breaches)
    return jsonify(datos)

#Busqueda dinamica
@app.route('/buscar_clientes', methods=['GET'])
@jwt_required()
@authorize(['clients'])
def buscar_clientes():
    query = request.args.get('q','')
    resultados_clientes = db_client.find({"nombre":{"$regex":query,"$options":"i"}}).sort("_id", -1)
    return jsonify(list(resultados_clientes))

@app.route('/buscar_breaches', methods=['GET'])
@jwt_required()
@authorize(['home'])
def buscar_breaches():
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    query = request.args.get('q','')
    resultados_clientes = db.find({"model_name":{"$regex":query,"$options":"i"}}).sort("_id", -1)
    return jsonify(list(resultados_clientes))


# CRUD base de datos para las brechas


@app.route("/breaches", methods=["GET"])
@jwt_required()
@authorize(['breaches'])
def getBreaches():
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    breaches = []
    for doc in db.find().sort("_id", -1):
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
@jwt_required()
@authorize(['breaches'])
def getBreach(id):
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    user = db.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(user['_id']),
        'model_name': user['model_name'],
        'description': user['description'],
        'score': user['score'],
        'ip': user['ip'],
        'breach_time': user['breach_time']
    })


@app.route("/breaches/<id>", methods=["DELETE"])
@jwt_required()
@authorize(['breaches'])
def deleteBreach(id):
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    db.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'Breach deleted'})


@app.route("/breaches/<id>", methods=["PUT"])
@jwt_required()
@authorize(['breaches'])
def updateBreach(id):
    user_id = get_jwt_identity()
    breach = db_client.find_one({'_id': ObjectId(user_id)})['name_breach']
    db = mongo.db[breach]
    user = db.find_one({'_id': ObjectId(id)})
    db.update_one({'_id': ObjectId(id)}, {'$set': {
        'model_name': request.json.get('model_name', user['model_name']),
        'description': request.json.get('description', user['description']),
        'score': request.json.get('score', user['score']),
        'ip': request.json.get('ip', user['ip']),
        'breach_time': request.json.get('breach_time', user['breach_time'])
    }})
    return jsonify({'msg': 'Breach updated'})

# CRUD base de datos clientes

@app.route("/clientes", methods=["POST"])
@jwt_required()
@authorize(['register'])
def createUser():

    data = request.json
    # Verificar si el username ya existe en la base de datos
    if db_client.find_one({'username': data['username']}):
        return jsonify(message='El nombre de usuario ya está en uso'), 400

    # Hash de la contraseña antes de almacenarla en la base de datos
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    # Insertar el cliente en la base de datos
    client_data = {
        'name': data['name'],
        'ip': data['ip'],
        'public_token': data['public_token'],
        'private_token': data['private_token'],
        'username': data['username'],
        'password': hashed_password,
        'name_breach': 'breaches_'+ request.json.get('name').lower(),
        'type_user': 'user'
    }
    db_client.insert_one(client_data)

    return jsonify({'msg': 'True'})


@app.route("/clientes", methods=["GET"])
@jwt_required()
@authorize(['home'])
def getUsers():
    clients = []
    for doc in db_client.find():
        clients.append({
            '_id': str(doc['_id']),
            'name': doc['name'],
            'ip': doc['ip'],
            'public_token': doc['public_token'][:20]+" "+doc['public_token'][20:],
            'private_token': doc['private_token'][:20]+" "+doc['private_token'][20:],
            'username': doc['username'],
            'password': doc['password'],
            'name_breach': doc['name_breach'],
            'type_user': doc['type_user']
        })
    return jsonify(clients)




@app.route("/cliente/<id>", methods=["GET"])
@jwt_required()
@authorize(['clients'])
def getUser(id):
    user = db_client.find_one({'_id': ObjectId(id)})
    return jsonify({
        '_id': str(user['_id']),
        'name': user['name'],
        'ip': user['ip'],
        'public_token': user['public_token'],
        'private_token': user['private_token'],
        'username': user['username'],
        'password': user['password'],
        'name_breach': user['name_breach'],
        'type_user': user['type_user']
    })


@app.route("/clientes/<id>", methods=["DELETE"])
@jwt_required()
def deleteUser(id):
    db_client.delete_one({'_id': ObjectId(id)})
    return jsonify({'msg': 'User deleted'})


@app.route("/clientes/<id>", methods=["PUT"])
@jwt_required()
@authorize(['clients'])
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
