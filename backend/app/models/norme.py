from app import db

class Norme(db.Model):
    __tablename__ = 'norme'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500))
    sous_chapitre = db.Column(db.String(100))
    
    # Relations
    exigences = db.relationship('Exigence', backref='norme', lazy='dynamic')

    def __repr__(self):
        return f'<Norme {self.nom}>'
