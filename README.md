# Application de Gestion de la Qualité ISO 9001

Cette application web permet la gestion complète d'un système de management de la qualité selon la norme ISO 9001.

## Fonctionnalités principales

- Gestion documentaire
- Suivi des indicateurs de performance (KPI)
- Gestion des plans d'action
- Gestion des audits
- Gestion des non-conformités
- Tableau de bord et reporting

## Structure du projet

```
iso9001-qms/
├── backend/               # API Flask
│   ├── app/
│   │   ├── models/       # Modèles de données
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Logique métier
│   │   └── utils/        # Utilitaires
│   ├── config.py         # Configuration
│   └── requirements.txt  # Dépendances Python
│
└── frontend/             # Application React
    ├── src/
    │   ├── components/   # Composants React
    │   ├── pages/        # Pages de l'application
    │   └── services/     # Services API
    └── package.json      # Dépendances JavaScript
```

## Installation

### Prérequis

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # ou `venv\Scripts\activate` sous Windows
pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Démarrage

### Backend

```bash
cd backend
flask run
```

### Frontend

```bash
cd frontend
npm start
```
