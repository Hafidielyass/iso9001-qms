from app import db

class Exigence(db.Model):
    __tablename__ = 'exigence'
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(500), nullable=False)
    chapitre_applicable = db.Column(db.String(100))
    
    # Relations
    norme_id = db.Column(db.Integer, db.ForeignKey('norme.id'))
    conformites = db.relationship('Conformite', backref='exigence', lazy='dynamic')
    
    def __repr__(self):
        return f'<Exigence {self.id}>'
