from flask import jsonify, request
from app.routes import bp
from app.models.norme import Norme  
from app.models.exigence import Exigence

from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity

@bp.route('/exigences', methods=['GET'])
@jwt_required()
def get_exigences():
    exigences = Exigence.query.all()
    return jsonify([{
        'id': exigence.id,
        'description': exigence.description,
        'chapitre_applicable': exigence.chapitre_applicable
    } for exigence in exigences])
    
@bp.route('/exigences', methods=['POST'])

@jwt_required()
def create_exigence():
    data = request.get_json()
    norme = Norme.query.get_or_404(data['norme_id'])
    exigence = Exigence(description=data['description'], chapitre_applicable=data['chapitre_applicable'], norme=norme)
    db.session.add(exigence)
    db.session.commit()
    return jsonify({
        'id': exigence.id,
        'description': exigence.description,
        'chapitre_applicable': exigence.chapitre_applicable
    }), 201 # 201 Created
    
    