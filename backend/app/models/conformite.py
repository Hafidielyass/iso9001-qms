from app import db
from datetime import datetime

class Conformite(db.Model):
    __tablename__ = 'conformite'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500), nullable=False)
    statut = db.Column(db.String(50))
    
    # Relations
    exigence_id = db.Column(db.Integer, db.ForeignKey('exigence.id'))
    action_id = db.Column(db.Integer, db.ForeignKey('plan_action.id'))
    
    def __repr__(self):
        return f'<Conformité {self.id}>'
