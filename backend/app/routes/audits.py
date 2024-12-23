from flask import jsonify, request
from app.routes import bp
from app.models.audit import Audit
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

@bp.route('/audits', methods=['GET'])
@jwt_required()
def get_audits():
    audits = Audit.query.all()
    return jsonify([{
        'id': audit.id,
        'date': audit.date.isoformat(),
        'description': audit.description,
        'resultat': audit.resultat,
        'auditeur': audit.auditeur.nom if audit.auditeur else None
    } for audit in audits])

@bp.route('/audits/<int:id>', methods=['GET'])
@jwt_required()
def get_audit(id):
    audit = Audit.query.get_or_404(id)
    return jsonify({
        'id': audit.id,
        'date': audit.date.isoformat(),
        'description': audit.description,
        'resultat': audit.resultat,
        'auditeur': audit.auditeur.nom if audit.auditeur else None
    })

@bp.route('/audits', methods=['POST'])
@jwt_required()
def create_audit():
    data = request.get_json()
    
    audit = Audit(
        date=datetime.fromisoformat(data['date']),
        description=data['description'],
        resultat=data.get('resultat'),
        auditeur_id=get_jwt_identity()
    )
    
    db.session.add(audit)
    db.session.commit()
    
    return jsonify({'message': 'Audit created successfully'}), 201

@bp.route('/audits/<int:id>', methods=['PUT'])
@jwt_required()
def update_audit(id):
    audit = Audit.query.get_or_404(id)
    data = request.get_json()
    
    if 'date' in data:
        audit.date = datetime.fromisoformat(data['date'])
    if 'description' in data:
        audit.description = data['description']
    if 'resultat' in data:
        audit.resultat = data['resultat']
    
    db.session.commit()
    return jsonify({'message': 'Audit updated successfully'})
