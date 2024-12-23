from app import db
from datetime import datetime

class Documents(db.Model):
    __tablename__ = 'documents'
    id = db.Column(db.Integer, primary_key=True)
    titre = db.Column(db.String(200), nullable=False)
    reference = db.Column(db.String(50), unique=True)
    date_creation = db.Column(db.DateTime, default=datetime.utcnow)
    date_modification = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    version = db.Column(db.String(20))
    chemin_fichier = db.Column(db.String(500))
    
    # Relations
    createur_id = db.Column(db.Integer, db.ForeignKey('utilisateur.id'))
    createur = db.relationship('Utilisateur', backref='documents')

    def __repr__(self):
        return f'<Document {self.titre}>'
