from app import db
from datetime import datetime

class Audit(db.Model):
    __tablename__ = 'audit'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(500))
    resultat = db.Column(db.Text)
    
    # Relations
    auditeur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    auditeur = db.relationship('Utilisateur', backref='audits')

    def __repr__(self):
        return f'<Audit {self.id} du {self.date}>'

    def programmer_audit(self):
        pass

    def enregistrer_resultat(self):
        pass
