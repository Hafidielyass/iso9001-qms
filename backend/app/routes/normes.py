from flask import jsonify, request
from app.routes import bp
from app.models.norme import Norme
from app.models.exigence import Exigence
from app.models.conformite import Conformite
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/normes', methods=['GET'])
@jwt_required()
def get_normes():
    normes = Norme.query.all()
    return jsonify([{
        'id': norme.id,
        'nom': norme.nom,
        'description': norme.description,
        'sous_chapitre': norme.sous_chapitre
    } for norme in normes])

@bp.route('/normes/<int:id>', methods=['GET'])
@jwt_required()
def get_norme(id):
    norme = Norme.query.get_or_404(id)
    exigences = [{
        'id': exig.id,
        'description': exig.description,
        'chapitre_applicable': exig.chapitre_applicable
    } for exig in norme.exigences]
    
    return jsonify({
        'id': norme.id,
        'nom': norme.nom,
        'description': norme.description,
        'sous_chapitre': norme.sous_chapitre,
        'exigences': exigences
    })

@bp.route('/normes/<int:id>/exigences', methods=['GET'])
@jwt_required()
def get_norme_exigences(id):
    norme = Norme.query.get_or_404(id)
    return jsonify([{
        'id': exig.id,
        'description': exig.description,
        'chapitre_applicable': exig.chapitre_applicable
    } for exig in norme.exigences])

@bp.route('/exigences/<int:id>/conformites', methods=['GET'])
@jwt_required()
def get_exigence_conformites(id):
    exigence = Exigence.query.get_or_404(id)
    return jsonify([{
        'id': conf.id,
        'description': conf.description,
        'statut': conf.statut
    } for conf in exigence.conformites])



@bp.route('/conformites', methods=['POST'])
@jwt_required()
def create_conformite():
    data = request.get_json()
    
    conformite = Conformite(
        description=data['description'],
        statut=data.get('statut', 'En cours'),
        exigence_id=data['exigence_id'],
        action_id=data.get('action_id')
    )
    
    db.session.add(conformite)
    db.session.commit()
    
    return jsonify({'message': 'Conformité created successfully'}), 201

@bp.route('/conformites/<int:id>', methods=['PUT'])
@jwt_required()
def update_conformite(id):
    conformite = Conformite.query.get_or_404(id)
    data = request.get_json()
    
    if 'description' in data:
        conformite.description = data['description']
    if 'statut' in data:
        conformite.statut = data['statut']
    if 'action_id' in data:
        conformite.action_id = data['action_id']
    
    db.session.commit()
    return jsonify({'message': 'Conformité updated successfully'})
