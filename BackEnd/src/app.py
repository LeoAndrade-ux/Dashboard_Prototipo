from functools import wraps
from datetime import timedelta
from flask import Flask, request, jsonify, make_response
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, set_access_cookies, jwt_required, verify_jwt_in_request
from operaciones import conteo_brechas


app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/DarkTrace"
mongo = PyMongo(app)

CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
bcrypt = Bcrypt(app)

# Configuración del JWTManager
# Configuración del JWTManager
app.config['JWT_SECRET_KEY'] = 'tu_clave_secreta'  # Cambia esto a una clave segura en producción

app.config['JWT_COOKIE_SECURE'] = False  # Asegúrate de que esto sea True en producción para usar HTTPS
app.config['JWT_COOKIE_HTTPONLY'] = True
app.config['JWT_COOKIE_CSRF_PROTECT'] = True  # Activa esto para protegerse contra ataques CSRF
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Configura el tiempo de expiración del token (1 hora en este ejemplo)con una clave secreta segura

jwt = JWTManager(app)

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
            try:#Verifica el token JWT en la solicitud
                user_id = get_jwt_identity()
                user = db_client.find_one({'_id': ObjectId(user_id)})
                if user and 'type_user' in user:
                    role = user['type_user']
                    if role in ROLES and all(permiso in ROLES[role] for permiso in permisos):
                        return fn(*args, **kwargs)
                return jsonify(message='No tienes permisos para realizar esta acción'), 403
            except Exception as e:
                return jsonify(message='Error de autenticación'), 401  # Manejar errores de autenticación
        return wrapper
    return decorator


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
        token = create_access_token(identity=str(client['_id']), additional_claims={'role': client['type_user']})
        response = make_response(jsonify(access_token_cookie=token),200)
        set_access_cookies(response, token)
        return response

    return jsonify(message='Credenciales inválidas'), 401

#Graficos

@app.route('/datos_grafica', methods=['GET'])
@jwt_required()
@authorize(['home'])
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
@authorize(['breaches'])
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


# CRUD base de datos clientes

@app.route("/clientes", methods=["POST"])
@jwt_required()
@authorize(['clients'])
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
        'type_user': 'normal'
    }
    db_client.insert_one(client_data)

    return jsonify({'msg': 'True'})

@app.route("/clientes", methods=["GET"])
@jwt_required()
@authorize(['clients'])
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
    data = request.get_json()
    print(user)

    if data.get('password') is not None:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    else:
        hashed_password = user['password']

    # Obtener los valores actuales de la base de datos para los campos que no estén en el JSON o estén vacíos
    name = user['name'] if 'name' not in data or data['name'] == '' else data['name']
    ip = user['ip'] if 'ip' not in data or data['ip'] == '' else data['ip']
    public_token = user['public_token'] if 'public_token' not in data or data['public_token'] == '' else data['public_token']
    private_token = user['private_token'] if 'private_token' not in data or data['private_token'] == '' else data['private_token']
    username = user['username'] if 'username' not in data or data['username'] == '' else data['username']
    name_breach = user['name_breach'] if 'name_breach' not in data or data['name_breach'] == '' else data['name_breach']
    type_user = user['type_user'] if 'type_user' not in data or data['type_user'] == '' else data['type_user']

    db_client.update_one({'_id': ObjectId(id)}, {'$set': {
        'name': name,
        'ip': ip,
        'public_token': public_token,
        'private_token': private_token,
        'username': username,
        'password': hashed_password,
        'name_breach': name_breach,
        'type_user': type_user
    }})
    return jsonify({'msg': 'True'})

if __name__ == "__main__":
    app.run(debug=True)
