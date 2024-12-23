from app import db
from werkzeug.security import generate_password_hash, check_password_hash

class Utilisateur(db.Model):
    __tablename__ = 'utilisateur'
    id = db.Column(db.Integer, primary_key=True)
    nom = db.Column(db.String(64), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    type = db.Column(db.String(50))

    __mapper_args__ = {
        'polymorphic_identity': 'utilisateur',
        'polymorphic_on': type
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Admin(Utilisateur):
    __mapper_args__ = {
        'polymorphic_identity': 'admin'
    }

    def gerer_utilisateur(self):
        pass

    def superviser_indicateur(self):
        pass

class Operateur(Utilisateur):
    __mapper_args__ = {
        'polymorphic_identity': 'operateur'
    }

    def gerer_documents(self):
        pass

    def gerer_audit(self):
        pass
