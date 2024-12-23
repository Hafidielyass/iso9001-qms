from flask import jsonify, request
from app.routes import bp
from app.models.indicateur import IndicateurPerformance
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/indicateurs', methods=['GET'])
@jwt_required()
def get_indicateurs():
    indicateurs = IndicateurPerformance.query.all()
    return jsonify([{
        'id': indic.id,
        'nom': indic.nom,
        'description': indic.description,
        'objectif': indic.objectif,
        'frequence_calcul': indic.frequence_calcul,
        'resultat_obtenu': indic.resultat_obtenu
    } for indic in indicateurs])

@bp.route('/indicateurs/<int:id>', methods=['GET'])
@jwt_required()
def get_indicateur(id):
    indicateur = IndicateurPerformance.query.get_or_404(id)
    return jsonify({
        'id': indicateur.id,
        'nom': indicateur.nom,
        'description': indicateur.description,
        'objectif': indicateur.objectif,
        'frequence_calcul': indicateur.frequence_calcul,
        'resultat_obtenu': indicateur.resultat_obtenu
    })

@bp.route('/indicateurs', methods=['POST'])
@jwt_required()
def create_indicateur():
    data = request.get_json()
    
    indicateur = IndicateurPerformance(
        nom=data['nom'],
        description=data['description'],
        objectif=data.get('objectif'),
        frequence_calcul=data.get('frequence_calcul'),
        resultat_obtenu=data.get('resultat_obtenu', 0)
    )
    
    db.session.add(indicateur)
    db.session.commit()
    
    return jsonify({'message': 'Indicateur created successfully'}), 201

@bp.route('/indicateurs/<int:id>', methods=['PUT'])
@jwt_required()
def update_indicateur(id):
    indicateur = IndicateurPerformance.query.get_or_404(id)
    data = request.get_json()
    
    if 'nom' in data:
        indicateur.nom = data['nom']
    if 'description' in data:
        indicateur.description = data['description']
    if 'objectif' in data:
        indicateur.objectif = data['objectif']
    if 'frequence_calcul' in data:
        indicateur.frequence_calcul = data['frequence_calcul']
    if 'resultat_obtenu' in data:
        indicateur.resultat_obtenu = data['resultat_obtenu']
    
    db.session.commit()
    return jsonify({'message': 'Indicateur updated successfully'})
