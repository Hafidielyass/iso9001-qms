from app import db
from datetime import datetime

class IndicateurPerformance(db.Model):
    __tablename__ = 'indicateur_performance'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    objectif = db.Column(db.Float)
    frequence_calcul = db.Column(db.String(50))
    resultat_obtenu = db.Column(db.Float)
    
    def __repr__(self):
        return f'<Indicateur {self.nom}>'

    def calculer_valeur(self):
        pass

    def faire_rapport(self):
        pass
