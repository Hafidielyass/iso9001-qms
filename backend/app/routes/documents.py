from flask import jsonify, request, send_file
from app.routes import bp
from app.models.document import Documents
from app import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from werkzeug.utils import secure_filename
from datetime import datetime

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'xls', 'xlsx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/documents', methods=['GET'])
@jwt_required()
def get_documents():
    documents = Documents.query.all()
    return jsonify([{
        'id': doc.id,
        'titre': doc.titre,
        'reference': doc.reference,
        'version': doc.version,
        'date_creation': doc.date_creation.isoformat(),
        'date_modification': doc.date_modification.isoformat()
    } for doc in documents])

@bp.route('/documents/<int:id>', methods=['GET'])
@jwt_required()
def get_document(id):
    document = Documents.query.get_or_404(id)
    return jsonify({
        'id': document.id,
        'titre': document.titre,
        'reference': document.reference,
        'version': document.version,
        'date_creation': document.date_creation.isoformat(),
        'date_modification': document.date_modification.isoformat()
    })

@bp.route('/documents', methods=['POST'])
@jwt_required()
def create_document():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'message': 'File type not allowed'}), 400
        
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    
    document = Documents(
        titre=request.form.get('titre'),
        reference=request.form.get('reference'),
        version=request.form.get('version', '1.0'),
        createur_id=get_jwt_identity(),
        chemin_fichier=filepath
    )
    
    file.save(filepath)
    db.session.add(document)
    db.session.commit()
    
    return jsonify({'message': 'Document created successfully'}), 201

@bp.route('/documents/<int:id>', methods=['PUT'])
@jwt_required()
def update_document(id):
    document = Documents.query.get_or_404(id)
    data = request.get_json()
    
    document.titre = data.get('titre', document.titre)
    document.reference = data.get('reference', document.reference)
    document.version = data.get('version', document.version)
    document.date_modification = datetime.utcnow()
    
    db.session.commit()
    return jsonify({'message': 'Document updated successfully'})

@bp.route('/documents/<int:id>/download', methods=['GET'])
@jwt_required()
def download_document(id):
    document = Documents.query.get_or_404(id)
    return send_file(document.chemin_fichier, as_attachment=True)
