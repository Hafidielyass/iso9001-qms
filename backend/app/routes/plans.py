from flask import jsonify, request
from app.routes import bp
from app.models.plan import PlanDAction
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

@bp.route('/plans', methods=['GET'])
@jwt_required()
def get_plans():
    plans = PlanDAction.query.all()
    return jsonify([{
        'id': plan.id,
        'description': plan.description,
        'date_debut': plan.date_debut.isoformat() if plan.date_debut else None,
        'date_fin': plan.date_fin.isoformat() if plan.date_fin else None,
        'statut': plan.statut,
        'priorite': plan.priorite,
        'responsable': plan.responsable.nom if plan.responsable else None
    } for plan in plans])

@bp.route('/plans/<int:id>', methods=['GET'])
@jwt_required()
def get_plan(id):
    plan = PlanDAction.query.get_or_404(id)
    return jsonify({
        'id': plan.id,
        'description': plan.description,
        'date_debut': plan.date_debut.isoformat() if plan.date_debut else None,
        'date_fin': plan.date_fin.isoformat() if plan.date_fin else None,
        'statut': plan.statut,
        'priorite': plan.priorite,
        'responsable': plan.responsable.nom if plan.responsable else None
    })

@bp.route('/plans', methods=['POST'])
@jwt_required()
def create_plan():
    data = request.get_json()
    
    plan = PlanDAction(
        description=data['description'],
        date_debut=datetime.fromisoformat(data['date_debut']) if data.get('date_debut') else None,
        date_fin=datetime.fromisoformat(data['date_fin']) if data.get('date_fin') else None,
        statut=data.get('statut', 'En attente'),
        priorite=data.get('priorite', 'Normale'),
        responsable_id=data.get('responsable_id')
    )
    
    db.session.add(plan)
    db.session.commit()
    
    return jsonify({'message': 'Plan d\'action created successfully'}), 201

@bp.route('/plans/<int:id>', methods=['PUT'])
@jwt_required()
def update_plan(id):
    plan = PlanDAction.query.get_or_404(id)
    data = request.get_json()
    
    if 'description' in data:
        plan.description = data['description']
    if 'date_debut' in data:
        plan.date_debut = datetime.fromisoformat(data['date_debut'])
    if 'date_fin' in data:
        plan.date_fin = datetime.fromisoformat(data['date_fin'])
    if 'statut' in data:
        plan.statut = data['statut']
    if 'priorite' in data:
        plan.priorite = data['priorite']
    if 'responsable_id' in data:
        plan.responsable_id = data['responsable_id']
    
    db.session.commit()
    return jsonify({'message': 'Plan d\'action updated successfully'})
