from app import db
from datetime import datetime

class PlanDAction(db.Model):
    __tablename__ = 'plan_action'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500), nullable=False)
    date_debut = db.Column(db.DateTime)
    date_fin = db.Column(db.DateTime)
    statut = db.Column(db.String(50))
    priorite = db.Column(db.String(20))
    
    # Relations
    responsable_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    responsable = db.relationship('Utilisateur', backref='plans_action')
    
    def __repr__(self):
        return f'<Plan d\'Action {self.id}>'

    def create_plan(self):
        pass

    def update_progress(self):
        pass
