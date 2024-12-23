from flask import Blueprint

bp = Blueprint('api', __name__, url_prefix='/api')

from app.routes import auth, documents, plans, audits, indicateurs, normes
