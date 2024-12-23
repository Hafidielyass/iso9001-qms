from flask import jsonify, request
from app.routes import bp
from app.models.user import Utilisateur, Admin, Operateur
from app import db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

@bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'message': 'Missing email or password'}), 400
        
    user = Utilisateur.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            'access_token': access_token,
            'user_type': user.type,
            'user_id': user.id
        })
    
    return jsonify({'message': 'Invalid email or password'}), 401

@bp.route('/auth/register', methods=['POST'])
@jwt_required()
def register():
    # Seul un admin peut créer de nouveaux utilisateurs
    current_user = Utilisateur.query.get(get_jwt_identity())
    if not isinstance(current_user, Admin):
        return jsonify({'message': 'Unauthorized'}), 403
        
    data = request.get_json()
    
    if Utilisateur.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'Email already registered'}), 400
        
    if data['type'] == 'admin':
        user = Admin()
    elif data['type'] == 'operateur':
        user = Operateur()
    else:
        user = Utilisateur()
        
    user.nom = data['nom']
    user.email = data['email']
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user = Utilisateur.query.get(get_jwt_identity())
    return jsonify({
        'id': current_user.id,
        'email': current_user.email,
        'nom': current_user.nom,
        'type': current_user.type
    })
